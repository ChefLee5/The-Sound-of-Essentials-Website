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

    md = f"""# {lesson.domain_icon} Track {lesson.track_id}: {lesson.title}
> **The Sound of Essentials: Rhythm Quest** | **Land:** {lesson.land_name} (`{lesson.land_color}`)  
> **Hero Guides:** {lesson.hero_guides} | **Age Range:** {lesson.age_group} | **Duration:** {lesson.duration}

---

## 📦 Materials Required (Zero-Prep)
{materials_list}

---

## 1. 🎯 Quest Mission (1 Sentence)
{lesson.quest_mission}

---

## 2. 🥁 The Rhythm Ignition (2 Minutes)
{lesson.rhythm_ignition}

---

## 3. 🖐️ Tactile Discovery Ritual (7 Minutes)
{lesson.tactile_ritual}

---

## 4. 🌐 The 5-Domain Spider
- **🗣️ Language & Early Literacy:** {lesson.domain_spider.language}
- **🔢 Cognitive & Mathematics:** {lesson.domain_spider.cognitive}
- **🤸 Physical & Motor Skills:** {lesson.domain_spider.physical}
- **🔬 Science & Sensory Exploration:** {lesson.domain_spider.science_sensory}
- **🤝 Social-Emotional & Relational:** {lesson.domain_spider.social_emotional}

---

## 5. 🌟 Parent / Teacher Whisper (1 Sentence)
*{lesson.teacher_whisper}*

---

## 🏛️ Institutional Standards Crosswalk (State DOE & Head Start Bidding)

| Framework | Alignment Code & Description |
| :--- | :--- |
| **Head Start ELOF** | `{elof_codes_str}` |
| **NAEYC Standards** | `{naeyc_str}` |
| **Kindergarten Readiness** | {lesson.standards.kindergarten_readiness} |

---
*© The Sound of Essentials: Rhythm Quest. Proprietary Screen-Free Sensory Learning Curriculum.*
"""
    return md


def export_batch_index_markdown(lessons: List[LessonExtension], title: str = "SOE Rhythm Quest Curriculum Package") -> str:
    """Generate table of contents and curriculum overview markdown."""
    rows = []
    for l in lessons:
        elof_brief = l.standards.elof_codes[0] if l.standards.elof_codes else "ELOF"
        rows.append(f"| **Track {l.track_id}** | {l.domain_icon} [{l.title}](./{l.track_slug}.md) | {l.land_name} | {l.hero_guides} | `{elof_brief}` |")

    table_body = "\n".join(rows)

    md = f"""# 📚 {title}
> **Turnkey Screen-Free 10–15 Minute Tactile Lesson Extension Suite**  
> Total Lessons: **{len(lessons)}** | Age Range: **Ages 2–7 (Pre-K to Grade 1)**

---

## 🗺️ Master Curriculum Index

| Track | Title | Land | Hero Guides | Primary ELOF Code |
| :--- | :--- | :--- | :--- | :--- |
{table_body}

---

## 🏛️ Inter-Institutional Compliance
Every lesson in this package is simultaneously aligned across:
1. **Head Start Early Learning Outcomes Framework (ELOF)**
2. **NAEYC Early Childhood Program Standards**
3. **State Pre-K & Kindergarten Readiness Guidelines**

*Engineered by `soe-curriculum-cli` wrapping `@early-childhood-lesson-extender`.*
"""
    return md
