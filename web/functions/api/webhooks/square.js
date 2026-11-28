/**
 * Cloudflare Pages Function: /api/webhooks/square
 * Verifies Square HMAC-SHA256 webhooks and syncs completed payments
 * into Neon PostgreSQL CRM, shop_orders dropship queue, Brevo, and MCLS.
 */

import { DEFAULT_NEON_DB_URL, queryNeon, buildWebhookReactiveDraft } from '../../../lib/mclsCore.js';
import { squareApiFetch, verifySquareWebhookSignature } from '../../../lib/squareCatalog.js';

const FALLBACK_DB_URL = DEFAULT_NEON_DB_URL;
const DEFAULT_BREVO_BUYERS_LIST_ID = 3; // SOE_Buyers

async function stageMclsReactiveCard(databaseUrl, eventType, eventData) {
  try {
    const draft = buildWebhookReactiveDraft({
      event_type: eventType,
      source: 'square_webhook',
      event_data: eventData,
    });
    await queryNeon(
      databaseUrl,
      `INSERT INTO mcls_approvals
        (unit_key, action_type, title, channel, target_destination, delta_alignment, canon_status, estimated_cost, status, summary, payload)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10);`,
      [
        draft.unit_key,
        draft.action_type,
        draft.title,
        draft.channel,
        draft.target_destination,
        draft.delta_alignment || 'SCREEN_VS_SENSORY',
        draft.canon_status || 'PASS',
        draft.estimated_cost || '$0.00 (Staged)',
        draft.summary,
        JSON.stringify(draft.payload || {}),
      ]
    );
  } catch (err) {
    console.warn('MCLS reactive webhook staging warning:', err);
  }
}

async function addContactToBrevo(apiKey, email, fullName, listId) {
  if (!apiKey || !email) return;
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName || '',
          LASTNAME: lastName || '',
        },
        listIds: [Number(listId) || 3],
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.warn('Brevo sync warning:', err);
  }
}

function parseSkuFromNote(note = '', fallbackRef = '') {
  const match = String(note).match(/SKU:([A-Z0-9_-]+)/i);
  if (match?.[1]) return match[1];
  return fallbackRef || '';
}

function formatShippingAddress(addr) {
  if (!addr) return null;
  return {
    line1: addr.address_line_1 || '',
    line2: addr.address_line_2 || '',
    city: addr.locality || addr.city || '',
    state: addr.administrative_district_level_1 || addr.state || '',
    postal_code: addr.postal_code || '',
    country: addr.country || 'US',
  };
}

async function insertSquareActivity(databaseUrl, contactId, title, description, metadataJson) {
  try {
    await queryNeon(
      databaseUrl,
      `INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata)
       VALUES ($1, 'square_checkout', $2, $3, $4);`,
      [contactId, title, description, metadataJson]
    );
  } catch (err) {
    // Fallback if live Neon table still carries pre-migration activity_type CHECK constraint
    if (String(err?.message || '').includes('crm_activities_activity_type_check')) {
      await queryNeon(
        databaseUrl,
        `INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata)
         VALUES ($1, 'stripe_checkout', $2, $3, $4);`,
        [contactId, title, description, metadataJson]
      );
    } else {
      throw err;
    }
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const rawBody = await request.text();

    const signatureKey = env?.SQUARE_WEBHOOK_SIGNATURE_KEY || '';
    const signatureHeader = request.headers.get('x-square-hmacsha256-signature') || '';
    const notificationUrl = env?.SQUARE_WEBHOOK_NOTIFICATION_URL || request.url;

    const isValidSignature = await verifySquareWebhookSignature({
      signatureHeader,
      signatureKey,
      notificationUrl,
      rawBody,
    });

    if (!isValidSignature) {
      return new Response(JSON.stringify({ error: 'Invalid Square webhook signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(rawBody || '{}');
    const eventType = String(event?.type || '').toLowerCase();
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const brevoApiKey = env?.BREVO_API_KEY;
    const brevoBuyersListId = Number(env?.BREVO_BUYERS_LIST_ID) || DEFAULT_BREVO_BUYERS_LIST_ID;

    if (eventType === 'payment.updated' || eventType === 'payment.created') {
      const payment = event?.data?.object?.payment;
      if (!payment || payment.status !== 'COMPLETED') {
        return new Response(JSON.stringify({ received: true, ignored: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const paymentId = payment.id;
      // Deduplicate Square webhook retries / created+updated double delivery
      const existingCheck = await queryNeon(
        databaseUrl,
        `SELECT id FROM crm_activities WHERE metadata->>'payment_id' = $1 LIMIT 1;`,
        [paymentId]
      ).catch(() => ({ rows: [] }));

      if (existingCheck.rows?.length > 0) {
        return new Response(JSON.stringify({ received: true, duplicate: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Enrich with Square Order & Customer records when token is available
      let squareOrder = null;
      let squareCustomer = null;
      if (env?.SQUARE_ACCESS_TOKEN) {
        if (payment.order_id) {
          const orderRes = await squareApiFetch(env, `/v2/orders/${payment.order_id}`).catch(() => null);
          squareOrder = orderRes?.order || null;
        }
        if (payment.customer_id) {
          const custRes = await squareApiFetch(env, `/v2/customers/${payment.customer_id}`).catch(() => null);
          squareCustomer = custRes?.customer || null;
        }
      }

      const fulfillmentRecipient = squareOrder?.fulfillments?.[0]?.shipment_details?.recipient || null;
      const email = String(
        payment.buyer_email_address ||
          fulfillmentRecipient?.email_address ||
          squareCustomer?.email_address ||
          ''
      )
        .toLowerCase()
        .trim();

      const fullName =
        fulfillmentRecipient?.display_name ||
        [squareCustomer?.given_name, squareCustomer?.family_name].filter(Boolean).join(' ') ||
        'Valued Explorer';
      const phone = fulfillmentRecipient?.phone_number || squareCustomer?.phone_number || null;
      const shippingDetails = formatShippingAddress(
        payment.shipping_address || fulfillmentRecipient?.address || squareCustomer?.address
      );

      const amountCents = Number(payment.total_money?.amount ?? payment.amount_money?.amount ?? 0);
      const orderTotal = amountCents / 100;
      const firstLineItem = squareOrder?.line_items?.[0] || null;
      const refId = parseSkuFromNote(
        payment.note || firstLineItem?.note || '',
        squareOrder?.reference_id || ''
      );

      if (email) {
        const upsertContactSql = `
          INSERT INTO crm_contacts (email, name, phone, persona, lifecycle_stage, total_orders, total_spend, lead_score, updated_at)
          VALUES ($1, $2, $3, 'parent', 'customer', 1, $4, 100, CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET
            name = COALESCE(NULLIF($2, ''), crm_contacts.name),
            phone = COALESCE($3, crm_contacts.phone),
            lifecycle_stage = 'customer',
            total_orders = crm_contacts.total_orders + 1,
            total_spend = crm_contacts.total_spend + $4,
            lead_score = GREATEST(crm_contacts.lead_score, 100),
            last_active_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id;
        `;

        const contactRes = await queryNeon(databaseUrl, upsertContactSql, [
          email,
          fullName,
          phone,
          orderTotal,
        ]);
        const contactId = contactRes.rows[0]?.id;

        if (contactId) {
          await insertSquareActivity(
            databaseUrl,
            contactId,
            `Square Order ($${orderTotal.toFixed(2)})`,
            `Completed Square Payment ${paymentId}`,
            JSON.stringify({
              provider: 'square',
              payment_id: paymentId,
              order_id: payment.order_id || null,
              amount_total: orderTotal,
              currency: payment.amount_money?.currency || 'USD',
              payment_status: payment.status,
              receipt_url: payment.receipt_url || null,
              shipping_details: shippingDetails,
              client_reference_id: refId,
            })
          );

          try {
            const orderNum = `SOE-${Date.now().toString().slice(-6)}`;
            let itemTitle = firstLineItem?.name || 'SOE Early Learning Product';
            if (refId.includes('AWATRUE-HK05') || refId.includes('SOE-HP-85DB')) {
              const variantName = refId.replace(/^.*?(AWATRUE-HK05-|SOE-HP-85DB-)/, '').replace(/-/g, ' ');
              itemTitle = `AWATRUE HK05 Safe Sensory Kids Headphones (${variantName || 'Standard'})`;
            } else if (refId.includes('BUNDLE') || refId.includes('SOE-HP-WB-BUNDLE')) {
              const variantName = refId.replace(/^.*?(SOE-BUNDLE-|SOE-HP-WB-BUNDLE-)/, '').replace(/-/g, ' ');
              itemTitle = `SOE Sensory Listening & Workbook Bundle (${variantName || 'Standard'})`;
            }

            const itemsPayload = JSON.stringify([
              {
                title: itemTitle,
                qty: Number(firstLineItem?.quantity || 1),
                price: orderTotal,
                sku: refId || 'SOE-ORDER',
                variant: refId,
              },
            ]);

            await queryNeon(
              databaseUrl,
              `INSERT INTO shop_orders (
                order_number, source, external_order_id, contact_id, customer_name, customer_email, customer_phone,
                shipping_address, items, subtotal, shipping_fee, total_amount, payment_status, fulfillment_status
              )
              VALUES ($1, 'web_store', $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, 0.00, $9, 'paid', 'unfulfilled')
              ON CONFLICT (order_number) DO NOTHING;`,
              [
                orderNum,
                payment.order_id || paymentId,
                contactId,
                fullName,
                email,
                phone,
                JSON.stringify(shippingDetails || {}),
                itemsPayload,
                orderTotal,
              ]
            );
          } catch (shopOrderErr) {
            console.warn('shop_orders insertion warning:', shopOrderErr);
          }
        }

        if (brevoApiKey) {
          await addContactToBrevo(brevoApiKey, email, fullName, brevoBuyersListId);
        }
      }

      if (orderTotal >= 35 || String(refId).includes('BUNDLE')) {
        await stageMclsReactiveCard(databaseUrl, 'square.checkout.completed', {
          order_total: orderTotal,
          client_reference_id: refId || 'SOE-ORDER',
          session_id: payment.order_id || paymentId,
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Square Webhook Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
