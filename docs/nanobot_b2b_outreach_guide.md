# Nanobot Autonomous B2B Outreach Engine: Operating Guide
*The Sound of Essentials: Rhythm Quest · Education Concord*

> **Engine Status:** OPERATIONAL & AUTOMATED  
> **Autonomous Agent:** Nanobot (`~/.nanobot` / OpenRouter `gemini-2.5-flash`)  
> **Core Value Hook:** 10–15 Minute Screen-Free Tactile Lesson Extension (`SOE_ECE_Lesson_Extender_Tool.html`)  
> **Sender ID:** Brevo Sender ID 2 (`info@soelearn.com`)

---

## 1. System Overview

The **Nanobot Outreach Bridge** connects our 1,208 validated institutional leads directly to Nanobot's autonomous execution runtime. It allows hands-off cohort dispatches, duplicate-free ledger tracking, and instant delivery of the interactive **SOE ECE Lesson Extender Tool** to Head Start directors, Pre-K coordinators, and early learning networks.

```
Nanobot Agent / Heartbeat
        │
        ▼ (Terminal or Gateway Cron)
[scripts/nanobot_outreach_bridge.py]
        │
   ┌────┴───────────────────────────┐
   ▼                                ▼
[Brevo API (Sender ID 2)]   [leads/concord_outbound_ledger.json]
   • Contact sync to List 4-8  • Prevents duplicate emails
   • Touch 1 template send     • Logs timestamps & delivery IDs
   • Dynamic params injection  • Keeps historical audit trail
```

---

## 2. Pipeline Health & Queue Status

* **Total Database Leads:** 1,208
* **Valid Email Leads:** 1,087
* **Previously Dispatched (Pillar III):** 30 leads (Live dispatches verified)
* **Ready in Outbound Queue:** **1,057 leads**
  * **Pillar I (Music & Arts Champions):** 20 leads ready
  * **Pillar V (Multicultural & Bilingual ECE):** 1,015 leads ready
  * **Pillar II (Homeschool Networks):** 12 leads ready
  * **Pillar IV (Holistic & Nature Learning):** 8 leads ready
  * **Pillar III (Child Development & Clinics):** 2 leads remaining

---

## 3. High-Converting Value Hook

All outbound touches embed the **SOE ECE Lesson Extender Tool** (`SOE_ECE_Lesson_Extender_Tool.html`):
* **Hook Mechanism:** Complimentary, screen-free **10–15 minute tactile lesson extension** aligned to state frameworks (Head Start ELOF, California DRDP, Texas Pre-K Guidelines, NAEYC).
* **Delivery URL:** `https://thesoundofessentials.com/tools/lesson-extender`
* **Voice Standard:** Zero hard sales pitches. Zero AI em dashes. Warm educator-to-peer tone. Seriphia guides the outreach; Founder L.D. Murray in supportive background role.

---

## 4. Nanobot Commands Reference

### A. Check Pipeline Status
```bash
python scripts/nanobot_outreach_bridge.py status
```
*Via Nanobot Agent:*
```bash
nanobot agent -w "C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website" -m "Check the B2B outreach status and tell me how many leads are ready."
```

### B. Run a Simulated (Dry-Run) Cohort
```bash
python scripts/nanobot_outreach_bridge.py run-cohort --pillar 1 --size 5
```

### C. Run a Live Dispatch Cohort (Brevo Send)
```bash
python scripts/nanobot_outreach_bridge.py run-cohort --pillar 1 --size 20 --send
```
*Via Nanobot Agent:*
```bash
nanobot agent -w "C:\Users\ldmur\Downloads\The-Sound-of-Essentials-Website" -m "Run today's 20-lead cohort for Pillar 1 with --send and report the dispatched leads."
```

### D. Generate Grounded Reply for Inbound Inquiries
```bash
python scripts/nanobot_outreach_bridge.py draft-reply --school "Bright Horizons" --name "Dr. Linda Chen" --framework "California"
```

---

## 5. Heartbeat & Continuous Automation

Nanobot's [`HEARTBEAT.md`](file:///C:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/HEARTBEAT.md) and [`SOUL.md`](file:///C:/Users/ldmur/Downloads/The-Sound-of-Essentials-Website/SOUL.md) are configured. When `nanobot gateway` runs in the background, it periodically checks the queue and executes cohorts according to schedule without manual supervision.
