# SOE Curriculum CLI (`soe-curriculum-cli`)

**The Sound of Essentials: Rhythm Quest** — Turnkey Screen-Free Classroom Lesson Extender & Multi-Institutional Standards Crosswalk Engine.

Wraps `@early-childhood-lesson-extender` to batch-produce 10–15 minute hands-on sensory/music lesson packages across:
- **Head Start ELOF** (Early Learning Outcomes Framework)
- **NAEYC Early Childhood Program Standards**
- **State DOE Pre-K Guidelines** (CA DRDP, TX PKG, NYSPK)
- **K–3 Kindergarten Readiness & CCSS**

## Installation
```bash
pip install -e .
```

## Usage
```bash
# List catalog
soe-curriculum-cli list tracks
soe-curriculum-cli list lands

# Generate lesson for single track
soe-curriculum-cli generate drill-time --format all --output-dir ./output

# Batch produce for an entire Land
soe-curriculum-cli batch --land vitalis --output-dir ./vitalis_pack

# Export ELOF / NAEYC Standards Crosswalk Matrix
soe-curriculum-cli standards --output ./elof_crosswalk.md
```
