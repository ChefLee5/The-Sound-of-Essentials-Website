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
      SELECT t.*, c.name as contact_name, c.email as contact_email, c.organization
      FROM crm_tasks t
      LEFT JOIN crm_contacts c ON t.contact_id = c.id
      ORDER BY 
        CASE t.status WHEN 'pending' THEN 1 WHEN 'in_progress' THEN 2 ELSE 3 END,
        t.due_date ASC NULLS LAST;
    `;

    const data = await queryNeon(databaseUrl, sql);
    return new Response(JSON.stringify({ tasks: data.rows }), {
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

    const { contact_id, deal_id, title, due_date, priority, status } = body;
    if (!title) {
      return new Response(JSON.stringify({ error: 'Task title is required' }), { status: 400 });
    }

    const sql = `
      INSERT INTO crm_tasks (contact_id, deal_id, title, due_date, priority, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [
      contact_id || null,
      deal_id || null,
      title,
      due_date || null,
      priority || 'medium',
      status || 'pending',
    ]);

    return new Response(JSON.stringify({ task: data.rows[0] }), {
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

    const { id, status } = body;
    if (!id || !status) {
      return new Response(JSON.stringify({ error: 'Task ID and Status required' }), { status: 400 });
    }

    const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
    const sql = `
      UPDATE crm_tasks 
      SET status = $1, completed_at = ${completedAt}
      WHERE id = $2
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [status, id]);
    return new Response(JSON.stringify({ task: data.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
