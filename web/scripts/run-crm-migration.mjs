import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://neondb_owner:npg_ks2SarDnOB1E@ep-wandering-voice-ae85papv.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function runCrmMigration() {
  const rawSql = fs.readFileSync(path.resolve('scripts/crm-schema.sql'), 'utf8');
  console.log('🚀 Executing CRM Database Schema Migration on Neon PostgreSQL...');

  const urlObj = new URL(connectionString);
  const host = urlObj.host;
  const neonHttpEndpoint = `https://${host}/sql`;

  // Remove comment lines
  const cleanSql = rawSql
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');

  // Split into clean statements
  const statements = cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const sql of statements) {
    const preview = sql.split('\n')[0].slice(0, 60);
    console.log(`Executing: ${preview}...`);
    const response = await fetch(neonHttpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': connectionString,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Statement Failed:', errorText);
      process.exit(1);
    }
  }

  // Populate initial seed data if empty
  const checkContacts = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({
      query: "SELECT COUNT(*) as count FROM crm_contacts;",
    }),
  });
  const checkData = await checkContacts.json();
  const count = parseInt(checkData.rows[0].count, 10);

  if (count === 0) {
    console.log('\n🌱 Seeding initial sample contacts and pipeline deals for testing...');
    const seedSql = `
      INSERT INTO crm_contacts (email, name, persona, lifecycle_stage, total_orders, total_spend, lead_score, organization, source_path, tags)
      VALUES 
      ('elena.montessori@oakridgeacademy.edu', 'Elena Vance', 'institution', 'opportunity', 0, 0.00, 85, 'Oakridge Montessori', '/join', '["montessori", "school_license", "curriculum_eval"]'::jsonb),
      ('marcus.parent@gmail.com', 'Marcus Sterling', 'parent', 'customer', 1, 35.00, 95, NULL, '/listen', '["workbook_buyer", "harmonia_fan", "homeschool"]'::jsonb),
      ('sarah.homeschool@verizon.net', 'Sarah Jenkins', 'educator', 'lead', 0, 0.00, 60, 'Pacific Co-op', '/listen', '["free_album", "active_listener"]'::jsonb),
      ('director@sunshinepreschool.org', 'David Chen', 'institution', 'opportunity', 0, 0.00, 90, 'Sunshine Early Learning', '/join', '["preschool_pilot", "b2b_inquiry"]'::jsonb),
      ('claire.rhythm@allies.io', 'Claire Dupont', 'ally', 'champion', 2, 89.00, 100, 'Kindred Minds', '/allies', '["affiliate_partner", "super_fan"]'::jsonb);

      INSERT INTO crm_deals (contact_id, title, stage, deal_value, probability, expected_close_date, notes)
      SELECT id, 'Oakridge School-Wide Curriculum License (5 Classrooms)', 'school_pilot', 750.00, 65, CURRENT_DATE + 14, 'Demo presentation scheduled with curriculum board.'
      FROM crm_contacts WHERE email = 'elena.montessori@oakridgeacademy.edu';

      INSERT INTO crm_deals (contact_id, title, stage, deal_value, probability, expected_close_date, notes)
      SELECT id, 'Sunshine Preschool 20-Bundle Pilot', 'negotiation', 420.00, 80, CURRENT_DATE + 7, 'Requested quote for print workbooks + digital classroom portal.'
      FROM crm_contacts WHERE email = 'director@sunshinepreschool.org';

      INSERT INTO crm_activities (contact_id, activity_type, title, description)
      SELECT id, 'form_submit', 'Institutional Partnership Inquiry', 'Submitted request from /join inquiring about curriculum licensing for 5 classrooms.'
      FROM crm_contacts WHERE email = 'sarah.montessori@oakridgeacademy.edu';

      INSERT INTO crm_activities (contact_id, activity_type, title, description)
      SELECT id, 'stripe_order', 'Purchased Rhythm Ready Print Workbook', 'Order #SOE-1042 completed via Stripe checkout ($35.00).'
      FROM crm_contacts WHERE email = 'david.parent@gmail.com';
    `;

    // Clean seed statements
    const seedStatements = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const sql of seedStatements) {
      await fetch(neonHttpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': connectionString,
        },
        body: JSON.stringify({ query: sql }),
      });
    }
  }

  // Verify tables
  const verifyRes = await fetch(neonHttpEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connectionString,
    },
    body: JSON.stringify({
      query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'crm_%' ORDER BY table_name;",
    }),
  });

  const verifyData = await verifyRes.json();
  console.log('\n🎉 CRM Migration successfully completed! Verified CRM tables in Neon:');
  console.table(verifyData.rows);
}

runCrmMigration();
