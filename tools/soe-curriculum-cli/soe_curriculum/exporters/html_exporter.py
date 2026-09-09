"""
HTML Exporter for Print-Ready Educator Lesson Cards.
Styled with SOE Claymorphic palette (#4F46E5, #22C55E, #FFF8F0).
"""

import html
from typing import List
from soe_curriculum.models import LessonExtension


def _escape(text: str) -> str:
    return html.escape(str(text))


def export_html(lesson: LessonExtension) -> str:
    """Generate a print-ready HTML educator card for a single lesson."""
    materials_html = "".join([f"<li>{_escape(m)}</li>" for m in lesson.materials]) or "<li>Ordinary classroom items</li>"
    elof_badges = "".join([f'<span class="badge elof">{_escape(c)}</span>' for c in lesson.standards.elof_codes])
    naeyc_badges = "".join([f'<span class="badge naeyc">{_escape(s)}</span>' for s in lesson.standards.naeyc_standards])

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Track {lesson.track_id}: {_escape(lesson.title)} — SOE Lesson Card</title>
  <style>
    :root {{
      --primary: #4F46E5;
      --primary-dark: #3730A3;
      --accent: #22C55E;
      --bg: #FFF8F0;
      --card-bg: #FFFFFF;
      --text: #1F2937;
      --text-muted: #6B7280;
      --border: #E5E7EB;
      --land-color: {_escape(lesson.land_color)};
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.5;
      padding: 30px 15px;
    }}

    .container {{
      max-width: 820px;
      margin: 0 auto;
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.06);
      overflow: hidden;
      border: 1px solid var(--border);
    }}

    .card-header {{
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 24px 30px;
      position: relative;
    }}

    .card-header-meta {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }}

    .land-tag {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .duration-tag {{
      background: var(--accent);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
    }}

    .card-title {{
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 4px;
    }}

    .card-subtitle {{
      font-size: 14px;
      opacity: 0.9;
    }}

    .card-body {{
      padding: 30px;
    }}

    .section {{
      margin-bottom: 24px;
    }}

    .section-title {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      border-bottom: 2px solid #F3F4F6;
      padding-bottom: 6px;
    }}

    .mission-box {{
      background: #F5F3FF;
      border-left: 4px solid var(--primary);
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      font-size: 16px;
      font-weight: 500;
      color: #3730A3;
    }}

    .materials-list {{
      list-style-type: none;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 6px;
    }}

    .materials-list li {{
      background: #F3F4F6;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 13px;
      color: #374151;
    }}

    .ritual-box {{
      background: #FAFAFA;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 16px;
      white-space: pre-line;
      font-size: 14px;
      line-height: 1.6;
    }}

    .spider-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }}

    .spider-item {{
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
    }}

    .spider-item strong {{
      color: var(--primary);
      display: block;
      margin-bottom: 2px;
    }}

    .whisper-box {{
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 14px;
      color: #065F46;
      font-style: italic;
    }}

    .standards-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 13px;
    }}

    .standards-table th, .standards-table td {{
      padding: 10px 12px;
      border: 1px solid #E5E7EB;
      text-align: left;
    }}

    .standards-table th {{
      background: #F9FAFB;
      font-weight: 600;
      width: 25%;
    }}

    .badge {{
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 6px;
      margin-bottom: 4px;
    }}

    .badge.elof {{ background: #E0E7FF; color: #3730A3; }}
    .badge.naeyc {{ background: #FEF3C7; color: #92400E; }}

    .footer {{
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      padding: 16px;
      background: #F9FAFB;
      border-top: 1px solid #E5E7EB;
    }}

    @media print {{
      body {{ background: white; padding: 0; }}
      .container {{ box-shadow: none; border: none; max-width: 100%; border-radius: 0; }}
      .card-header {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
      .mission-box, .whisper-box, .spider-item {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
      @page {{ margin: 1.5cm; }}
    }}
  </style>
</head>
<body>
  <div class="container">
    <header class="card-header">
      <div class="card-header-meta">
        <span class="land-tag">{_escape(lesson.domain_icon)} {_escape(lesson.land_name)}</span>
        <span class="duration-tag">{_escape(lesson.duration)}</span>
      </div>
      <h1 class="card-title">Track {lesson.track_id}: {_escape(lesson.title)}</h1>
      <p class="card-subtitle">Guides: {_escape(lesson.hero_guides)} | Target: {_escape(lesson.age_group)}</p>
    </header>

    <main class="card-body">
      <!-- Mission -->
      <section class="section">
        <h2 class="section-title">1. 🎯 Quest Mission</h2>
        <div class="mission-box">{_escape(lesson.quest_mission)}</div>
      </section>

      <!-- Materials -->
      <section class="section">
        <h2 class="section-title">📦 Materials Required (Zero-Prep)</h2>
        <ul class="materials-list">
          {materials_html}
        </ul>
      </section>

      <!-- Rhythm Ignition -->
      <section class="section">
        <h2 class="section-title">2. 🥁 The Rhythm Ignition (2 Minutes)</h2>
        <div class="ritual-box">{_escape(lesson.rhythm_ignition)}</div>
      </section>

      <!-- Tactile Discovery Ritual -->
      <section class="section">
        <h2 class="section-title">3. 🖐️ Tactile Discovery Ritual (7 Minutes)</h2>
        <div class="ritual-box">{_escape(lesson.tactile_ritual)}</div>
      </section>

      <!-- 5-Domain Spider -->
      <section class="section">
        <h2 class="section-title">4. 🌐 The 5-Domain Spider</h2>
        <div class="spider-grid">
          <div class="spider-item">
            <strong>🗣️ Language & Phonics</strong>
            {_escape(lesson.domain_spider.language)}
          </div>
          <div class="spider-item">
            <strong>🔢 Cognitive & Math</strong>
            {_escape(lesson.domain_spider.cognitive)}
          </div>
          <div class="spider-item">
            <strong>🤸 Physical & Motor</strong>
            {_escape(lesson.domain_spider.physical)}
          </div>
          <div class="spider-item">
            <strong>🔬 Science & Sensory</strong>
            {_escape(lesson.domain_spider.science_sensory)}
          </div>
          <div class="spider-item" style="grid-column: 1 / -1;">
            <strong>🤝 Social-Emotional & Regulation</strong>
            {_escape(lesson.domain_spider.social_emotional)}
          </div>
        </div>
      </section>

      <!-- Parent/Teacher Whisper -->
      <section class="section">
        <h2 class="section-title">5. 🌟 Parent / Teacher Whisper</h2>
        <div class="whisper-box">"{_escape(lesson.teacher_whisper)}"</div>
      </section>

      <!-- Standards Crosswalk -->
      <section class="section">
        <h2 class="section-title">🏛️ Institutional Standards Crosswalk</h2>
        <table class="standards-table">
          <tr>
            <th>Head Start ELOF</th>
            <td>{elof_badges}</td>
          </tr>
          <tr>
            <th>NAEYC Standards</th>
            <td>{naeyc_badges}</td>
          </tr>
          <tr>
            <th>Kindergarten Readiness</th>
            <td>{_escape(lesson.standards.kindergarten_readiness)}</td>
          </tr>
        </table>
      </section>
    </main>

    <footer class="footer">
      The Sound of Essentials: Rhythm Quest — Proprietary Screen-Free Sensory Pedagogy.
    </footer>
  </div>
</body>
</html>
"""


def export_batch_html(lessons: List[LessonExtension], title: str = "SOE Rhythm Quest Curriculum Suite") -> str:
    """Generate a multi-card printable curriculum booklet."""
    cards_html = "".join([f'<div style="page-break-after: always; margin-bottom: 40px;">{export_html(l)}</div>' for l in lessons])
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{_escape(title)}</title>
</head>
<body style="background:#FFF8F0; padding: 20px 0;">
  {cards_html}
</body>
</html>
"""
