/**
 * Cloudflare Pages Function: /api/submit
 * Handles contact and partnership submissions directly at edge,
 * saving records into Neon Serverless PostgreSQL over HTTP (Zero TCP connection overhead, pure Edge compatible).
 */

const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const FALLBACK_BREVO_KEY = '';
const DEFAULT_BREVO_LIST_ID = 2; // SOE_Album_Listeners
const INSTITUTIONAL_BREVO_LIST_ID = 12; // SOE_Inbound_Institutional_Inquiries
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const {
      kind,
      name,
      email,
      persona: requestedPersona,
      organizationName,
      message,
      sourcePath,
      honeypot,
    } = body;

    // Honeypot spam protection
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    const ALLOWED_KINDS = ['interest', 'partnership', 'newsletter', 'institutional_qpc', 'qpc', 'contact', 'album_unlock', 'lead'];
    if (!ALLOWED_KINDS.includes(kind)) {
      return new Response(JSON.stringify({ error: `Unsupported submission kind: ${kind}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!normalizedName || normalizedName.length > 120) {
      return new Response(JSON.stringify({ error: 'Please enter your name.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;

    // Neon HTTP endpoint
    const urlObj = new URL(databaseUrl);
    const host = urlObj.host;
    const neonHttpEndpoint = `https://${host}/sql`;

    // 1. Core Submission Record: Execute query via Neon Serverless HTTP API
    const sqlQuery = `
      INSERT INTO soe_submissions (kind, name, email, organization_name, message, source_path)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at;
    `;

    const values = [
      kind,
      normalizedName,
      normalizedEmail,
      organizationName?.trim() || null,
      message?.trim() || null,
      sourcePath?.slice(0, 500) || null,
    ];

    const neonRes = await fetch(neonHttpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': databaseUrl,
      },
      body: JSON.stringify({
        query: sqlQuery,
        params: values,
      }),
    });

    if (!neonRes.ok) {
      const errText = await neonRes.text();
      console.error('Neon HTTP error inserting submission:', errText);
      throw new Error('Database query failed');
    }

    const neonData = await neonRes.json();
    const submissionId = neonData?.rows?.[0]?.id;

    // 2. Background CRM Contact & Activity Upsert (Resilient & Non-Blocking)
    const cleanOrg = organizationName?.trim() || null;
    const isNonInstitutionalOrg = !cleanOrg || ['home sanctuary', 'parent', 'family'].includes(cleanOrg.toLowerCase());
    const isInstitutional = kind === 'partnership' || kind === 'institutional_qpc' || kind === 'qpc' || !isNonInstitutionalOrg;
    const persona = requestedPersona && ['parent', 'educator', 'institution'].includes(requestedPersona)
      ? requestedPersona
      : (isInstitutional ? (!isNonInstitutionalOrg ? 'institution' : 'educator') : 'parent');
    try {
      const crmUpsertSql = `
        INSERT INTO crm_contacts (email, name, organization, persona, lifecycle_stage, source_path, lead_score, last_active_at, updated_at)
        VALUES ($1, $2, $3, $4, 'lead', $5, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(NULLIF($2, 'Rhythm Explorer'), crm_contacts.name),
          organization = COALESCE($3, crm_contacts.organization),
          persona = COALESCE($4, crm_contacts.persona),
          lead_score = crm_contacts.lead_score + 15,
          last_active_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id;
      `;

      const crmRes = await fetch(neonHttpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': databaseUrl,
        },
        body: JSON.stringify({
          query: crmUpsertSql,
          params: [
            normalizedEmail,
            normalizedName || 'Rhythm Explorer',
            organizationName?.trim() || null,
            persona,
            sourcePath?.slice(0, 500) || '/listen',
          ],
        }),
      });

      if (crmRes.ok) {
        const crmContact = await crmRes.json();
        const contactId = crmContact?.rows?.[0]?.id;

        if (contactId) {
          const activityTitle = isInstitutional 
            ? `Institutional / Partnership Inquiry: ${organizationName || normalizedName}`
            : `Album Unlocked & Lead Captured`;

          await fetch(neonHttpEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Neon-Connection-String': databaseUrl,
            },
            body: JSON.stringify({
              query: `INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata) VALUES ($1, 'form_submit', $2, $3, $4);`,
              params: [
                contactId,
                activityTitle,
                message?.trim() || `Submitted via ${sourcePath || '/listen'}`,
                JSON.stringify({ kind, sourcePath, submissionId }),
              ],
            }),
          });

          // 3. Automated Pipeline Deal Flow: School pilots and institutional inquiries auto-create deals
          if (isInstitutional) {
            const dealTitle = organizationName 
              ? `School / Institutional Pilot: ${organizationName}`
              : `Institutional Opportunity: ${normalizedName}`;
            const dealValue = organizationName ? 1500.00 : 500.00;
            const dealStage = 'school_pilot';

            await fetch(neonHttpEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Neon-Connection-String': databaseUrl,
              },
              body: JSON.stringify({
                query: `
                  INSERT INTO crm_deals (contact_id, title, stage, deal_value, probability, notes)
                  VALUES ($1, $2, $3, $4, 40, $5);
                `,
                params: [
                  contactId,
                  dealTitle,
                  dealStage,
                  dealValue,
                  `Auto-created from ${kind} inquiry via ${sourcePath || '/join'}. Message: ${message || 'No initial message provided.'}`,
                ],
              }),
            });
          }
        }
      }
    } catch (crmErr) {
      console.warn('CRM contact/activity sync notice (non-blocking):', crmErr);
    }

    // 4. Background Brevo Contact Synchronization (Non-blocking)
    const brevoApiKey = env?.BREVO_API_KEY || FALLBACK_BREVO_KEY;
    const targetListId = isInstitutional ? INSTITUTIONAL_BREVO_LIST_ID : (Number(env?.BREVO_LIST_ID) || DEFAULT_BREVO_LIST_ID);
    let brevoSynced = false;
    let brevoStatus = brevoApiKey ? 'pending' : 'skipped_missing_api_key';
    if (brevoApiKey) {
      try {
        const contactAttributes = {
          FIRSTNAME: normalizedName || 'Rhythm Explorer',
          SOURCE: sourcePath || '/listen',
          PERSONA: persona,
        };
        if (organizationName?.trim()) {
          contactAttributes.ORGANIZATION = organizationName.trim();
        }

        const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            email: normalizedEmail,
            attributes: contactAttributes,
            listIds: [targetListId],
            updateEnabled: true,
          }),
        });

        let brevoContactId = null;
        if (brevoRes.ok) {
          brevoSynced = true;
          brevoStatus = 'synced';
          const resData = await brevoRes.json();
          brevoContactId = resData?.id;
        } else {
          const brevoErrText = await brevoRes.text();
          brevoStatus = `error_${brevoRes.status}`;
          console.warn('Brevo Sync non-OK status:', brevoRes.status, brevoErrText);
        }

        // If message is provided, log CRM note in Brevo
        if (message?.trim()) {
          try {
            await fetch('https://api.brevo.com/v3/crm/notes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'api-key': brevoApiKey,
              },
              body: JSON.stringify({
                text: `<b>${isInstitutional ? 'Institutional Inquiry' : 'Website Submission'}</b> via ${sourcePath || '/join'}:<br>${message.trim()}`,
                contactIds: brevoContactId ? [brevoContactId] : undefined,
              }),
            });
          } catch (noteErr) {
            console.warn('Brevo Note logging notice:', noteErr);
          }
        }
      } catch (brevoErr) {
        brevoStatus = 'network_error';
        console.warn('Brevo Sync notice (non-blocking):', brevoErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, submissionId, brevoSynced, brevoStatus, persona }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Submission API Error:', error);
    return new Response(
      JSON.stringify({ error: 'We could not process your submission at this time.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
