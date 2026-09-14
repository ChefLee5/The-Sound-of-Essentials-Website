/**
 * Sync Supabase Trapped Leads -> Brevo CRM (List 2) & Neon PostgreSQL
 *
 * Usage:
 *   node scripts/sync-supabase-to-brevo.mjs [--service-key <SUPABASE_SERVICE_ROLE_KEY>]
 *   node scripts/sync-supabase-to-brevo.mjs [--csv <PATH_TO_CSV>]
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const brevoKeyArgIdx = args.indexOf('--brevo-key');
const BREVO_API_KEY =
  brevoKeyArgIdx !== -1
    ? args[brevoKeyArgIdx + 1]
    : process.env.BREVO_API_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID) || 2; // SOE_Album_Listeners
const NEON_DATABASE_URL =
  process.env.NEON_DATABASE_URL ||
  'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function queryNeon(query, params = []) {
  const urlObj = new URL(NEON_DATABASE_URL);
  const endpoint = `https://${urlObj.host}/sql`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': NEON_DATABASE_URL,
    },
    body: JSON.stringify({ query, params }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Neon query failed: ${errText}`);
  }
  return res.json();
}

async function syncLeadToBrevo(email, name = 'Rhythm Explorer', source = '/listen') {
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      attributes: {
        FIRSTNAME: name.trim() || 'Rhythm Explorer',
        SOURCE: source || '/listen',
        PERSONA: 'parent',
      },
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (res.ok || res.status === 201 || res.status === 204) {
    return { success: true };
  }
  const text = await res.text();
  return { success: false, error: text };
}

async function syncLeadToNeon(lead) {
  const normalizedEmail = lead.email.trim().toLowerCase();
  const normalizedName = lead.name?.trim() || 'Rhythm Explorer';
  const sourcePath = lead.source_path || '/listen';

  // 1. Insert into soe_submissions
  await queryNeon(
    `INSERT INTO soe_submissions (kind, name, email, source_path) VALUES ('interest', $1, $2, $3);`,
    [normalizedName, normalizedEmail, sourcePath]
  );

  // 2. Upsert into crm_contacts
  await queryNeon(
    `INSERT INTO crm_contacts (email, name, persona, lifecycle_stage, source_path, lead_score, updated_at)
     VALUES ($1, $2, 'parent', 'lead', $3, 25, CURRENT_TIMESTAMP)
     ON CONFLICT (email) DO UPDATE SET
       name = COALESCE(NULLIF($2, 'Rhythm Explorer'), crm_contacts.name),
       lead_score = crm_contacts.lead_score + 15,
       last_active_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP;`,
    [normalizedEmail, normalizedName, sourcePath]
  );
}

async function run() {
  console.log('======================================================');
  console.log('🚀 SOE SUPABASE -> BREVO & NEON LEAD RECOVERY TOOL');
  console.log('======================================================\n');

  const serviceKeyIndex = args.indexOf('--service-key');
  const serviceKey = serviceKeyIndex !== -1 ? args[serviceKeyIndex + 1] : process.env.SUPABASE_SERVICE_ROLE_KEY;

  const csvIndex = args.indexOf('--csv');
  const csvPath = csvIndex !== -1 ? args[csvIndex + 1] : null;

  let leads = [];

  if (serviceKey) {
    console.log('Connecting to Supabase using provided service role key...');
    const url = 'https://ishoimsrjsjiwczchflf.supabase.co/rest/v1/soe_submissions?select=*';
    const res = await fetch(url, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    if (!res.ok) {
      console.error('Failed to query Supabase REST API:', await res.text());
      process.exit(1);
    }
    leads = await res.json();
    console.log(`Retrieved ${leads.length} lead(s) directly from Supabase!`);
  } else if (csvPath && fs.existsSync(csvPath)) {
    console.log(`Reading leads from CSV file: ${csvPath}...`);
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.split('\n').filter((l) => l.trim().length > 0);
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const emailIdx = headers.findIndex((h) => h.toLowerCase().includes('email'));
    const nameIdx = headers.findIndex((h) => h.toLowerCase().includes('name'));

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
      if (emailIdx !== -1 && parts[emailIdx]) {
        leads.push({
          email: parts[emailIdx],
          name: nameIdx !== -1 ? parts[nameIdx] : 'Rhythm Explorer',
          source_path: '/listen',
        });
      }
    }
    console.log(`Parsed ${leads.length} lead(s) from CSV!`);
  } else {
    console.log('ℹ️  No --service-key or --csv parameter provided.');
    console.log('\nTwo easy ways to rescue any leads sitting in Supabase:');
    console.log('1. Run with service role key:');
    console.log('   node scripts/sync-supabase-to-brevo.mjs --service-key <YOUR_SUPABASE_SERVICE_ROLE_KEY>\n');
    console.log('2. OR export CSV from Supabase SQL Editor:');
    console.log('   Run: "SELECT * FROM soe_submissions;" in Supabase dashboard, download CSV, and run:');
    console.log('   node scripts/sync-supabase-to-brevo.mjs --csv ./leads.csv\n');
    return;
  }

  if (leads.length === 0) {
    console.log('No leads found to sync.');
    return;
  }

  console.log(`\nBeginning sync of ${leads.length} lead(s) into Brevo List 2 and Neon CRM...`);
  let brevoCount = 0;
  let neonCount = 0;

  for (const lead of leads) {
    if (!lead.email) continue;
    try {
      const brevoResult = await syncLeadToBrevo(lead.email, lead.name, lead.source_path);
      if (brevoResult.success) {
        brevoCount++;
        console.log(`  [Brevo] ✅ Synced ${lead.email}`);
      } else {
        console.log(`  [Brevo] ⚠️ ${lead.email}: ${brevoResult.error}`);
      }

      await syncLeadToNeon(lead);
      neonCount++;
      console.log(`  [Neon]  ✅ Synced ${lead.email}`);
    } catch (err) {
      console.error(`  ❌ Error processing ${lead.email}:`, err.message);
    }
  }

  console.log('\n======================================================');
  console.log(`🎉 Sync Complete! Brevo: ${brevoCount}/${leads.length} | Neon: ${neonCount}/${leads.length}`);
  console.log('======================================================');
}

run().catch((err) => {
  console.error('Fatal error during sync runner:', err);
});
