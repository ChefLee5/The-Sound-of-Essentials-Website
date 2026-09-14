/**
 * Vercel Serverless Function: /api/submit
 * Handles email capture, album unlock opt-ins, and partnership submissions.
 * Ingests leads directly into:
 * 1. Neon Serverless PostgreSQL (soe_submissions, crm_contacts, crm_activities, crm_deals)
 * 2. Brevo CRM List #2 (SOE_Album_Listeners) via Brevo API
 */

const FALLBACK_DB_URL =
  'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
const DEFAULT_BREVO_LIST_ID = 2; // SOE_Album_Listeners

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function queryNeon(databaseUrl, query, params = []) {
  const urlObj = new URL(databaseUrl);
  const neonHttpEndpoint = `https://${urlObj.host}/sql`;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': databaseUrl,
    },
    body: JSON.stringify({ query, params }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Neon query failed: ${errText}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  // ── CORS Headers ──
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        // use as-is
      }
    }

    const {
      kind = 'interest',
      name = 'Rhythm Explorer',
      email = '',
      organizationName = null,
      message = null,
      sourcePath = '/listen',
      honeypot = '',
    } = body || {};

    // Honeypot spam protection
    if (honeypot) {
      return res.status(200).json({ success: true, filtered: true });
    }

    const normalizedName = (name || 'Rhythm Explorer').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!['interest', 'partnership', 'newsletter'].includes(kind)) {
      return res.status(400).json({ error: 'Unsupported submission kind.' });
    }

    if (!normalizedEmail || !EMAIL_PATTERN.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const databaseUrl =
      process.env.NEON_DATABASE_URL ||
      process.env.DATABASE_URL ||
      FALLBACK_DB_URL;

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = Number(process.env.BREVO_LIST_ID) || DEFAULT_BREVO_LIST_ID;

    // ── 1. Core Submission Record in Neon DB ──
    let submissionId = null;
    try {
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

      const neonData = await queryNeon(databaseUrl, sqlQuery, values);
      submissionId = neonData?.rows?.[0]?.id;
    } catch (dbErr) {
      console.error('Neon submission insert error:', dbErr.message);
    }

    // ── 2. Background CRM Contact & Activity Upsert ──
    const persona =
      kind === 'partnership'
        ? (organizationName ? 'institution' : 'educator')
        : 'parent';

    try {
      const crmUpsertSql = `
        INSERT INTO crm_contacts (email, name, organization, persona, lifecycle_stage, source_path, lead_score, updated_at)
        VALUES ($1, $2, $3, $4, 'lead', $5, 25, CURRENT_TIMESTAMP)
        ON CONFLICT (email) DO UPDATE SET
          name = COALESCE(NULLIF($2, 'Rhythm Explorer'), crm_contacts.name),
          organization = COALESCE($3, crm_contacts.organization),
          persona = COALESCE($4, crm_contacts.persona),
          lead_score = crm_contacts.lead_score + 15,
          last_active_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id;
      `;

      const crmData = await queryNeon(databaseUrl, crmUpsertSql, [
        normalizedEmail,
        normalizedName || 'Rhythm Explorer',
        organizationName?.trim() || null,
        persona,
        sourcePath?.slice(0, 500) || '/listen',
      ]);

      const contactId = crmData?.rows?.[0]?.id;

      if (contactId) {
        const activityTitle =
          kind === 'partnership'
            ? `Partnership Inquiry: ${organizationName || normalizedName}`
            : `Album Unlocked & Lead Captured`;

        await queryNeon(
          databaseUrl,
          `INSERT INTO crm_activities (contact_id, activity_type, title, description, metadata) VALUES ($1, 'form_submit', $2, $3, $4);`,
          [
            contactId,
            activityTitle,
            message?.trim() || `Submitted via ${sourcePath || '/listen'}`,
            JSON.stringify({ kind, sourcePath, submissionId }),
          ]
        );

        if (kind === 'partnership' || organizationName) {
          const dealTitle = organizationName
            ? `School / Institutional Pilot: ${organizationName}`
            : `Partnership Opportunity: ${normalizedName}`;
          const dealValue = organizationName ? 1500.0 : 500.0;

          await queryNeon(
            databaseUrl,
            `INSERT INTO crm_deals (contact_id, title, stage, deal_value, probability, notes) VALUES ($1, $2, 'school_pilot', $3, 40, $4);`,
            [
              contactId,
              dealTitle,
              dealValue,
              `Auto-created from ${kind} inquiry via ${sourcePath || '/join'}. Message: ${message || 'No initial message provided.'}`,
            ]
          );
        }
      }
    } catch (crmErr) {
      console.warn('Neon CRM contact/activity upsert notice (non-blocking):', crmErr.message);
    }

    // ── 3. Brevo CRM Contact Synchronization ──
    let brevoSynced = false;
    if (brevoApiKey) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            email: normalizedEmail,
            attributes: {
              FIRSTNAME: normalizedName || 'Rhythm Explorer',
              SOURCE: sourcePath || '/listen',
              PERSONA: persona,
            },
            listIds: [brevoListId],
            updateEnabled: true,
          }),
        });

        if (brevoRes.ok || brevoRes.status === 201 || brevoRes.status === 204) {
          brevoSynced = true;
        } else {
          const brevoErrText = await brevoRes.text();
          console.warn('Brevo API sync response:', brevoRes.status, brevoErrText);
        }
      } catch (brevoErr) {
        console.warn('Brevo sync network notice (non-blocking):', brevoErr.message);
      }
    } else {
      console.warn('BREVO_API_KEY is not configured in environment variables.');
    }

    return res.status(200).json({
      success: true,
      submissionId: submissionId || 'recorded',
      brevoSynced,
    });
  } catch (err) {
    console.error('Submission API Error:', err);
    return res.status(500).json({
      error: 'We could not process your submission at this time.',
    });
  }
}
