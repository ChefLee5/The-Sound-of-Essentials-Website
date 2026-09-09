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
    const search = url.searchParams.get('search')?.trim() || '';
    const persona = url.searchParams.get('persona') || 'all';
    const stage = url.searchParams.get('stage') || 'all';
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    let whereClauses = [];
    let params = [];

    if (search) {
      params.push(`%${search}%`);
      whereClauses.push(`(email ILIKE $${params.length} OR name ILIKE $${params.length} OR organization ILIKE $${params.length})`);
    }

    if (persona !== 'all') {
      params.push(persona);
      whereClauses.push(`persona = $${params.length}`);
    }

    if (stage !== 'all') {
      params.push(stage);
      whereClauses.push(`lifecycle_stage = $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM crm_contacts ${whereSql};`;
    const countData = await queryNeon(databaseUrl, countSql, params);
    const total = parseInt(countData.rows[0]?.total || '0', 10);

    params.push(limit, offset);
    const sql = `
      SELECT id, email, name, first_name, last_name, phone, organization, persona, 
             lifecycle_stage, total_orders, total_spend, currency, lead_score, tags, 
             source_path, location, last_active_at, created_at, updated_at
      FROM crm_contacts
      ${whereSql}
      ORDER BY last_active_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length};
    `;

    const data = await queryNeon(databaseUrl, sql, params);

    return new Response(JSON.stringify({ contacts: data.rows, total, limit, offset }), {
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

    const { email, name, phone, organization, persona, lifecycle_stage, tags, lead_score } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email is required.' }), { status: 400 });
    }

    const sql = `
      INSERT INTO crm_contacts (email, name, phone, organization, persona, lifecycle_stage, tags, lead_score, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, crm_contacts.name),
        phone = COALESCE(EXCLUDED.phone, crm_contacts.phone),
        organization = COALESCE(EXCLUDED.organization, crm_contacts.organization),
        persona = COALESCE(EXCLUDED.persona, crm_contacts.persona),
        lifecycle_stage = COALESCE(EXCLUDED.lifecycle_stage, crm_contacts.lifecycle_stage),
        tags = COALESCE(EXCLUDED.tags, crm_contacts.tags),
        lead_score = COALESCE(EXCLUDED.lead_score, crm_contacts.lead_score),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const params = [
      email.toLowerCase().trim(),
      name || 'Rhythm Explorer',
      phone || null,
      organization || null,
      persona || 'parent',
      lifecycle_stage || 'lead',
      JSON.stringify(tags || []),
      lead_score || 10,
    ];

    const data = await queryNeon(databaseUrl, sql, params);
    return new Response(JSON.stringify({ contact: data.rows[0] }), {
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

    const { id, name, phone, organization, persona, lifecycle_stage, tags, lead_score } = body;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Contact ID is required.' }), { status: 400 });
    }

    const sql = `
      UPDATE crm_contacts
      SET name = COALESCE($1, name),
          phone = COALESCE($2, phone),
          organization = COALESCE($3, organization),
          persona = COALESCE($4, persona),
          lifecycle_stage = COALESCE($5, lifecycle_stage),
          tags = COALESCE($6, tags),
          lead_score = COALESCE($7, lead_score),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *;
    `;

    const data = await queryNeon(databaseUrl, sql, [
      name,
      phone,
      organization,
      persona,
      lifecycle_stage,
      tags ? JSON.stringify(tags) : null,
      lead_score,
      id,
    ]);

    return new Response(JSON.stringify({ contact: data.rows[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;
    const databaseUrl = env?.NEON_DATABASE_URL || env?.DATABASE_URL || FALLBACK_DB_URL;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Contact ID is required.' }), { status: 400 });
    }

    // Cascade delete activities, notes, tasks, deals
    await queryNeon(databaseUrl, 'DELETE FROM crm_activities WHERE contact_id = $1;', [id]);
    await queryNeon(databaseUrl, 'DELETE FROM crm_notes WHERE contact_id = $1;', [id]);
    await queryNeon(databaseUrl, 'DELETE FROM crm_tasks WHERE contact_id = $1;', [id]);
    await queryNeon(databaseUrl, 'DELETE FROM crm_deals WHERE contact_id = $1;', [id]);
    await queryNeon(databaseUrl, 'DELETE FROM crm_contacts WHERE id = $1;', [id]);

    return new Response(JSON.stringify({ success: true, deletedId: id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
