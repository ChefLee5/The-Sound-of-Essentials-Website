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
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const url = new URL(request.url);
    const contactId = url.searchParams.get('contact_id');

    if (!contactId) {
      return new Response(JSON.stringify({ error: 'Contact ID is required' }), { status: 400 });
    }

    const sql = `
      SELECT * FROM crm_notes 
      WHERE contact_id = $1
      ORDER BY pinned DESC, created_at DESC;
    `;

    const data = await queryNeon(databaseUrl, sql, [contactId]);
    return new Response(JSON.stringify({ notes: data.rows }), {
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

    const { contact_id, author, content, pinned } = body;
    if (!contact_id || !content) {
      return new Response(JSON.stringify({ error: 'Contact ID and content are required' }), { status: 400 });
    }

    const sql = `
      INSERT INTO crm_notes (contact_id, author, content, pinned)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [
      contact_id,
      author || 'Staff',
      content,
      pinned || false,
    ]);

    return new Response(JSON.stringify({ note: data.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
