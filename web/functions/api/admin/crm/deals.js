const FALLBACK_DB_URL = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function queryNeon(databaseUrl, sql, params = []) {
  const finalUrl = databaseUrl || FALLBACK_DB_URL;
  const urlObj = new URL(finalUrl);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  const res = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': finalUrl,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Database error: ${err}`);
  }
  return res.json();
}

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;

    const sql = `
      SELECT d.id, d.contact_id, d.title, d.stage, d.deal_value, d.currency, 
             d.probability, d.expected_close_date, d.assigned_to, d.notes, 
             d.created_at, d.updated_at,
             c.name as contact_name, c.email as contact_email, c.organization, c.persona
      FROM crm_deals d
      LEFT JOIN crm_contacts c ON d.contact_id = c.id
      ORDER BY d.updated_at DESC;
    `;

    const data = await queryNeon(databaseUrl, sql);
    return new Response(JSON.stringify({ deals: data.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();

    const { id, stage, deal_value, notes, probability } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Deal ID is required' }), { status: 400 });
    }

    const sql = `
      UPDATE crm_deals
      SET stage = COALESCE($1, stage),
          deal_value = COALESCE($2, deal_value),
          notes = COALESCE($3, notes),
          probability = COALESCE($4, probability),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [stage, deal_value, notes, probability, id]);
    return new Response(JSON.stringify({ deal: data.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const body = await request.json();

    const { contact_id, title, stage, deal_value, probability, notes } = body;
    if (!contact_id || !title) {
      return new Response(JSON.stringify({ error: 'Contact ID and Deal Title are required.' }), { status: 400 });
    }

    const sql = `
      INSERT INTO crm_deals (contact_id, title, stage, deal_value, probability, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [
      contact_id,
      title,
      stage || 'new_lead',
      deal_value || 0,
      probability || 20,
      notes || null,
    ]);

    return new Response(JSON.stringify({ deal: data.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
