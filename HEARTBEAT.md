# Heartbeat Tasks

<!--
This file is checked periodically by your nanobot agent. When nanobot gateway starts with gateway.heartbeat.enabled=true, it automatically registers a protected heartbeat cron job that reads this file.

Use this file for recurring background checks that should stay quiet unless there is something useful to report. Regular cron jobs are different: they normally deliver each run's result back to the chat/session where they were created.

If this file has no tasks (only headers and comments), the agent will skip it. Completed tasks should be deleted, not kept - heartbeat only reads "Active Tasks".
-->

## Active Tasks

- [ ] **SOE B2B Outreach Cohort Runner**:
  Run `python scripts/nanobot_outreach_bridge.py status` to inspect lead queues and ledger.
  Check how many leads remain in Pillar I and Pillar V.
  When instructed or on schedule, dispatch the next 25-lead cohort using `python scripts/nanobot_outreach_bridge.py run-cohort --pillar 1 --size 25`.
  Report any newly dispatched cohort count or delivery errors.

- [ ] **Inbound Educator Reply Triage**:
  Monitor for replies from preschool directors or Head Start leaders.
  Draft grounded replies offering the gift link to the **SOE ECE Lesson Extender Tool** (`SOE_ECE_Lesson_Extender_Tool.html`).


