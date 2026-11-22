"""
Markdown exporter for SOE Lesson Extensions.
"""

from typing import List
from soe_curriculum.models import LessonExtension


def export_markdown(lesson: LessonExtension) -> str:
    """Generate rich, printable markdown for a single lesson extension."""
    materials_list = "\n".join([f"- {m}" for m in lesson.materials]) if lesson.materials else "- Ordinary classroom items / bare hands"
    elof_codes_str = ", ".join(lesson.standards.elof_codes) if lesson.standards.elof_codes else "Universal ELOF Alignment"
    naeyc_str = ", ".join(lesson.standards.naeyc_standards) if lesson.standards.naeyc_standards else "Standard 2 (Curriculum)"

    swc = lesson.socratic_wonder_circle
    strats_str = ", ".join([f"`{s}`" for s in swc.strategies_activated]) if swc.strategies_activated else "`S-1`"
    standards_pills = ", ".join(swc.intellectual_standards) if swc.intellectual_standards else "Clarity, Accuracy"
    prompts_md = "\n".join([f"{idx}. {p}" for idx, p in enumerate(swc.prompts, start=1)])
    scaffolds_md = "\n".join([f"- **{tier}:** {cue}" for tier, cue in swc.age_tier_scaffolds.items()])
    units_md = ", ".join(swc.remodelled_unit_refs) if swc.remodelled_unit_refs else "Canonical Land Socratic Alignment"

    md = f"""# {lesson.domain_icon} Track {lesson.track_id}: {lesson.title}
> **The Sound of Essentials: Rhythm Quest** | **Land:** {lesson.land_name} (`{lesson.land_color}`)  
> **Hero Guides:** {lesson.hero_guides} | **Sovereign Guardian:** Seriphia  
> **Age Range:** {lesson.age_group} | **Duration:** {lesson.duration} (4-Step *Rhythm-to-Reason* Ritual)

---

## 📦 Materials Required (Zero-Prep)
{materials_list}

---

## 1. 🎯 Quest Mission (1 Sentence)
{lesson.quest_mission}

---

## 2. 🥁 Step 1: The Rhythm Ignition (2 Minutes)
{lesson.rhythm_ignition}

---

## 3. 🖐️ Step 2: Tactile Discovery Ritual (7 Minutes)
{lesson.tactile_ritual}

---

## 4. 💬 Step 3: Seriphia's Socratic Wonder Circle ({swc.duration})
> **Rhythm Cue:** {swc.rhythm_cue}  
> **Wait-Time Rule:** {swc.wait_time_rule}  
> **Critical Thinking Strategies Activated:** {strats_str} | **Intellectual Standards:** {standards_pills}

{prompts_md}

### Developmental Band Scaffolds (Ages 2–7)
{scaffolds_md}

*Linked Paul/Binker/Weil Remodelled Units:* {units_md}

---

## 5. 🌐 Step 4: The 5-Domain Spider (2-Minute Whole-Child Closure)
- **🗣️ Language & Early Literacy:** {lesson.domain_spider.language}
- **🔢 Cognitive & Mathematics:** {lesson.domain_spider.cognitive}
- **🤸 Physical & Motor Skills:** {lesson.domain_spider.physical}
- **🔬 Science & Sensory Exploration:** {lesson.domain_spider.science_sensory}
- **🤝 Social-Emotional & Relational:** {lesson.domain_spider.social_emotional}

---

## 6. 🌟 Seriphia's Parent / Teacher Whisper (1 Sentence)
*{lesson.teacher_whisper}*

---

## 🏛️ Institutional Standards Crosswalk (State DOE & Head Start Bidding)

| Framework | Alignment Code & Description |
| :--- | :--- |
| **Head Start ELOF** | `{elof_codes_str}` |
| **NAEYC Standards** | `{naeyc_str}` |
| **Kindergarten Readiness** | {lesson.standards.kindergarten_readiness} |

---
*© The Sound of Essentials: Rhythm Quest. Proprietary Screen-Free Sensory & Socratic Learning Curriculum (`soelearn.com`).*
"""
    return md


def export_batch_index_markdown(lessons: List[LessonExtension], title: str = "SOE Rhythm Quest Curriculum Package") -> str:
    """Generate table of contents and curriculum overview markdown."""
    rows = []
    for l in lessons:
        elof_brief = l.standards.elof_codes[0] if l.standards.elof_codes else "ELOF"
        strats_brief = ", ".join(l.socratic_wonder_circle.strategies_activated[:3])
        rows.append(
            f"| **Track {l.track_id}** | {l.domain_icon} [{l.title}](./{l.track_slug}.md) | {l.land_name} | {l.hero_guides} | `{strats_brief}` | `{elof_brief}` |"
        )

    table_body = "\n".join(rows)

    md = f"""# 📚 {title}
> **Turnkey Screen-Free 15-Minute Rhythm-to-Reason Tactile & Socratic Lesson Extension Suite**  
> Total Lessons: **{len(lessons)}** | Age Range: **Ages 2–7 (Pre-K to Grade 2)**

---

## 🗺️ Master Curriculum Index

| Track | Title | Land | Hero Guides | Socratic Strategies | Primary ELOF Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
{table_body}

---

## 🏛️ Inter-Institutional Compliance
Every lesson in this package is simultaneously aligned across:
1. **Head Start Early Learning Outcomes Framework (ELOF)**
2. **NAEYC Early Childhood Program Standards**
3. **Paul, Binker & Weil 35 Dimensions of Critical Thought (Ages 2–7 Adaptation)**
4. **State Pre-K & Kindergarten Readiness Guidelines**

*Engineered by `soe-curriculum-cli` wrapping `@early-childhood-lesson-extender` & Seriphia's Socratic Wonder Circle (`soelearn.com`).*
"""
    return md
