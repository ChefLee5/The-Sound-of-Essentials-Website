/**
 * Shopify Fulfillment Webhook Receiver & Automated Digital Delivery Dispatcher
 *
 * Listens for Shopify's `orders/paid` webhook event.
 * 1. Verifies HMAC header from Shopify for security.
 * 2. Identifies customer email and purchased digital products.
 * 3. Sends post-purchase customer event to Beehiiv to tag them as `buyer:rhythm-quest`
 *    and trigger the automated delivery/onboarding sequence.
 * 4. Can trigger transactional email (Resend/SendGrid/Postmark) with instant PDF links.
 *
 * Environment variables needed:
 * - SHOPIFY_WEBHOOK_SECRET
 * - BEEHIIV_API_KEY
 * - BEEHIIV_PUBLICATION_ID
 * - RESEND_API_KEY (optional for direct transactional email)
 */

import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || '';
const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY || '';
const BEEHIIV_PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID || '';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_BUYERS_LIST_ID = Number(process.env.BREVO_BUYERS_LIST_ID) || 3;
const STORE_DOMAIN = 'thesoundofessentials.com';

/**
 * Verify Shopify Webhook HMAC Signature
 */
export function verifyShopifyWebhook(rawBody, hmacHeader) {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) return false;
  const digest = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
}

/**
 * Handle incoming orders/paid webhook
 */
export async function handleShopifyOrderPaid(order) {
  const customerEmail = order.email || order.customer?.email;
  const orderId = order.id || order.name;
  const lineItems = order.line_items || [];

  if (!customerEmail) {
    console.warn('[Shopify Fulfillment] No customer email found for order:', orderId);
    return { success: false, reason: 'Missing email' };
  }

  console.log(`[Shopify Fulfillment] Processing paid order #${orderId} for ${customerEmail}`);

  // Detect which digital product was purchased
  const isRhythmQuest = lineItems.some(item =>
    item.title?.toLowerCase().includes('rhythm quest') ||
    item.variant_id?.toString() === '53204514799932'
  );
  const isDictionary = lineItems.some(item =>
    item.title?.toLowerCase().includes('dictionary')
  );
  const isWorkbook = lineItems.some(item =>
    item.title?.toLowerCase().includes('workbook')
  );
  const isBundle = lineItems.some(item =>
    item.title?.toLowerCase().includes('bundle')
  );

  const tags = ['customer', 'soe_buyer'];
  if (isRhythmQuest) tags.push('buyer:rhythm-quest');
  if (isDictionary) tags.push('buyer:picture-dictionary');
  if (isWorkbook) {
    tags.push('buyer:rhythm-ready');
    tags.push('buyer:rhythmready');
    tags.push('buyer:summer-stretch');
  }
  if (isBundle) tags.push('buyer:full-bundle');

  // 1. Sync & Tag in Beehiiv to trigger onboarding / delivery sequence
  if (BEEHIIV_API_KEY && BEEHIIV_PUBLICATION_ID) {
    try {
      const beehiivRes = await fetch(
        `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${BEEHIIV_API_KEY}`,
          },
          body: JSON.stringify({
            email: customerEmail,
            reactivate_existing: true,
            send_welcome_email: false, // Prevent duplicate cold welcome email
            utm_source: 'shopify_checkout',
            utm_medium: 'paid_order',
            tags: tags,
            custom_fields: [
              { name: 'last_order_id', value: String(orderId) },
              { name: 'order_access_url', value: `https://${STORE_DOMAIN}/order-success?order_id=${orderId}&email=${encodeURIComponent(customerEmail)}` }
            ]
          }),
        }
      );

      const beehiivData = await beehiivRes.json();
      console.log('[Shopify Fulfillment] Beehiiv subscriber updated:', beehiivData);
    } catch (err) {
      console.error('[Shopify Fulfillment] Error syncing with Beehiiv:', err);
    }
  }

  // 2. Sync & Tag in Brevo (Unlimited Contacts CRM)
  if (BREVO_API_KEY) {
    try {
      const customerFirstName = order.customer?.first_name || '';
      const customerLastName = order.customer?.last_name || '';
      const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: customerEmail,
          attributes: {
            FIRSTNAME: customerFirstName || 'Explorer',
            LASTNAME: customerLastName,
            LAST_ORDER_ID: String(orderId),
            ORDER_ACCESS_URL: `https://${STORE_DOMAIN}/order-success?order_id=${orderId}&email=${encodeURIComponent(customerEmail)}`,
            PURCHASED_EBOOK: isRhythmQuest,
            PURCHASED_RHYTHM_READY: isWorkbook,
            PURCHASED_BUNDLE: isBundle,
            LIFECYCLE_STAGE: 'customer',
          },
          listIds: [BREVO_BUYERS_LIST_ID],
          updateEnabled: true,
        }),
      });
      const brevoData = await brevoRes.json();
      console.log('[Shopify Fulfillment] Brevo buyer contact synced:', brevoData);
    } catch (brevoErr) {
      console.error('[Shopify Fulfillment] Error syncing with Brevo:', brevoErr);
    }
  }

  return {
    success: true,
    orderId,
    customerEmail,
    tags,
    portalUrl: `https://${STORE_DOMAIN}/order-success?order_id=${orderId}&email=${encodeURIComponent(customerEmail)}`
  };
}
