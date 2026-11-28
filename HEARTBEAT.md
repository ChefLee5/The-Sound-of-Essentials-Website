# Heartbeat Tasks

<!--
This file is checked periodically by your nanobot agent. When nanobot gateway starts with gateway.heartbeat.enabled=true, it automatically registers a protected heartbeat cron job that reads this file.

Use this file for recurring background checks that should stay quiet unless there is something useful to report. Regular cron jobs are different: they normally deliver each run's result back to the chat/session where they were created.

If this file has no tasks (only headers and comments), the agent will skip it. Completed tasks should be deleted, not kept - heartbeat only reads "Active Tasks".
-->

## Active Tasks

- [ ] **SOE B2B Outreach Cohort Runner (Concord 1,209 & Global Advocacy 126)**:
  Run `python scripts/nanobot_outreach_bridge.py status --json` to inspect Concord lead queues (`1,209` total) and `python scripts/nanobot_outreach_bridge.py status --theatre global-advocacy --json` for ranked Global Advocacy targets (`126` total).
  Check remaining leads in Pillar I, Pillar V, Singapore (`Grow Well SG`), Caribbean ECC, and India (`Jaadui Pitara`).
  When instructed or on schedule, stage dry-run briefs first using `python scripts/nanobot_outreach_bridge.py run-cohort --pillar 1 --size 25` and `python scripts/nanobot_outreach_bridge.py run-cohort --theatre global-advocacy --size 10`. Never pass `--send` without explicit human approval.
  Report staged cohort counts, template lint health (`leads/seriphia_signal_campaigns.json`), or delivery errors.

- [ ] **Inbound Educator & Clinic Reply Triage (MyClaw Inbox Triage)**:
  Monitor for replies from preschool directors, Head Start leaders, micro-school pods, and pediatric OT/SLP clinics.
  Classify and draft grounded human-review replies via `python scripts/nanobot_outreach_bridge.py triage-inbox --body "<reply>" --org "<org>" --framework "<framework>" --stage --json`.
  Intents handled: `PILOT_INTEREST`, `CLINICAL_SAMPLE_REQUEST`, `POD_KIT_INQUIRY`, `OBJECTION`, and `UNSUBSCRIBE`, using Haystack standards crosswalks and SOE-owned gift links (`/signal`, `SOE_Sensory_Regulation_Guide.html`, `SOE_5_Neural_Pathways_Guide.html`).

- [ ] **Daily Seriphia Signal Pulse & Channel Pacing (Meta Cooldown Active)**:
  Run daily `rt-mcls-pulse` (Reddit `r/ECEProfessionals`, `r/Preschoolers`, `r/teachers`, `r/Montessori`, `r/OccupationalTherapy`, `r/Parenting` + X social scan) and `rt-signal-global-stage` via `autonomous-systems-stack/runner.py`.
  Keep paid media pacing locked to `40% Google / 25% Pinterest / 20% X.com / 15% Reddit` while Meta remains in `PAUSED_AUTOMATION_COOLDOWN`.


