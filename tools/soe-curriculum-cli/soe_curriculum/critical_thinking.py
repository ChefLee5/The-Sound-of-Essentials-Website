"""
SOE Critical Thinking & Socratic Remodelling Curriculum Engine.

Foundational syllabus and instructional architecture extracted from:
Paul, R., Binker, A.J.A., & Weil, D. (1990). Critical Thinking Handbook: K-3:
A Guide for Remodelling Lesson Plans in Language Arts, Social Studies, & Science
(ISBN 0-944583-05-9, ERIC ED325803, 420 pp.).

Adapted strictly for The Sound of Essentials: Rhythm Quest canon:
- Ages 2–7 (Toddler, Pre-K, TK, Kindergarten, Grades 1–2)
- 7 Canonical Lands (Harmonia, Numeria, Vitalis, Luminosity, Aquaria, Terrasol, Celestia)
- 15 Heroes (14 Land Heroes + Sovereign Guide Seriphia)
- 100% Screen-Free, Acoustic-First ("Talk FROM, Not ABOUT") Neuro-Pedagogy
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SyllabusChapter(BaseModel):
    part: str
    chapter_number: int
    title: str
    book_pages: str
    pdf_pages: str
    core_concepts: List[str]
    soe_curriculum_role: str


class CriticalThinkingStrategy(BaseModel):
    code: str
    category: str
    formal_name: str
    child_voice: str
    pdf_page: int
    land_id: str
    land_name: str
    hero_guides: str
    socratic_spark: str
    rhythm_tactile_mechanic: str
    elof_naeyc_alignment: str


class RemodelledUnitMap(BaseModel):
    unit_id: int
    source_title: str
    source_domain: str
    pdf_page: int
    strategies: List[str]
    soe_land_id: str
    soe_track_slug: str
    soe_age_tier: str
    soe_remodel_summary: str


class SocraticQuestModule(BaseModel):
    quest_id: str
    land_id: str
    land_name: str
    hero_guides: str
    paired_track_slug: str
    paired_track_title: str
    age_band: str = "Ages 2–7 (Pre-K to Grade 2)"
    duration: str = "15 Minutes"
    strategies_activated: List[str] = Field(default_factory=list)
    didactic_trap_replaced: str
    quest_mission: str
    rhythm_ignition: str
    tactile_discovery_ritual: str
    socratic_wonder_circle: List[str]
    five_domain_spider: Dict[str, str]
    seriphia_whisper: str
    institutional_standards: List[str]


TEXTBOOK_PROVENANCE: Dict[str, Any] = {
    "title": "Critical Thinking Handbook: K-3: A Guide for Remodelling Lesson Plans in Language Arts, Social Studies, & Science",
    "authors": ["Richard Paul", "A.J.A. Binker", "Daniel Weil"],
    "institution": "Center for Critical Thinking and Moral Critique / Foundation for Critical Thinking, Sonoma State University",
    "publication_year": 1990,
    "isbn_10": "0-944583-05-9",
    "eric_accession": "ED325803",
    "pdf_pages_measured": 420,
    "parts_count": 2,
    "chapters_count": 16,
    "core_strategies_count": 35,
    "supplemental_dimensions_count": 4,
    "remodelled_subject_lessons_count": 69,
    "remodelled_thematic_units_count": 1,
    "total_remodelled_units_count": 70,
    "soe_canonical_adaptation_scope": "Ages 2–7 (Sprouts Ages 2–4, Pathfinders Ages 4–5, Wayfarers Ages 6–7 | Pre-K to Grade 2)",
}


INTELLECTUAL_STANDARDS: List[Dict[str, str]] = [
    {"standard": "Clarity", "contrast": "clear vs. unclear", "seriphia_prompt": "Can you paint that picture with words or show me with your hands so we all see it clearly?"},
    {"standard": "Precision", "contrast": "precise vs. imprecise", "seriphia_prompt": "Let us zoom in close—exactly which sound, number, or part do you mean?"},
    {"standard": "Specificity", "contrast": "specific vs. vague", "seriphia_prompt": "Can you give one real-world example you have touched, heard, or seen today?"},
    {"standard": "Accuracy", "contrast": "accurate vs. inaccurate", "seriphia_prompt": "How can we test or check with our senses whether that is really true?"},
    {"standard": "Relevance", "contrast": "relevant vs. irrelevant", "seriphia_prompt": "Does that clue help us solve our Quest question, or does it belong on another path?"},
    {"standard": "Consistency", "contrast": "consistent vs. inconsistent", "seriphia_prompt": "Do our two ideas sing in harmony together, or do they bump into each other?"},
    {"standard": "Logic", "contrast": "logical vs. illogical", "seriphia_prompt": "Does step two grow naturally out of step one like a sprout from a seed?"},
    {"standard": "Depth", "contrast": "deep vs. superficial", "seriphia_prompt": "Let us look underneath the surface like roots in Terrasol—why is this hard or tricky?"},
    {"standard": "Completeness", "contrast": "complete vs. incomplete", "seriphia_prompt": "Have we heard every piece of the puzzle, or is a quiet clue still missing?"},
    {"standard": "Significance", "contrast": "significant vs. trivial", "seriphia_prompt": "Which idea matters most for helping our community and understanding the whole story?"},
    {"standard": "Adequacy", "contrast": "adequate vs. inadequate", "seriphia_prompt": "Do we have enough reasons yet to decide, or should we keep wondering a little longer?"},
    {"standard": "Fairmindedness", "contrast": "fair vs. biased or one-sided", "seriphia_prompt": "Have we stepped gently into our friend's shoes to hear how the story sounds from their side?"},
]


SOCRATIC_TAXONOMY: List[Dict[str, Any]] = [
    {
        "category": "1. Questions of Clarification",
        "pdf_page": 52,
        "rhythm_cue": "Open-Palm Echo Tap (60 BPM)",
        "child_prompts": [
            "What do you mean when you say ___?",
            "Could you show me an example with these blocks/stones?",
            "Can someone echo back in their own words what our friend just shared?",
        ],
    },
    {
        "category": "2. Questions that Probe Assumptions",
        "pdf_page": 52,
        "rhythm_cue": "Two-Finger Chin Tap ('Hidden Bridge Check')",
        "child_prompts": [
            "What are we believing without checking first?",
            "Does that happen every single time, or only sometimes?",
            "What else could we assume instead?",
        ],
    },
    {
        "category": "3. Questions that Probe Reasons, Evidence & Causes",
        "pdf_page": 52,
        "rhythm_cue": "Three-Beat Detective Knock (Knock-Knock-Knock: 'What's the Clue?')",
        "child_prompts": [
            "How do you know that? What clues did your eyes, ears, or hands find?",
            "What makes you think that is the cause?",
            "How could we test this right now in our room?",
        ],
    },
    {
        "category": "4. Questions About Viewpoints or Perspectives",
        "pdf_page": 52,
        "rhythm_cue": "Passing Bowl / Stepping Across the Circle Rug",
        "child_prompts": [
            "How might someone standing on the other side of the river see this?",
            "What would the other character in the story say?",
            "How are your two ideas alike, and how are they different?",
        ],
    },
    {
        "category": "5. Questions that Probe Implications & Consequences",
        "pdf_page": 52,
        "rhythm_cue": "Domino Clap Ripple Around the Circle",
        "child_prompts": [
            "If that happened first, what ripple would happen next? Why?",
            "Would that definitely happen, or only maybe happen?",
            "How would that choice affect everyone else in our circle?",
        ],
    },
    {
        "category": "6. Questions About the Question",
        "pdf_page": 53,
        "rhythm_cue": "Hands-Over-Heart Pause Breath",
        "child_prompts": [
            "Is this an easy question or a deep question? Why?",
            "Do we need to measure/check facts, or are we sharing personal favorites?",
            "What smaller question do we need to figure out first?",
        ],
    },
]


SYLLABUS_CHAPTERS: List[SyllabusChapter] = [
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=1,
        title="Introduction: The Design of the Book & Lesson Plan Remodelling",
        book_pages="pp. 1–18",
        pdf_pages="PDF pp. 9–26",
        core_concepts=[
            "Replacing passive recall and keyword shortcuts ('Mr. Left' / robotic steps) with genuine reasoning",
            "Anatomy of a Remodel: Original Lesson -> Critique -> Strategies (S-1..S-35) -> Remodelled Lesson Plan",
            "Diagram 1: Uncritical vs. Self-Serving (Weak-Sense) vs. Fairminded (Strong-Sense) Thinking",
            "Diagram 3: The 12 Perfections and Imperfections of Thought",
        ],
        soe_curriculum_role="Establishes SOE's core instructional engine: transforming passive/didactic worksheets into embodied, screen-free Socratic rituals.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=2,
        title="Making Critical Thinking Intuitive: Using Drama, Examples, and Images",
        book_pages="pp. 19–36",
        pdf_pages="PDF pp. 27–44",
        core_concepts=[
            "Bridging abstract concepts to concrete lived experience instead of dictionary memorization",
            "Dramatization of cognitive dispositions (Uncritical Drift vs. Egocentric Shortcut vs. Fairminded Inquiry)",
            "Exemplification: Teaching Inference vs. Assumption through everyday sensory mysteries",
            "Visual and spatial metaphors for young thinkers",
        ],
        soe_curriculum_role="Powers SOE Hero Storytelling (Block J) and Picture Dictionary visual inquiry across the 7 Lands.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=3,
        title="Global Strategies: Socratic Questioning & Role-Playing",
        book_pages="pp. 37–56",
        pdf_pages="PDF pp. 45–64",
        core_concepts=[
            "Socratic Questioning: Wondering aloud about meaning and truth (6 Question Categories)",
            "4 Directions of Thought Pursuit: Origin, Support, Conflicting Views, Implications",
            "Primary-grade Socratic discussion transcripts & student self-regulated questioning",
            "Role-playing opposing perspectives & distinguishing Fact, Preference/Opinion, and Reasoned Judgment",
        ],
        soe_curriculum_role="Defines SOE's 'Socratic Rhythm Circle' facilitation protocol for parents and classroom teachers.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=4,
        title="Strategies: 35 Dimensions of Critical Thought",
        book_pages="pp. 57–108",
        pdf_pages="PDF pp. 65–116",
        core_concepts=[
            "9 Affective Strategies (S-1 to S-9): Intellectual independence, humility, courage, perseverance, empathy, fairmindedness",
            "17 Cognitive Macro-Abilities (S-10 to S-26): Socratic discussion, dialogical/dialectical reasoning, criteria & solution design",
            "9 Cognitive Micro-Skills (S-27 to S-35): Assumptions, inferences, relevant facts, evidence, contradictions, consequences",
            "4 Supplemental Dimensions (Dalzell): Intellectual Curiosity, Social Sensitivity, Critical Observation, Precise Expression",
        ],
        soe_curriculum_role="Provides the exact 35-Strategy competency matrix distributed 5-per-Land across all 7 Canonical Lands of Rhythm Quest.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=5,
        title="Remodelling Language Arts Lessons (23 Remodelled Lessons)",
        book_pages="pp. 109–168",
        pdf_pages="PDF pp. 117–176",
        core_concepts=[
            "Integrating listening, speaking, reading, and emergent writing as unified meaning-making",
            "Logical connectives ('because', 'if...then', 'although', 'therefore') as audible joints of thought",
            "23 Remodelled Lessons spanning story ethics, critical listening, questioning, and precise description",
        ],
        soe_curriculum_role="Anchors Harmonia (Kenji & Aiko) and Luminosity (Athena & Ezra) oral language, phonics, and story comprehension quests.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=6,
        title="Remodelling Social Studies Lessons (26 Remodelled Lessons)",
        book_pages="pp. 169–236",
        pdf_pages="PDF pp. 177–244",
        core_concepts=[
            "How humans live together fairly: rules, community roles, needs vs. wants, emotional insight, media credibility",
            "Overcoming egocentric ('only me') and sociocentric ('only my group') blind spots",
            "26 Remodelled Lessons (including iterative dual-remodel of 'Tools') from Kindergarten up",
        ],
        soe_curriculum_role="Anchors Aquaria (Nerissa & Ronan — feelings/empathy) and Luminosity (Athena & Ezra — civics, rules, community stewardship).",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=7,
        title="Remodelling Science Lessons (18 Remodelled Lessons)",
        book_pages="pp. 237–276",
        pdf_pages="PDF pp. 245–284",
        core_concepts=[
            "Thinking scientifically through student-designed experiments rather than memorizing finished textbook facts",
            "Controlled comparisons (living seeds, senses, weather/seasons, condensation, magnets, rocks, waves, soil)",
            "18 Remodelled Lessons emphasizing hypothesis testing, measurement criteria, and evidence evaluation",
        ],
        soe_curriculum_role="Anchors Terrasol (Vesta & Silas — earth/living systems) and Celestia (Elias & Selene — weather, solar cycles, seasons).",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=8,
        title="Remodelling Math Lessons (2 Remodelled Lessons)",
        book_pages="pp. 277–282",
        pdf_pages="PDF pp. 285–290",
        core_concepts=[
            "Defeating mechanical number-crunching ('75 sheep and 5 dogs, how old is the shepherd?')",
            "Evaluating data representations (Bar Graphs) and isolating relevant vs. irrelevant quantities in Word Problems",
        ],
        soe_curriculum_role="Anchors Numeria (Kwame & Octavia) tactile math reasoning, data sense, and relevant-clue discrimination.",
    ),
    SyllabusChapter(
        part="Part I: Putting Critical Thinking into Instruction",
        chapter_number=9,
        title="Remodelling Lessons into Thematic Units (by Daniel Weil)",
        book_pages="pp. 283–297",
        pdf_pages="PDF pp. 291–305",
        core_concepts=[
            "Holistic, multi-cultural cross-disciplinary thematic integration versus fragmented subject silos",
            "Complete Remodelled Thematic Unit on Friendship & Family Relationships across stories, civics, science, and home life",
        ],
        soe_curriculum_role="Validates SOE's multi-domain weekly Quest structure where Language, Math, Science, Movement, and SEL unite around one Land theme.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=10,
        title="Thinking Critically About Teaching: From Didactic to Critical Teaching",
        book_pages="pp. 299–312",
        pdf_pages="PDF pp. 307–320",
        core_concepts=[
            "21 Contrasting Assumptions between the Didactic Theory and Critical Theory of Knowledge, Learning, and Literacy",
            "Systemic textbook flaws: pseudo-questions, fragmented trivia, and conflating fact/opinion/reasoned judgment",
        ],
        soe_curriculum_role="Forms the white-paper and B2B procurement rationale contrasting passive EdTech screens against SOE's active neuro-pedagogy.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=11,
        title="Remodelling the Curriculum",
        book_pages="pp. 313–325",
        pdf_pages="PDF pp. 321–333",
        core_concepts=[
            "Making curriculum philosophy explicit rather than hidden",
            "Reformulating vague district curriculum goals into concrete critical-thinking learner behaviors",
        ],
        soe_curriculum_role="Guides SOE State DOE RFP alignment exhibits and multi-institutional ELOF/NAEYC/CCSS crosswalks.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=12,
        title="Remodelling: A Foundation for Staff Development",
        book_pages="pp. 327–334",
        pdf_pages="PDF pp. 335–342",
        core_concepts=[
            "Respecting teacher autonomy through collaborative lesson critique and iterative redesign",
            "Coaching mindset over top-down scripted lecturing",
        ],
        soe_curriculum_role="Powers onboarding and professional development for SOE Education Concord Evangelists and partner schools.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=13,
        title="The Greensboro Plan: A Sample Staff Development Plan",
        book_pages="pp. 335–339",
        pdf_pages="PDF pp. 343–347",
        core_concepts=[
            "Multi-year demonstration-site rollout model across elementary classrooms",
            "Peer coaching, workshop cadence, and administrative support structures",
        ],
        soe_curriculum_role="Provides the B2B pilot-to-district scaling blueprint for SOE Charter & State Pre-K deployments.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=14,
        title="What Critical Thinking Means to Me: The Views of Teachers",
        book_pages="pp. 341–358",
        pdf_pages="PDF pp. 349–366",
        core_concepts=[
            "First-person reflections from Kindergarten and primary educators on 'wondering aloud' with young children",
        ],
        soe_curriculum_role="Informs SOE's 'Parent / Teacher Whisper' voice—warm, jargon-free, practitioner-to-practitioner encouragement.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=15,
        title="Regarding a Definition of Critical Thinking",
        book_pages="pp. 359–368",
        pdf_pages="PDF pp. 367–376",
        core_concepts=[
            "Synthesizing Ennis, Lipman, Siegel, and Paul: Strong-sense fairminded thinking vs. atomic skill drills",
            "Elements of Reasoning & interdependence of intellectual virtues",
        ],
        soe_curriculum_role="Grounds SOE's pedagogical white papers in peer-recognized philosophical and developmental scholarship.",
    ),
    SyllabusChapter(
        part="Part II: Achieving the Deeper Understandings",
        chapter_number=16,
        title="Glossary: An Educator's Guide to Critical Thinking Terms & Recommended Readings",
        book_pages="pp. 369–396",
        pdf_pages="PDF pp. 377–404",
        core_concepts=[
            "Analytic educator glossary of core critical-thinking concepts (assumption, concept, critique, dialogical, egocentricity, inference, logic)",
            "Curated bibliography across psychology, science, math problem-solving (Schoenfeld), and early childhood",
        ],
        soe_curriculum_role="Supplies parent/educator glossary definitions and Picture Dictionary 'Thinker's Word' extensions.",
    ),
]


CRITICAL_THINKING_STRATEGIES: List[CriticalThinkingStrategy] = [
    # --- LAND 3: VITALIS (Felix & Amara) — Agency, Perseverance, Integrity & Confidence in Reason ---
    CriticalThinkingStrategy(
        code="S-1",
        category="Affective",
        formal_name="Thinking Independently",
        child_voice="I try to figure things out with my own hands and mind before asking someone to do it for me.",
        pdf_page=79,
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        socratic_spark="Before I show a way, how many ways can your own hands and mind test this first?",
        rhythm_tactile_mechanic="Solo Rhythm Invention: Child taps an original 4-beat body-percussion pattern before group echo.",
        elof_naeyc_alignment="ELOF P-ATL 4 (Initiative & Curiosity) | NAEYC 2.A.10",
    ),
    CriticalThinkingStrategy(
        code="S-7",
        category="Affective",
        formal_name="Developing Intellectual Good Faith or Integrity",
        child_voice="I use the exact same fair rules for myself that I ask my friends to follow.",
        pdf_page=86,
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        socratic_spark="Are we using the same rule for ourselves that we just asked our partner to follow?",
        rhythm_tactile_mechanic="Mirror Balance Hold: Partners balance a scarf together using identical gentle hand pressure.",
        elof_naeyc_alignment="ELOF P-SE 5 (Prosocial Integrity) | NAEYC 2.B.02",
    ),
    CriticalThinkingStrategy(
        code="S-8",
        category="Affective",
        formal_name="Developing Intellectual Perseverance",
        child_voice="Some puzzles take slow breaths and steady tries—even when my brain feels stretched, I stay on the path.",
        pdf_page=87,
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        socratic_spark="What makes this puzzle tricky, and what can we try next after one slow Vitalis breath?",
        rhythm_tactile_mechanic="4-Count Reset Breath + Steady 80 BPM Drum Pulse while rebuilding a toppled block tower.",
        elof_naeyc_alignment="ELOF P-ATL 2 (Persistence & Attention) | NAEYC 2.B.04",
    ),
    CriticalThinkingStrategy(
        code="S-9",
        category="Affective",
        formal_name="Developing Confidence in Reason",
        child_voice="My mind can figure hard things out when I slow down, look for clues, and test good reasons.",
        pdf_page=89,
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        socratic_spark="Why does this rule or step make sense? Let us trace the reason together instead of guessing!",
        rhythm_tactile_mechanic="Step-by-Step Cadence March ('First we check, next we test, then we know!').",
        elof_naeyc_alignment="ELOF P-SCI 5 (Reasoning & Inquiry) | NAEYC 2.G.02",
    ),
    CriticalThinkingStrategy(
        code="S-27",
        category="Cognitive Micro-Skill",
        formal_name="Comparing and Contrasting Ideals with Actual Practice",
        child_voice="We notice when what we say we do doesn't match what our hands and feet are actually doing, so we can fix it.",
        pdf_page=109,
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        socratic_spark="We promised to listen quietly—what did our bodies actually just do, and how can we match our promise?",
        rhythm_tactile_mechanic="Statue Freeze Check: Compare 'Chaotic March' vs. 'Sovereign Cadet March' on a drum cue.",
        elof_naeyc_alignment="ELOF P-ATL 1 (Self-Monitoring) | NAEYC 2.L.01",
    ),

    # --- LAND 5: AQUARIA (Nerissa & Ronan) — Empathy, Emotions, Fairmindedness & Perspective Flow ---
    CriticalThinkingStrategy(
        code="S-2",
        category="Affective",
        formal_name="Developing Insight into Egocentricity or Sociocentricity",
        child_voice="Just because I want something first—or all my friends say it—doesn't automatically make it fair or true.",
        pdf_page=80,
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        socratic_spark="Do we think this is best because it is fair for everyone, or only because it gives us what we want first?",
        rhythm_tactile_mechanic="Wider Circle Ripple: Drop a pebble in a water bowl and watch waves reach every edge, not just the center.",
        elof_naeyc_alignment="ELOF P-SE 7 (Empathy & Perspective) | NAEYC 2.L.04",
    ),
    CriticalThinkingStrategy(
        code="S-3",
        category="Affective",
        formal_name="Exercising Fairmindedness",
        child_voice="When I disagree with someone, I step into their shoes to hear their best reasons fairly.",
        pdf_page=82,
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        socratic_spark="If you traded places with the other character right now, what would feel fair to you?",
        rhythm_tactile_mechanic="Two-Shore Footprints: Child physically steps onto Paper Footprint A, speaks View A, then steps onto Footprint B.",
        elof_naeyc_alignment="ELOF P-SE 4 (Cooperative Problem-Solving) | NAEYC 2.B.02",
    ),
    CriticalThinkingStrategy(
        code="S-4",
        category="Affective",
        formal_name="Exploring Thoughts Underlying Feelings and Feelings Underlying Thoughts",
        child_voice="When big feelings rise like waves, I ask what thought woke that wave up—and whether another thought brings calm.",
        pdf_page=83,
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        socratic_spark="What thought inside your mind made that angry or sad wave feel so big—and could the story look another way?",
        rhythm_tactile_mechanic="Ocean Tide Breath (4-count inhale, 6-count '/shhhh/' exhale) paired with Thought-Wave cards.",
        elof_naeyc_alignment="ELOF P-SE 6 (Emotional Understanding) | NAEYC 2.L.01",
    ),
    CriticalThinkingStrategy(
        code="S-25",
        category="Cognitive Macro-Ability",
        formal_name="Reasoning Dialogically: Comparing Perspectives, Interpretations, or Theories",
        child_voice="Talking back and forth with friends who see different clues helps all our ideas grow wiser.",
        pdf_page=108,
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        socratic_spark="How is your partner's idea about the story different from yours, and what can each side teach the other?",
        rhythm_tactile_mechanic="Call-and-Response Singing Bowl / Passing Shell duet where Speaker B paraphrases Speaker A before adding.",
        elof_naeyc_alignment="ELOF P-LC 4 (Conversational Pragmatics) | NAEYC 2.C.03",
    ),
    CriticalThinkingStrategy(
        code="S-26",
        category="Cognitive Macro-Ability",
        formal_name="Reasoning Dialectically: Evaluating Perspectives, Interpretations, or Theories",
        child_voice="When two ideas disagree, we test the clues on both sides carefully before making up our minds.",
        pdf_page=109,
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        socratic_spark="Which part of each viewpoint has the strongest clues behind it when we put them side by side?",
        rhythm_tactile_mechanic="Two-Cup Balance Scale: Place physical pebble 'clues' into two cups to weigh competing story explanations.",
        elof_naeyc_alignment="ELOF P-SCI 3 (Comparing & Evaluating) | NAEYC 2.G.02",
    ),

    # --- LAND 1: HARMONIA (Kenji & Aiko) — Word Precision, Critical Listening, Courageous Speech ---
    CriticalThinkingStrategy(
        code="S-6",
        category="Affective",
        formal_name="Developing Intellectual Courage",
        child_voice="I can share a thoughtful question or kind truth courteously, even if everyone else in the circle thinks differently.",
        pdf_page=86,
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        socratic_spark="Does anyone see a quiet clue that nobody else has mentioned yet? In Harmonia, brave kind voices are celebrated!",
        rhythm_tactile_mechanic="Kenji's Courage Bell: Ring a soft chime before voicing an independent question or respectful disagreement.",
        elof_naeyc_alignment="ELOF P-SE 9 (Sense of Self & Voice) | NAEYC 2.C.01",
    ),
    CriticalThinkingStrategy(
        code="S-14",
        category="Cognitive Macro-Ability",
        formal_name="Clarifying and Analyzing the Meanings of Words or Phrases",
        child_voice="Sometimes a word sounds familiar until we try to explain it—so we test real examples vs. non-examples!",
        pdf_page=94,
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        socratic_spark="What makes something truly a 'friend' (or a 'tool')—and what would NOT count even if it looks close?",
        rhythm_tactile_mechanic="Syllable Clap + 3-Pile Object Sort ('Clearly Yes', 'Clearly No', 'Hard-to-Decide Borderline').",
        elof_naeyc_alignment="ELOF P-LC 6 (Vocabulary Depth) | NAEYC 2.D.02",
    ),
    CriticalThinkingStrategy(
        code="S-21",
        category="Cognitive Macro-Ability",
        formal_name="Reading Critically: Clarifying or Critiquing Texts",
        child_voice="Listening to or reading a story is like being a sound detective—we ask if the story makes sense and check for clues.",
        pdf_page=102,
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        socratic_spark="What is the author really trying to tell us here—and would a real child or animal in life act that way? Why?",
        rhythm_tactile_mechanic="Story Pause Drum-Tap: Children tap knees twice whenever a story character makes a surprising claim.",
        elof_naeyc_alignment="ELOF P-LIT 4 (Story Comprehension) | CCSS.ELA RL.K.1",
    ),
    CriticalThinkingStrategy(
        code="S-22",
        category="Cognitive Macro-Ability",
        formal_name="Listening Critically: The Art of Silent Dialogue",
        child_voice="Real listening isn't just waiting to talk—my mind quietly asks 'What do they mean?' and 'Has that happened to me?'",
        pdf_page=104,
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        socratic_spark="Who listened closely enough to tell us our friend's main idea so accurately that they smile and nod 'Yes!'?",
        rhythm_tactile_mechanic="Cupped 'Sonorous Ears' + Echo Paraphrase Ritual before passing the wooden rhythm stick.",
        elof_naeyc_alignment="ELOF P-LC 1 (Active Listening) | CCSS.ELA SL.K.1",
    ),
    CriticalThinkingStrategy(
        code="S-28",
        category="Cognitive Micro-Skill",
        formal_name="Thinking Precisely About Thinking: Using Critical Vocabulary",
        child_voice="Special thinking words like 'assume', 'infer', 'clue', and 'reason' help me see what my mind is doing!",
        pdf_page=110,
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        socratic_spark="Did your eyes actually SEE that happen (a fact), or did your mind INFER it from a clue?",
        rhythm_tactile_mechanic="Chanted Rhythmic Word-Action Gestures: Touch eyes for 'Observe', tap temple for 'Infer', open palms for 'Reason'.",
        elof_naeyc_alignment="ELOF P-LC 5 (Expressive Precision) | NAEYC 2.B.03",
    ),

    # --- LAND 2: NUMERIA (Kwame & Octavia) — Quantifiers, Criteria, Classification, Relevant Clues & Consistency ---
    CriticalThinkingStrategy(
        code="S-10",
        category="Cognitive Macro-Ability",
        formal_name="Refining Generalizations and Avoiding Oversimplifications",
        child_voice="It's careless to say 'always' or 'everybody' when the real truth is 'most', 'some', or 'just a few'.",
        pdf_page=91,
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        socratic_spark="Is that true of ALL of them without a single exception, or is it more accurate to say 'most' or 'some'?",
        rhythm_tactile_mechanic="10-Stone Ten-Frame Quantifier Check: Physically count how many stones match ('All 10', 'Most', 'Some', 'None').",
        elof_naeyc_alignment="ELOF P-MATH 4 (Quantity Comparison) | CCSS.MATH K.CC.C.6",
    ),
    CriticalThinkingStrategy(
        code="S-15",
        category="Cognitive Macro-Ability",
        formal_name="Developing Criteria for Evaluation: Clarifying Values and Standards",
        child_voice="Before we call something 'best' or 'helpful', we figure out what clear measuring rules we are using and why.",
        pdf_page=96,
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        socratic_spark="What does a bridge (or sorting rule) NEED to do well to count as a strong one—and how shall we measure it?",
        rhythm_tactile_mechanic="3-Star Yardstick Check: Children co-create 3 tactile test rules (e.g., holds 5 blocks, stands 10 beats, uses 4 pieces).",
        elof_naeyc_alignment="ELOF P-MATH 8 (Measurement Attributes) | CCSS.MATH K.MD.A.2",
    ),
    CriticalThinkingStrategy(
        code="S-29",
        category="Cognitive Micro-Skill",
        formal_name="Noting Significant Similarities and Differences",
        child_voice="I look past surface colors to spot the deep ways two patterns, shapes, or living things are alike and different.",
        pdf_page=111,
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        socratic_spark="How are these two shapes alike in a way that matters for rolling or stacking—and how are they different?",
        rhythm_tactile_mechanic="Two-Hoop Venn Floor Sort with geometric blocks, natural leaves, and rhythmic beat patterns.",
        elof_naeyc_alignment="ELOF P-MATH 9 (Shape Attributes) | CCSS.MATH K.G.B.4",
    ),
    CriticalThinkingStrategy(
        code="S-31",
        category="Cognitive Micro-Skill",
        formal_name="Distinguishing Relevant from Irrelevant Facts",
        child_voice="A fact can be 100% true and still be a distraction! I keep only the clues that help solve the real problem.",
        pdf_page=113,
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        socratic_spark="Kwame brought 6 red apples, 2 yellow hats, and 3 green apples—which number is true but NOT needed to count our fruit?",
        rhythm_tactile_mechanic="Clue Basket vs. Distraction Basket: Physically set aside decoy counters during acoustic story problems.",
        elof_naeyc_alignment="ELOF P-MATH 6 (Problem Solving) | CCSS.MATH K.OA.A.2",
    ),
    CriticalThinkingStrategy(
        code="S-34",
        category="Cognitive Micro-Skill",
        formal_name="Recognizing Contradictions",
        child_voice="Two opposite claims can't both be true in the exact same way at the exact same time—when beats clash, we check!",
        pdf_page=115,
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        socratic_spark="Wait—can this box have 4 corners and 0 corners at the exact same time? Where did those two claims clash?",
        rhythm_tactile_mechanic="Polyrhythm Clash Detector: Tap smooth harmony for consistent clues, cross wrists in an 'X' when two claims contradict.",
        elof_naeyc_alignment="ELOF P-ATL 3 (Cognitive Flexibility) | NAEYC 2.F.03",
    ),

    # --- LAND 4: LUMINOSITY (Athena & Ezra) — Deep Socratic Inquiry, Credibility, Solutions & Civic Rules ---
    CriticalThinkingStrategy(
        code="S-16",
        category="Cognitive Macro-Ability",
        formal_name="Evaluating the Credibility of Sources of Information",
        child_voice="Not every voice or commercial knows the truth—we ask 'Were they really there?' and 'Are they trying to sell us something?'",
        pdf_page=97,
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        socratic_spark="Who would know more about what our garden plant needs—a toy commercial or someone who watered it all week? Why?",
        rhythm_tactile_mechanic="Lantern Light Inspection: Shine a paper 'Lantern of Truth' on firsthand observer clues vs. hearsay rumors.",
        elof_naeyc_alignment="ELOF P-SCI 2 (Evaluating Information) | NAEYC 2.L.06",
    ),
    CriticalThinkingStrategy(
        code="S-17",
        category="Cognitive Macro-Ability",
        formal_name="Questioning Deeply: Raising and Pursuing Root or Significant Questions",
        child_voice="Simple-sounding things like 'rules', 'work', or 'home' hide deep wonder-questions underneath!",
        pdf_page=98,
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        socratic_spark="Why do human communities have rules at all—what would happen to our classroom today if every rule vanished?",
        rhythm_tactile_mechanic="Wonder-Tree Question Leaves: Children dictate 'Why?' and 'How?' questions onto paper leaves hung on a branch.",
        elof_naeyc_alignment="ELOF P-SCI 4 (Deep Questioning) | CCSS.ELA SL.K.3",
    ),
    CriticalThinkingStrategy(
        code="S-19",
        category="Cognitive Macro-Ability",
        formal_name="Generating or Assessing Solutions",
        child_voice="Instead of grabbing the first idea, we invent several ways to solve a problem and test which works fairest for all.",
        pdf_page=100,
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        socratic_spark="We have one drum and three drummers—can our circle invent three different fair ways to solve this before choosing one?",
        rhythm_tactile_mechanic="Three-Path Floor Yarn Layout: Act out Solution Path 1, Path 2, and Path 3 physically before voting.",
        elof_naeyc_alignment="ELOF P-SE 4 (Social Problem-Solving) | NAEYC 2.B.05",
    ),
    CriticalThinkingStrategy(
        code="S-20",
        category="Cognitive Macro-Ability",
        formal_name="Analyzing or Evaluating Actions and Policies",
        child_voice="We look at WHY someone acted and WHAT happened next to judge fairly whether an action or rule is wise.",
        pdf_page=102,
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        socratic_spark="Why did Goldilocks (or our story hero) make that choice, what happened because of it, and what wiser choice existed?",
        rhythm_tactile_mechanic="Action-Ripple Role-Play: Replay a classroom or storybook scene twice—first impulsive, second thoughtful.",
        elof_naeyc_alignment="ELOF P-SE 5 (Evaluating Behavior & Rules) | NAEYC 2.L.02",
    ),
    CriticalThinkingStrategy(
        code="S-24",
        category="Cognitive Macro-Ability",
        formal_name="Practicing Socratic Discussion: Clarifying and Questioning Beliefs, Theories, or Perspectives",
        child_voice="Asking thoughtful questions in a circle helps every friend discover deeper truth together.",
        pdf_page=106,
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        socratic_spark="What kind of question should we ask our friend next—a 'What do you mean?' question or a 'How do you know?' question?",
        rhythm_tactile_mechanic="Socratic Talking Drum Circle: 4-beat gentle pulse between turns guarantees 3–5 seconds of quiet thinking wait-time.",
        elof_naeyc_alignment="ELOF P-LC 3 (Collaborative Inquiry) | CCSS.ELA SL.1.1",
    ),

    # --- LAND 6: TERRASOL (Vesta & Silas) — Humility, Assumptions, Inferences, Evidence & Scientific Testing ---
    CriticalThinkingStrategy(
        code="S-5",
        category="Affective",
        formal_name="Developing Intellectual Humility and Suspending Judgment",
        child_voice="I am proud to say 'I don't know yet—let's investigate!' instead of pretending to know by guessing.",
        pdf_page=84,
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        socratic_spark="Do we REALLY know what is inside this seed pod yet, or should we put it in our 'Wait-and-Test' basket first?",
        rhythm_tactile_mechanic="Three Mystery Pouches ('Know for Sure', 'Clue-Based Guess', 'Don't Know Yet—Let's Test!').",
        elof_naeyc_alignment="ELOF P-SCI 1 (Scientific Humility & Observation) | NAEYC 2.G.01",
    ),
    CriticalThinkingStrategy(
        code="S-18",
        category="Cognitive Macro-Ability",
        formal_name="Analyzing or Evaluating Arguments, Interpretations, Beliefs, or Theories",
        child_voice="Every explanation rests on reasons—we check if the reasons really hold up like strong tree roots!",
        pdf_page=99,
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        socratic_spark="Our friend predicts the heavy stone will sink because it is dark—how could we test if color or weight is the real reason?",
        rhythm_tactile_mechanic="Root-and-Branch Mat: Place the 'Claim Leaf' at top and physical 'Reason Stones' at the roots to test stability.",
        elof_naeyc_alignment="ELOF P-SCI 5 (Hypothesis Evaluation) | NGSS K-PS2",
    ),
    CriticalThinkingStrategy(
        code="S-30",
        category="Cognitive Micro-Skill",
        formal_name="Examining or Evaluating Assumptions",
        child_voice="Sometimes we take hidden beliefs for granted—like assuming every tiny thing is light or every bug bites!",
        pdf_page=112,
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        socratic_spark="When we guessed the big pinecone would fall faster than the tiny pebble, what hidden assumption tricked us?",
        rhythm_tactile_mechanic="Side-by-Side Sensory Drop & Water Test revealing surprising counter-examples to hidden assumptions.",
        elof_naeyc_alignment="ELOF P-SCI 4 (Testing Predictions) | NAEYC 2.G.04",
    ),
    CriticalThinkingStrategy(
        code="S-32",
        category="Cognitive Micro-Skill",
        formal_name="Making Plausible Inferences, Predictions, or Interpretations",
        child_voice="From wet soil and bent grass, I can make a careful inference about rain—while checking if a hose was used instead!",
        pdf_page=114,
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        socratic_spark="Look at the wet outside of this icy cup—what two different explanations could account for that water, and how do we test them?",
        rhythm_tactile_mechanic="Nature Tracker Clue Walk: Distinguish 'What My Senses Observe' (1 stomp) from 'What My Mind Infers' (2 claps).",
        elof_naeyc_alignment="ELOF P-SCI 3 (Inference & Prediction) | CCSS.ELA RL.1.1",
    ),
    CriticalThinkingStrategy(
        code="S-33",
        category="Cognitive Micro-Skill",
        formal_name="Giving Reasons and Evaluating Evidence and Alleged Facts",
        child_voice="Like nature detectives, we gather real sensory evidence before deciding whether a claim is true.",
        pdf_page=115,
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        socratic_spark="What sensory evidence—from your fingers, eyes, or two-pot plant experiment—supports your conclusion?",
        rhythm_tactile_mechanic="Two-Pot Controlled Seed Ritual (Pot A: water + sun; Pot B: dry/dark) with daily tactile observation logs.",
        elof_naeyc_alignment="ELOF P-SCI 6 (Evidence-Based Conclusions) | NGSS K-LS1-1",
    ),

    # --- LAND 7: CELESTIA (Elias & Selene) — Analogies, Perspective Over Time, Clarity, Cross-Land Synthesis & Consequences ---
    CriticalThinkingStrategy(
        code="S-11",
        category="Cognitive Macro-Ability",
        formal_name="Comparing Analogous Situations: Transferring Insights to New Contexts",
        child_voice="Wisdom learned in one place shines like a guiding star in brand-new places—caring for a plant is like caring for a friendship!",
        pdf_page=92,
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        socratic_spark="How is practicing a tricky rhythm pattern on our knees just like learning to ride a scooter or read a hard word?",
        rhythm_tactile_mechanic="Constellation Yarn Bridge: Stretch golden yarn on the rug connecting two analogous Picture Dictionary scenes.",
        elof_naeyc_alignment="ELOF P-ATL 5 (Transferring Prior Learning) | NAEYC 2.F.03",
    ),
    CriticalThinkingStrategy(
        code="S-12",
        category="Cognitive Macro-Ability",
        formal_name="Developing One's Perspective: Creating or Exploring Beliefs, Arguments, or Theories",
        child_voice="Growing wise takes seasons—as I listen, test, and wonder across days and months, my own understanding grows deeper.",
        pdf_page=93,
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        socratic_spark="What did you use to think about the dark sky (or storms) when you were younger, and how do you see it now?",
        rhythm_tactile_mechanic="Yesterday–Today–Tomorrow Sun Wheel reflection connecting past ideas to new discoveries.",
        elof_naeyc_alignment="ELOF P-SE 9 (Developing Perspective) | NAEYC 2.L.03",
    ),
    CriticalThinkingStrategy(
        code="S-13",
        category="Cognitive Macro-Ability",
        formal_name="Clarifying Issues, Conclusions, or Beliefs",
        child_voice="Before rushing to answer, we slow down like twilight stars to state the exact question clearly and fairly.",
        pdf_page=94,
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        socratic_spark="Wait—before we vote or decide, can we state the exact problem in the clearest, fairest words possible?",
        rhythm_tactile_mechanic="60 BPM Largo 'Slow-Down Bell' + Reframing Circle ('First draft of the problem -> Clearer star-bright question').",
        elof_naeyc_alignment="ELOF P-LC 2 (Clarifying Meaning) | CCSS.ELA SL.2.1",
    ),
    CriticalThinkingStrategy(
        code="S-23",
        category="Cognitive Macro-Ability",
        formal_name="Making Interdisciplinary Connections",
        child_voice="Music, numbers, plants, movement, feelings, and sky cycles aren't separate boxes—they all weave one living world!",
        pdf_page=105,
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        socratic_spark="How do Numeria's numbers, Terrasol's rain, and Harmonia's songs all work together inside the four seasons?",
        rhythm_tactile_mechanic="7-Land Quest Map Weaving: Friday Celestia Celebration linking the week's phonics, math, science, and movement clues.",
        elof_naeyc_alignment="ELOF P-SCI 4 & P-MATH 7 (Cross-Domain Synthesis) | NAEYC 2.A.08",
    ),
    CriticalThinkingStrategy(
        code="S-35",
        category="Cognitive Micro-Skill",
        formal_name="Exploring Implications and Consequences",
        child_voice="Every choice and natural event sends out a 'what-happens-next' chain across time—we look ahead before we leap!",
        pdf_page=116,
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        socratic_spark="If the Sun moved much closer—or if everyone forgot to take turns—what chain of consequences would follow next?",
        rhythm_tactile_mechanic="4-Tile Chronos Cause-and-Effect Chain ('First -> Then -> Next -> Therefore') walked and chanted on the rug.",
        elof_naeyc_alignment="ELOF P-SCI 4 (Cause & Effect Over Time) | CCSS.ELA RL.K.2",
    ),
]


SUPPLEMENTAL_DIMENSIONS: List[Dict[str, str]] = [
    {
        "code": "D-1",
        "category": "Affective (Dalzell Supplement, PDF p. 77)",
        "formal_name": "Developing Intellectual Curiosity",
        "guardian": "Seriphia",
        "soe_integration": "Awakening natural sensory wonder ('Why did that rhythm echo?') before any formal instruction begins.",
    },
    {
        "code": "D-2",
        "category": "Affective (Dalzell Supplement, PDF p. 77)",
        "formal_name": "Developing Social Sensitivity",
        "guardian": "Seriphia",
        "soe_integration": "Knowing WHEN and HOW gently to ask a critical question so friends feel safe, respected, and uplifted.",
    },
    {
        "code": "D-3",
        "category": "Cognitive Macro-Ability (Dalzell Supplement, PDF p. 77)",
        "formal_name": "Observing Critically",
        "guardian": "Seriphia",
        "soe_integration": "Training eyes, ears, and fingertips to truly SEE and HEAR fine details in Picture Dictionary scenes and acoustic tracks.",
    },
    {
        "code": "D-4",
        "category": "Cognitive Macro-Ability (Dalzell Supplement, PDF p. 77)",
        "formal_name": "Expressing Precisely",
        "guardian": "Seriphia",
        "soe_integration": "Pairing rhythmic vocal articulation with exact vocabulary so young learners voice clear thoughts without frustration.",
    },
]


# Complete 70-unit Remodelled Lesson Catalog from the textbook mapped to SOE Ages 2–7 Canon
REMODELLED_LESSON_CATALOG: List[RemodelledUnitMap] = [
    # Language Arts (Units 1–23)
    RemodelledUnitMap(unit_id=1, source_title="Evaluative Thinking", source_domain="Language Arts", pdf_page=128, strategies=["S-20", "S-4", "S-15"], soe_land_id="luminosity", soe_track_slug="manners", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Role-play picture scenes with puppets, probing feelings behind actions and co-creating kindness criteria."),
    RemodelledUnitMap(unit_id=2, source_title="Listening Ears", source_domain="Language Arts", pdf_page=130, strategies=["S-22", "S-3", "S-7", "S-2"], soe_land_id="harmonia", soe_track_slug="alphabet-song-remix", soe_age_tier="Sprouts (Ages 2–4)", soe_remodel_summary="Acoustic silent-dialogue game: echo a friend's sound/story accurately before taking the rhythm stick."),
    RemodelledUnitMap(unit_id=3, source_title="Corduroy", source_domain="Language Arts", pdf_page=132, strategies=["S-25", "S-19", "S-15"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Dialogical role-play comparing the parent's budget perspective and child's wish, inventing fair solutions."),
    RemodelledUnitMap(unit_id=4, source_title="The Gingerbread Man", source_domain="Language Arts", pdf_page=134, strategies=["S-14", "S-18", "S-35"], soe_land_id="harmonia", soe_track_slug="drill-time", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Clarify 'trust' vs. 'trickery' and trace the consequence chain of trusting the fox's unverified claim."),
    RemodelledUnitMap(unit_id=5, source_title="Goldilocks and the Three Bears I", source_domain="Language Arts", pdf_page=136, strategies=["S-24", "S-4"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Sprouts (Ages 2–4)", soe_remodel_summary="Socratic circle exploring Baby Bear's feelings and Goldilocks's unspoken assumptions before entering."),
    RemodelledUnitMap(unit_id=6, source_title="Goldilocks II", source_domain="Language Arts", pdf_page=138, strategies=["S-3", "S-20", "S-29"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Fairminded perspective swap comparing bear family boundaries with classroom shared-space rules."),
    RemodelledUnitMap(unit_id=7, source_title="A Toy for Mike", source_domain="Language Arts", pdf_page=140, strategies=["S-19", "S-13", "S-31"], soe_land_id="luminosity", soe_track_slug="numbers", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Clarify gift-sharing problem, separate relevant clues from distractions, and test 3 gift solutions."),
    RemodelledUnitMap(unit_id=8, source_title="Moving Day", source_domain="Language Arts", pdf_page=142, strategies=["S-4", "S-30", "S-3", "S-24"], soe_land_id="aquaria", soe_track_slug="changes", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Examine scary assumptions about new places and reframe thoughts underlying transition anxiety."),
    RemodelledUnitMap(unit_id=9, source_title="Susan, Tom, & Betty", source_domain="Language Arts", pdf_page=144, strategies=["S-24", "S-33", "S-5"], soe_land_id="luminosity", soe_track_slug="hard-words", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Sort story questions into Fact Clues, Reasoned Inferences, and Pure Guesses ('I don't know yet')."),
    RemodelledUnitMap(unit_id=10, source_title="Help for the Hen", source_domain="Language Arts", pdf_page=147, strategies=["S-24", "S-28", "S-23"], soe_land_id="terrasol", soe_track_slug="horses-interlude", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Cooperative responsibility inquiry connecting farm work rhythms with fair sharing of harvest rewards."),
    RemodelledUnitMap(unit_id=11, source_title="Messages Without Words", source_domain="Language Arts", pdf_page=148, strategies=["S-21", "S-35", "S-24"], soe_land_id="harmonia", soe_track_slug="my-body", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Decode somatic gestures, facial cues, and ASL sign descriptions while checking mistaken inferences."),
    RemodelledUnitMap(unit_id=12, source_title="Sentences That Ask", source_domain="Language Arts", pdf_page=150, strategies=["S-31", "S-32", "S-3"], soe_land_id="harmonia", soe_track_slug="time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Craft genuine curiosity questions with rising vocal melody rather than mechanical punctuation drills."),
    RemodelledUnitMap(unit_id=13, source_title="Two Ways to Win", source_domain="Language Arts", pdf_page=152, strategies=["S-18", "S-33", "S-14"], soe_land_id="vitalis", soe_track_slug="drill-time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Redefine 'winning' by contrasting beating others vs. personal mastery and collaborative joy."),
    RemodelledUnitMap(unit_id=14, source_title="Marvin's Manhole", source_domain="Language Arts", pdf_page=154, strategies=["S-18", "S-28", "S-33"], soe_land_id="terrasol", soe_track_slug="hard-words", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Weigh evidence for competing explanations of an unseen underground mystery using 'infer' and 'assume'."),
    RemodelledUnitMap(unit_id=15, source_title="The Camel and the Jackal", source_domain="Language Arts", pdf_page=156, strategies=["S-20", "S-19", "S-1", "S-15"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Interrupt fable mid-story to evaluate retaliation vs. constructive boundary-setting in friendships."),
    RemodelledUnitMap(unit_id=16, source_title="Friends", source_domain="Language Arts", pdf_page=158, strategies=["S-19", "S-1", "S-15", "S-23"], soe_land_id="harmonia", soe_track_slug="manners", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Build concrete friendship standards from lived kindness moments rather than reciting textbook slogans."),
    RemodelledUnitMap(unit_id=17, source_title="The Horse Was in the Parlor", source_domain="Language Arts", pdf_page=160, strategies=["S-17", "S-30", "S-34", "S-33"], soe_land_id="luminosity", soe_track_slug="le-cheval", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Uncover contradictions and appearances-over-kindness assumptions in a humorous equine story."),
    RemodelledUnitMap(unit_id=18, source_title="Aha! A Sleuth!", source_domain="Language Arts", pdf_page=162, strategies=["S-14", "S-17", "S-11"], soe_land_id="luminosity", soe_track_slug="hard-words", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Transfer tactile sleuth detective habits (clue-gathering, patience) to decoding unfamiliar multi-syllable words."),
    RemodelledUnitMap(unit_id=19, source_title="Poor Little Puppy", source_domain="Language Arts", pdf_page=164, strategies=["S-4", "S-30", "S-15"], soe_land_id="aquaria", soe_track_slug="horses-interlude", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Explore pride, embarrassment, and caring responsibility for animals through somatic check-ins."),
    RemodelledUnitMap(unit_id=20, source_title="Kate and the Big Cat", source_domain="Language Arts", pdf_page=166, strategies=["S-21", "S-32", "S-14", "S-3", "S-31"], soe_land_id="terrasol", soe_track_slug="horses-interlude", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Clarify what 'fair care' means for wild vs. domestic creatures using relevant habitat clues."),
    RemodelledUnitMap(unit_id=21, source_title="Adjectives", source_domain="Language Arts", pdf_page=168, strategies=["S-17", "S-1", "S-29"], soe_land_id="harmonia", soe_track_slug="alphabet-song-remix", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Tactile sensory attribute web (rough, cool, resonant, crisp) comparing real fruits and stones."),
    RemodelledUnitMap(unit_id=22, source_title="Listening Game", source_domain="Language Arts", pdf_page=170, strategies=["S-22", "S-35", "S-9", "S-16"], soe_land_id="harmonia", soe_track_slug="drill-time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Acoustic whisper-chain game revealing how unverified messages distort and why firsthand checking matters."),
    RemodelledUnitMap(unit_id=23, source_title="Any Old Junk Today?", source_domain="Language Arts", pdf_page=173, strategies=["S-25", "S-3", "S-1", "S-35", "S-14"], soe_land_id="terrasol", soe_track_slug="changes", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Dialogical debate comparing 'worthless clutter' vs. 'reusable treasure' with real household items."),

    # Social Studies (Units 24–49)
    RemodelledUnitMap(unit_id=24, source_title="Do Communities Change?", source_domain="Social Studies", pdf_page=182, strategies=["S-20", "S-15", "S-13", "S-35"], soe_land_id="celestia", soe_track_slug="changes", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Evaluate neighborhood changes (new road vs. green park) by tracing helpful and harmful consequences."),
    RemodelledUnitMap(unit_id=25, source_title="How Is My School Like My Home?", source_domain="Social Studies", pdf_page=184, strategies=["S-5", "S-33", "S-9"], soe_land_id="luminosity", soe_track_slug="manners", soe_age_tier="Sprouts (Ages 2–4)", soe_remodel_summary="Suspend quick guesses on ambiguous Picture Dictionary scenes where home and school overlap."),
    RemodelledUnitMap(unit_id=26, source_title="Tools (Remodel I — Independent Categorization)", source_domain="Social Studies", pdf_page=186, strategies=["S-1", "S-14"], soe_land_id="numeria", soe_track_slug="shapes", soe_age_tier="Sprouts (Ages 2–4)", soe_remodel_summary="Children invent their own sorting categories for safe kitchen/classroom tools instead of copying adult labels."),
    RemodelledUnitMap(unit_id=27, source_title="Tools (Remodel II — Iterative Fulton Workshop)", source_domain="Social Studies", pdf_page=187, strategies=["S-1", "S-14", "S-9"], soe_land_id="numeria", soe_track_slug="shapes", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Hands-on problem-to-tool matching ('How could we move water without cups?') to discover function."),
    RemodelledUnitMap(unit_id=28, source_title="Why Did the Girl Say 'No'?", source_domain="Social Studies", pdf_page=189, strategies=["S-32", "S-28", "S-4"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Infer personal values from choices while practicing courteous, autonomous 'No, thank you' boundaries."),
    RemodelledUnitMap(unit_id=29, source_title="Martin Luther King, Jr.'s Birthday", source_domain="Social Studies", pdf_page=191, strategies=["S-30", "S-21", "S-27", "S-7"], soe_land_id="luminosity", soe_track_slug="manners", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Contrast fairness ideals with unfair exclusions and practice everyday courage in circle play."),
    RemodelledUnitMap(unit_id=30, source_title="Our Country's Birthday", source_domain="Social Studies", pdf_page=193, strategies=["S-21", "S-14", "S-7"], soe_land_id="luminosity", soe_track_slug="sunny-day", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Clarify 'freedom to help and learn' vs. 'doing anything without caring for others'."),
    RemodelledUnitMap(unit_id=31, source_title="Rules", source_domain="Social Studies", pdf_page=195, strategies=["S-17", "S-29", "S-20"], soe_land_id="luminosity", soe_track_slug="drill-time", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Compare game rules, safety rules, and fairness rules—testing what makes a rule helpful vs. unfair."),
    RemodelledUnitMap(unit_id=32, source_title="About Families & Needs and Wants", source_domain="Social Studies", pdf_page=197, strategies=["S-24", "S-12", "S-2"], soe_land_id="terrasol", soe_track_slug="my-body", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Sort essential life needs (water, nourishing food, love, rest) from passing wants using tactile cards."),
    RemodelledUnitMap(unit_id=33, source_title="Emotions: Anger", source_domain="Social Studies", pdf_page=199, strategies=["S-4", "S-28", "S-5"], soe_land_id="aquaria", soe_track_slug="lets-stretch", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Pair parasympathetic breathing with examining hidden assumptions ('Did they bump me on purpose or by accident?')."),
    RemodelledUnitMap(unit_id=34, source_title="The Pledge of Allegiance", source_domain="Social Studies", pdf_page=201, strategies=["S-14", "S-32", "S-27"], soe_land_id="luminosity", soe_track_slug="hard-words", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Unpack big civic words ('promise', 'indivisible', 'justice for all') through concrete classroom promises."),
    RemodelledUnitMap(unit_id=35, source_title="Sue's Mistake", source_domain="Social Studies", pdf_page=204, strategies=["S-5", "S-14", "S-7"], soe_land_id="vitalis", soe_track_slug="manners", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Distinguish genuine behavioral repair ('learning from a mistake') from empty 'I'm sorry' verbal habits."),
    RemodelledUnitMap(unit_id=36, source_title="Schools in India", source_domain="Social Studies", pdf_page=206, strategies=["S-14", "S-31", "S-2"], soe_land_id="luminosity", soe_track_slug="le-cheval", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Separate what is essential to learning (curious minds, mentor, rhythm) from buildings or desks across cultures."),
    RemodelledUnitMap(unit_id=37, source_title="At the Television Studio", source_domain="Social Studies", pdf_page=208, strategies=["S-16", "S-35", "S-22", "S-31"], soe_land_id="luminosity", soe_track_slug="hard-words", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Screen-stewardship literacy: spot persuasion tricks in toy/snack ads vs. real nourishment and play value."),
    RemodelledUnitMap(unit_id=38, source_title="We Need Rules", source_domain="Social Studies", pdf_page=211, strategies=["S-20", "S-11", "S-6", "S-12"], soe_land_id="luminosity", soe_track_slug="drill-time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Co-author classroom sanctuary agreements and practice courteous courage when rules need improving."),
    RemodelledUnitMap(unit_id=39, source_title="Looking to the Future", source_domain="Social Studies", pdf_page=213, strategies=["S-21", "S-14", "S-35", "S-16"], soe_land_id="celestia", soe_track_slug="time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Envision neighborhood improvements and trace practical steps needed to care for shared spaces."),
    RemodelledUnitMap(unit_id=40, source_title="Does Earth Move?", source_domain="Social Studies", pdf_page=215, strategies=["S-6", "S-4", "S-7", "S-20"], soe_land_id="celestia", soe_track_slug="days-of-the-week", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Embody Earth's spin for day/night while celebrating intellectual courage when evidence challenges old habits."),
    RemodelledUnitMap(unit_id=41, source_title="An Oil-Drilling Community", source_domain="Social Studies", pdf_page=217, strategies=["S-3", "S-21", "S-11", "S-12"], soe_land_id="terrasol", soe_track_slug="the-ocean", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Weigh energy needs alongside ocean and wildlife stewardship from multiple community perspectives."),
    RemodelledUnitMap(unit_id=42, source_title="Farms Yesterday and Today", source_domain="Social Studies", pdf_page=219, strategies=["S-17", "S-33", "S-13"], soe_land_id="terrasol", soe_track_slug="horses-interlude", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Compare hand-tended soil care and modern machinery across past and present food journeys."),
    RemodelledUnitMap(unit_id=43, source_title="City Park", source_domain="Social Studies", pdf_page=221, strategies=["S-1", "S-3", "S-33", "S-20"], soe_land_id="numeria", soe_track_slug="shapes", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Design a miniature tactile floor park balancing toddlers', elders', trees', and athletes' needs fairly."),
    RemodelledUnitMap(unit_id=44, source_title="The Health Department", source_domain="Social Studies", pdf_page=223, strategies=["S-17", "S-2", "S-25"], soe_land_id="vitalis", soe_track_slug="my-body", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Connect clean water, handwashing, and community helpers to shared responsibility for public health."),
    RemodelledUnitMap(unit_id=45, source_title="Starting from Scratch", source_domain="Social Studies", pdf_page=226, strategies=["S-17", "S-19", "S-2"], soe_land_id="luminosity", soe_track_slug="after-the-storm", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Island sanctuary simulation: decide first essentials (shelter, water, cooperation) and fair leadership traits."),
    RemodelledUnitMap(unit_id=46, source_title="City Government in East Bend", source_domain="Social Studies", pdf_page=229, strategies=["S-14", "S-10", "S-31", "S-16", "S-27"], soe_land_id="luminosity", soe_track_slug="manners", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Contrast fair classroom helper choices (skill & kindness) vs. favoritism ('picking only best friends')."),
    RemodelledUnitMap(unit_id=47, source_title="Knighthood", source_domain="Social Studies", pdf_page=232, strategies=["S-8", "S-17", "S-22"], soe_land_id="vitalis", soe_track_slug="drill-time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Explore loyalty, years of disciplined practice, and when true honor means protecting the vulnerable."),
    RemodelledUnitMap(unit_id=48, source_title="Problem Solving", source_domain="Social Studies", pdf_page=235, strategies=["S-19", "S-13", "S-5", "S-29"], soe_land_id="aquaria", soe_track_slug="manners", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="3-Step Sanctuary Conflict Protocol: (1) State problem clearly, (2) Brainstorm solutions, (3) Test fairness."),
    RemodelledUnitMap(unit_id=49, source_title="An American City with a Problem", source_domain="Social Studies", pdf_page=239, strategies=["S-26", "S-18", "S-30"], soe_land_id="aquaria", soe_track_slug="rain", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Dialectical town-hall circle weighing river cleanliness alongside community jobs to invent win-win care."),

    # Science (Units 50–67)
    RemodelledUnitMap(unit_id=50, source_title="Linear Measurement", source_domain="Science", pdf_page=248, strategies=["S-9", "S-17", "S-1"], soe_land_id="numeria", soe_track_slug="numbers", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Measure rugs with kids' feet vs. blocks to discover firsthand why standard equal units matter!"),
    RemodelledUnitMap(unit_id=51, source_title="Are Seeds Living Things?", source_domain="Science", pdf_page=250, strategies=["S-1", "S-24"], soe_land_id="terrasol", soe_track_slug="sunny-day", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Two-pot controlled planting test (pebbles vs. beans; light/water vs. dark/dry) driven by child predictions."),
    RemodelledUnitMap(unit_id=52, source_title="Making Things Move", source_domain="Science", pdf_page=252, strategies=["S-1", "S-29", "S-9", "S-23"], soe_land_id="vitalis", soe_track_slug="lets-stretch", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Compare wind breath, hand push, gravity ramp, and body food-energy to build an intuitive concept of energy."),
    RemodelledUnitMap(unit_id=53, source_title="Weather Changes with the Seasons", source_domain="Science", pdf_page=254, strategies=["S-24", "S-1", "S-15"], soe_land_id="celestia", soe_track_slug="months-of-the-year", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Socratic visual clue hunt across seasonal clothing, trees, and local vs. distant regional weather."),
    RemodelledUnitMap(unit_id=54, source_title="Using Your Senses", source_domain="Science", pdf_page=256, strategies=["S-12", "S-33", "S-10"], soe_land_id="terrasol", soe_track_slug="my-body", soe_age_tier="Sprouts (Ages 2–4)", soe_remodel_summary="Multi-sensory mystery box showing how touch, hearing, and smell work together when eyes are closed."),
    RemodelledUnitMap(unit_id=55, source_title="Pets", source_domain="Science", pdf_page=258, strategies=["S-1", "S-7", "S-18", "S-23"], soe_land_id="terrasol", soe_track_slug="horses-interlude", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Evaluate daily care responsibilities and habitat needs to judge which animals belong in homes vs. nature."),
    RemodelledUnitMap(unit_id=56, source_title="Water from the Air", source_domain="Science", pdf_page=260, strategies=["S-1", "S-32", "S-35"], soe_land_id="terrasol", soe_track_slug="rain", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Food-colored ice-water glass test proving condensation droplets come from surrounding air, not glass leaks!"),
    RemodelledUnitMap(unit_id=57, source_title="Magnets", source_domain="Science", pdf_page=262, strategies=["S-9", "S-1", "S-24", "S-32"], soe_land_id="terrasol", soe_track_slug="shapes", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Open magnet exploration refuting 'all shiny metals stick' by testing coins, foil, wood, and iron clips."),
    RemodelledUnitMap(unit_id=58, source_title="Plant and Animal Products in Food", source_domain="Science", pdf_page=264, strategies=["S-3", "S-15", "S-26"], soe_land_id="vitalis", soe_track_slug="my-body", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Develop clear nourishment criteria ('living whole foods' vs. ultra-processed snacks) for strong bodies."),
    RemodelledUnitMap(unit_id=59, source_title="What the Scientist Does", source_domain="Science", pdf_page=266, strategies=["S-14", "S-1", "S-17", "S-13"], soe_land_id="terrasol", soe_track_slug="changes", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Demystify 'scientist' as anyone who wonders deeply, observes carefully, and tests ideas honestly."),
    RemodelledUnitMap(unit_id=60, source_title="Rocks of the Earth", source_domain="Science", pdf_page=268, strategies=["S-8", "S-1", "S-13", "S-29"], soe_land_id="terrasol", soe_track_slug="sunny-day", soe_age_tier="Pathfinders (Ages 4–5)", soe_remodel_summary="Child-generated rock questions sorted by scratch, weight, layers, and sparkle before naming categories."),
    RemodelledUnitMap(unit_id=61, source_title="Comparing Man to Animals", source_domain="Science", pdf_page=270, strategies=["S-29", "S-33", "S-9"], soe_land_id="terrasol", soe_track_slug="le-cheval", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Compare human eyes/ears/hands with equine 350-degree vision and bat acoustic echolocation."),
    RemodelledUnitMap(unit_id=62, source_title="The Sun", source_domain="Science", pdf_page=272, strategies=["S-9", "S-1", "S-35", "S-8"], soe_land_id="celestia", soe_track_slug="sunny-day", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Trace consequence chains if Earth were closer or farther from the Sun across oceans, plants, and warmth."),
    RemodelledUnitMap(unit_id=63, source_title="What Will Decompose?", source_domain="Science", pdf_page=274, strategies=["S-12", "S-35"], soe_land_id="terrasol", soe_track_slug="after-the-storm", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Soil-jar burial test comparing apple core, leaf, paper, and plastic to ground ecological stewardship."),
    RemodelledUnitMap(unit_id=64, source_title="Parts of a Wave", source_domain="Science", pdf_page=276, strategies=["S-14", "S-29", "S-17"], soe_land_id="aquaria", soe_track_slug="the-ocean", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Jump-rope and water-pan wave crests/troughs linking ocean waves with Harmonia's acoustic soundwaves!"),
    RemodelledUnitMap(unit_id=65, source_title="At Work on the Earth", source_domain="Science", pdf_page=278, strategies=["S-14", "S-29", "S-17"], soe_land_id="vitalis", soe_track_slug="drill-time", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Contrast everyday 'hard work' (holding a heavy wall-push) vs. physics 'work' (moving an object across space)."),
    RemodelledUnitMap(unit_id=66, source_title="A Living System", source_domain="Science", pdf_page=280, strategies=["S-9", "S-1", "S-32"], soe_land_id="terrasol", soe_track_slug="rain", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Hypothesize and test how water, freezing ice, wind, and roots slowly turn solid rock into living soil."),
    RemodelledUnitMap(unit_id=67, source_title="Two Concepts of 'Soil'", source_domain="Science", pdf_page=282, strategies=["S-14", "S-29", "S-17"], soe_land_id="terrasol", soe_track_slug="sunny-day", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Contrast sweeping 'floor dirt' out of the house vs. treasuring 'living garden soil' teeming with roots."),

    # Mathematics (Units 68–69)
    RemodelledUnitMap(unit_id=68, source_title="Bar Graph", source_domain="Mathematics", pdf_page=286, strategies=["S-9", "S-1", "S-15", "S-17"], soe_land_id="numeria", soe_track_slug="one-hundred", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Build live shoe/fruit block-tower graphs and ask when and why the graph would change tomorrow."),
    RemodelledUnitMap(unit_id=69, source_title="Word Problems", source_domain="Mathematics", pdf_page=288, strategies=["S-31", "S-1"], soe_land_id="numeria", soe_track_slug="numbers", soe_age_tier="Wayfarers (Ages 6–7)", soe_remodel_summary="Act out stories with decoy facts and have children author their own math riddles for classmates."),

    # Holistic Thematic Unit (Unit 70)
    RemodelledUnitMap(unit_id=70, source_title="Friendship and Family Relationships (Holistic Thematic Unit)", source_domain="Holistic Thematic Unit", pdf_page=297, strategies=["S-23", "S-14", "S-3", "S-24", "S-25"], soe_land_id="celestia", soe_track_slug="after-the-storm", soe_age_tier="All Tiers (Ages 2–7)", soe_remodel_summary="Multi-week cross-Land sanctuary quest uniting family roles, world folktales, empathy, nutrition, and rhythm."),
]


SOE_SOCRATIC_QUESTS: Dict[str, SocraticQuestModule] = {
    "harmonia": SocraticQuestModule(
        quest_id="ct-harmonia-01",
        land_id="harmonia",
        land_name="Harmonia",
        hero_guides="Kenji & Aiko",
        paired_track_slug="manners",
        paired_track_title="Manners",
        strategies_activated=["S-6", "S-14", "S-21", "S-22", "S-28"],
        didactic_trap_replaced="Passive 'Listen & Repeat' courtesy drills where children recite polite words mechanically without listening to each other.",
        quest_mission="Join Kenji and Aiko in the Echoing Tea Gardens of Harmonia to master the Art of Silent Dialogue and discover the true meaning behind our words.",
        rhythm_ignition="68 BPM Warm Call-and-Response Pulse:\n"
                        "• Teacher taps two wooden spoons softly: [Tap-Tap, Pause, Tap-Tap, Pause].\n"
                        "• Chant from Track 10 ('Manners'): 'When you receive, say Thank You — Then I'll say You're Welcome!'\n"
                        "• Introduce Harmonia's Thinking Gesture: Touch ears for 'Listen', tap temple for 'Infer', open palms for 'Clarify'.",
        tactile_discovery_ritual="The Echo-Stone & Three-Basket Word Sort (7 Minutes):\n"
                                 "1. Children sit in a circle with a smooth river stone ('The Harmonia Listening Stone') and 3 baskets.\n"
                                 "2. Speaker A holds the stone and completes: 'A friend is someone who ___.'\n"
                                 "3. Before Speaker B can share their own idea, Speaker B must hold two cupped hands behind their ears and paraphrase Speaker A's idea until Speaker A smiles and nods 'Yes, you heard me!' (S-22).\n"
                                 "4. Together, sort everyday action cards (sharing a drum, grabbing a crayon, asking to play alone quietly) into 'Friendly', 'Unfriendly', or 'Hard-to-Tell—Need More Clues!' (S-14).",
        socratic_wonder_circle=[
            "Clarification (S-14): If someone says 'Thank you!' in a grumpy voice while grabbing a toy, were they really using good manners? Why or why not?",
            "Assumptions (S-28): If Aiko walks past without waving hello, what might we ASSUME—and what other innocent reason could explain it (like daydreaming about a song)?",
            "Courage (S-6): When is it brave and kind to say 'No, thank you' even to a close friend?",
        ],
        five_domain_spider={
            "language": "Pragmatic courtesy phrases paired with critical thinking vocabulary ('clarify', 'assume', 'echo').",
            "cognitive": "Concept boundary testing (separating outward verbal rituals from genuine respectful intent).",
            "physical": "Two-handed stone passing with 4-beat pause inhibition before speaking.",
            "science_sensory": "Vocal prosody acoustics—comparing how pitch and volume alter the meaning of identical words.",
            "social_emotional": "Deep empathic validation through accurate active-listening paraphrase.",
        },
        seriphia_whisper="Requiring a child to paraphrase a peer's thought before speaking activates temporoparietal perspective-taking networks while rhythmic 4-beat pauses train prefrontal impulse control.",
        institutional_standards=["ELOF P-LC 1 & P-SE 3", "NAEYC 2.C.01 & 2.L.02", "CCSS.ELA SL.K.1.A"],
    ),
    "numeria": SocraticQuestModule(
        quest_id="ct-numeria-01",
        land_id="numeria",
        land_name="Numeria",
        hero_guides="Kwame & Octavia",
        paired_track_slug="numbers",
        paired_track_title="Numbers",
        strategies_activated=["S-10", "S-15", "S-29", "S-31", "S-34"],
        didactic_trap_replaced="Mechanical 'keyword-hunting' math worksheets where children blindly add every number they hear ('75 sheep and 5 dogs, how old is the shepherd?').",
        quest_mission="Step through the Golden Gates of Numeria with Kwame and Octavia to sort true math clues from tricky distractions!",
        rhythm_ignition="92 BPM Detective Clapping Cadence (Track 8 'Numbers'):\n"
                        "• Clap-pat 1-to-10 in crisp unison.\n"
                        "• Teach the Relevance Cue: Give 1 firm stomp for a 'Needed Clue' and wave hands sideways for a 'True-but-Distracting Fact'.",
        tactile_discovery_ritual="Kwame's Clue Basket vs. Decoy Basket (7 Minutes):\n"
                                 "1. Place 8 wooden blocks, 4 seashells, and 3 blue scarves in the center of the rug, plus two baskets ('Clue Basket' and 'Side-Path Basket').\n"
                                 "2. Tell a live tactile story: 'Octavia is building a tower with 4 blocks. She wears 2 blue scarves. Kwame hands her 3 more blocks. How tall is their block tower?'\n"
                                 "3. Children physically move the 2 scarves into the Side-Path Basket ('True fact, not a block clue!' — S-31) and stack the 4 + 3 = 7 blocks to a 7-beat drumroll.\n"
                                 "4. Test quantifiers (S-10): 'Are ALL things on our rug wooden, MOST, or SOME?' Count to prove it!",
        socratic_wonder_circle=[
            "Relevance (S-31): Why wasn't the number '2 scarves' part of our block answer, even though Octavia really had 2 scarves?",
            "Measurement Criteria (S-15): If Silas measures our rug with giant boots (6 steps) and Aiko uses tiny steps (12 steps), did the rug grow bigger? How can we make measuring fair?",
            "Contradiction Check (S-34): Can a group of 5 pebbles be 'more than 6' and 'less than 6' at the exact same time?",
        ],
        five_domain_spider={
            "language": "Precise quantifier vocabulary ('all', 'most', 'some', 'none', 'relevant clue').",
            "cognitive": "Inhibiting impulsive number-grabbing by isolating relevant mathematical quantities and unit standards.",
            "physical": "Fine-motor block stacking and non-standard foot-to-heel measurement walking.",
            "science_sensory": "Tactile weight, length, and material comparison across wood, shell, and cloth.",
            "social_emotional": "Collaborative puzzle-solving where spotting a tricky decoy brings shared laughter instead of test anxiety.",
        },
        seriphia_whisper="Explicitly separating relevant quantities from decoy facts strengthens dorsolateral prefrontal executive filtering, inoculating young minds against mechanical 'plug-and-chug' math habits.",
        institutional_standards=["ELOF P-MATH 4, 6 & 8", "NAEYC 2.F.02 & 2.F.05", "CCSS.MATH K.OA.A.2 & K.MD.A.2"],
    ),
    "vitalis": SocraticQuestModule(
        quest_id="ct-vitalis-01",
        land_id="vitalis",
        land_name="Vitalis",
        hero_guides="Felix & Amara",
        paired_track_slug="drill-time",
        paired_track_title="Drill Time",
        strategies_activated=["S-1", "S-7", "S-8", "S-9", "S-27"],
        didactic_trap_replaced="Instant learned helplessness ('I can't do it!') or obeying rules only when an adult is watching.",
        quest_mission="March with Felix and Amara in Vitalis to turn 'I can't yet!' into steady somatic perseverance and match our promises with our actions.",
        rhythm_ignition="100 BPM Sovereign Cadet Cadence (Track 7 'Drill Time'):\n"
                        "• Bilateral cross-crawl march (right elbow to left knee): 'Stay on the path, always learning!'\n"
                        "• Practice the 5-Second Sovereign Freeze on the drum stop.",
        tactile_discovery_ritual="The Perseverance Bridge & Integrity Mirror (7 Minutes):\n"
                                 "1. Challenge pairs to transport a rolling ball or round fruit across the rug balanced on two wooden spoons without touching it with fingers.\n"
                                 "2. When it drops (by design!), freeze, place one hand on the heart for 2 slow Amara breaths, and chant: 'Mistakes are clues—how do we adjust our spoons?' (S-8, S-9).\n"
                                 "3. Children independently invent a steadier grip or slower pace (S-1) without adult rescue.\n"
                                 "4. Reflect honestly on whether anyone nudged the ball with a thumb when nobody looked (S-7, S-27).",
        socratic_wonder_circle=[
            "Perseverance (S-8): When the ball rolled off the spoons the first time, what clue did that drop teach your hands for try number two?",
            "Ideals vs. Practice (S-27): What is the difference between saying 'I'm sorry' quickly with our mouth vs. actually changing how gently our hands move next time?",
            "Independent Thinking (S-1): Why does figuring out a balance trick yourself feel stronger than having a grown-up carry it for you?",
        ],
        five_domain_spider={
            "language": "Self-coaching metacognitive speech ('Not yet', 'Let's adjust', 'Same fair rule for all').",
            "cognitive": "Iterative error-analysis—treating physical drops as diagnostic feedback rather than failure.",
            "physical": "Bilateral cross-lateral marching, visuomotor spoon stabilization, and isometric freeze control.",
            "science_sensory": "Center-of-gravity physics, momentum, and cardiac interoception during breath resets.",
            "social_emotional": "Frustration tolerance, intrinsic agency, and honest self-governance.",
        },
        seriphia_whisper="Coupling diaphragmatic vagal braking immediately after a motor error prevents amygdala hijack, wiring the anterior cingulate cortex to treat mistakes as curiosity signals.",
        institutional_standards=["ELOF P-ATL 1 & 2, P-PMP 1", "NAEYC 2.B.04 & 2.C.04", "CASEL Self-Management"],
    ),
    "luminosity": SocraticQuestModule(
        quest_id="ct-luminosity-01",
        land_id="luminosity",
        land_name="Luminosity",
        hero_guides="Athena & Ezra",
        paired_track_slug="hard-words",
        paired_track_title="Hard Words",
        strategies_activated=["S-16", "S-17", "S-19", "S-20", "S-24"],
        didactic_trap_replaced="Uncritical acceptance of rules as arbitrary bossiness and passive belief in flashy commercials or loud claims.",
        quest_mission="Carry Athena and Ezra's Lantern of Inquiry across Luminosity to ask root questions, design fair rules, and test whether a claim is trustworthy.",
        rhythm_ignition="84 BPM Syllable-Slowdown Beat (Track 15 'Hard Words'):\n"
                        "• 'Sometimes you may hear a word—or a problem—that's hard, so slow down and clap it out!'\n"
                        "• Clap multisyllabic inquiry words: 'Com-mu-ni-ty' (4 claps), 'Ev-i-dence' (3 claps), 'So-lu-tion' (3 claps).",
        tactile_discovery_ritual="The Rule-Makers' Sanctuary Council (7 Minutes):\n"
                                 "1. Set out one desirable musical chime or shaker in the middle of a 4-child group with ZERO rules announced for 20 seconds—observe the tangle!\n"
                                 "2. Ring Seriphia's Pause Bell. Ask the circle to state the root problem clearly (S-17).\n"
                                 "3. Using 3 yarn paths on the floor, groups invent 3 distinct sharing rules (e.g., 8-beat sand-timer turns, ensemble duet roles, passing clockwise on chorus) and test each for 1 minute (S-19, S-20).\n"
                                 "4. Bonus Credibility Check (S-16): Compare a pretend 'Super-Sugar Cereal Ad' claim against inspecting a real apple.",
        socratic_wonder_circle=[
            "Root Questions (S-17): Why do we need rules in our music circle at all—and what makes a rule a GOOD rule versus an unfair rule?",
            "Credibility (S-16): Why might a TV commercial say a plastic toy flies by itself when it doesn't? How can smart thinkers check before believing?",
            "Assessing Solutions (S-19): Which of our three sharing plans worked best for the shyest friend in our circle, not just the loudest voice?",
        ],
        five_domain_spider={
            "language": "Multisyllabic civic & inquiry vocabulary articulated clearly via slow-tempo rhythmic clapping.",
            "cognitive": "Generating multiple divergent solutions and evaluating policies against fairness criteria.",
            "physical": "Rhythmic turn-taking ensemble coordination with handheld percussion.",
            "science_sensory": "Empirical verification—comparing advertised claims against direct sensory inspection.",
            "social_emotional": "Democratic agency, civic stewardship, and inclusive care for quieter peers.",
        },
        seriphia_whisper="When young children co-construct and test classroom rules empirically, compliance shifts from external fear-based obedience to internalized prefrontal moral reasoning.",
        institutional_standards=["ELOF P-SE 4 & 5, P-LC 3", "NAEYC 2.L.02 & 2.L.06", "CCSS.ELA SL.K.3"],
    ),
    "aquaria": SocraticQuestModule(
        quest_id="ct-aquaria-01",
        land_id="aquaria",
        land_name="Aquaria",
        hero_guides="Nerissa & Ronan",
        paired_track_slug="the-ocean",
        paired_track_title="The Ocean",
        strategies_activated=["S-2", "S-3", "S-4", "S-25", "S-26"],
        didactic_trap_replaced="Treating emotions as uncontrollable storms disconnected from thoughts, or forcing one-sided 'apologize now' conflict scripts.",
        quest_mission="Glide with Nerissa and Ronan across the Twin Shores of Aquaria to uncover the hidden thoughts beneath big feelings and see through two sets of eyes.",
        rhythm_ignition="64 BPM Gentle Ocean Wave Sway (Track 14 'The Ocean'):\n"
                        "• Sweep arms in horizontal figure-8 infinity loops across the body midline.\n"
                        "• Inhale 4 counts ('Rising tide'), exhale 6 counts ('/shhhhh/ calm shore').",
        tactile_discovery_ritual="The Two-Shore Footprint Perspective Swap (7 Minutes):\n"
                                 "1. Lay two blue cloth 'shores' facing each other across a ribbon 'river'.\n"
                                 "2. Act out a classic everyday moment: Ronan spent 5 minutes building a shell spiral, and Nerissa stepped backward while looking at a butterfly and crushed one edge.\n"
                                 "3. First Thought Check (S-4): If Ronan thinks 'She wrecked my shells on purpose!', how does his body feel? Now what if Ronan discovers 'She was looking up and didn't see it!'—how does his feeling change?\n"
                                 "4. Children physically step onto Shore A to voice Ronan's care for his work, then cross the midline onto Shore B to voice Nerissa's honest accident, then meet on the bridge to co-rebuild (S-3, S-25).",
        socratic_wonder_circle=[
            "Thoughts & Feelings (S-4): Did the broken shell alone make the angry wave, or did the THOUGHT 'She did it to be mean!' make the wave twice as big?",
            "Egocentricity Check (S-2): Why is it so easy to notice when someone bumps into US, and so easy to forget when WE bump into someone else?",
            "Fairminded Resolution (S-3, S-26): What fair next step respects BOTH Ronan's hard work AND the truth that Nerissa didn't mean to step on it?",
        ],
        five_domain_spider={
            "language": "Cognitive-affective bridge sentences ('When I assumed ___, I felt ___; when I learned ___, I felt ___').",
            "cognitive": "Cognitive reappraisal—testing alternative explanations for peer actions before reacting.",
            "physical": "Horizontal figure-8 midline crossing and spatial perspective-stepping.",
            "science_sensory": "Fluid wave motion, parasympathetic respiratory pacing, and somatic tension release.",
            "social_emotional": "Strong-sense fairmindedness, theory of mind, and restorative peer repair.",
        },
        seriphia_whisper="Teaching ages 2–7 that changing an unverified assumption changes an emotional wave builds direct top-down prefrontal-to-amygdala pathways—the neurological foundation of lifelong emotional intelligence.",
        institutional_standards=["ELOF P-SE 2, 6 & 7", "NAEYC 2.B.01 & 2.L.01", "CASEL Social Awareness & Relationship Skills"],
    ),
    "terrasol": SocraticQuestModule(
        quest_id="ct-terrasol-01",
        land_id="terrasol",
        land_name="Terrasol",
        hero_guides="Vesta & Silas",
        paired_track_slug="rain",
        paired_track_title="Rain",
        strategies_activated=["S-5", "S-18", "S-30", "S-32", "S-33"],
        didactic_trap_replaced="Presenting science as finished facts to memorize rather than teaching children to suspend judgment, question assumptions, and design real tests.",
        quest_mission="Kneel on the living earth of Terrasol with Vesta and Silas to test seeds, rain, and stones like true nature detectives!",
        rhythm_ignition="76 BPM Raindrop Finger-Patter (Track 18 'Rain'):\n"
                        "• Patter two fingers softly on the floor like drizzle, build to 8-finger rain, then quiet sun stillness.\n"
                        "• Chant Terrasol's Inquiry Code: 'Observe with senses [1 stomp] — Infer with clues [2 claps] — Test to know [open palms]!'",
        tactile_discovery_ritual="The Mystery Seed & Sweating Cup Investigation (7 Minutes):\n"
                                 "1. Place dry lima beans, small smooth pebbles, and an ice-water cup tinted with 2 drops of berry juice/food coloring on a tray.\n"
                                 "2. Intellectual Humility Sort (S-5): Ask 'Are dry beans alive, or non-living like pebbles?' Invite honest 'I'm not sure yet—how could we test it?' Set up two damp-cloth sprout jars (beans vs. pebbles) to observe over 5 days (S-33).\n"
                                 "3. Assumption & Inference Test (S-30, S-32): Touch the clear water droplets forming on the outside of the red-tinted ice cup. If the water leaked THROUGH the cup, what color would the outside drops be? Red! Since the drops are clear, where MUST the water have come from? The air around us!",
        socratic_wonder_circle=[
            "Intellectual Humility (S-5): Why does a real scientist love saying 'I don't know yet—let's test!' instead of guessing right away?",
            "Testing Assumptions (S-30): When people see wet drops outside a cold cup, why do many assume the cup leaked—and how did the red berry tint prove that assumption wrong?",
            "Evaluating Evidence (S-33): Why do we plant BOTH pebbles and beans in identical wet jars instead of only planting beans?",
        ],
        five_domain_spider={
            "language": "Scientific reasoning lexicon ('observe', 'predict', 'evidence', 'condensation', 'living soil').",
            "cognitive": "Controlled-variable logic and falsifying intuitive misconceptions through direct counter-evidence.",
            "physical": "Pincer-grasp seed handling and graded tactile fingertip percussion.",
            "science_sensory": "Thermal condensation, botany germination conditions, and mineral vs. organic texture contrast.",
            "social_emotional": "Curiosity without fear of being wrong; shared wonder at invisible natural processes.",
        },
        seriphia_whisper="Hands-on controlled contrasts (clear drops outside a colored ice cup; beans vs. pebbles) wire the hippocampus and prefrontal cortex for empirical causality rather than passive rote recall.",
        institutional_standards=["ELOF P-SCI 1, 3, 5 & 6", "NAEYC 2.G.02 & 2.G.04", "NGSS K-LS1-1 & K-ESS2-1"],
    ),
    "celestia": SocraticQuestModule(
        quest_id="ct-celestia-01",
        land_id="celestia",
        land_name="Celestia",
        hero_guides="Elias & Selene",
        paired_track_slug="changes",
        paired_track_title="Changes",
        strategies_activated=["S-11", "S-12", "S-13", "S-23", "S-35"],
        didactic_trap_replaced="Teaching subjects in disconnected silos where children never trace real-world consequences over time or transfer insights across domains.",
        quest_mission="Rise to the Starlight Observatory of Celestia with Elias and Selene to weave all Seven Lands together and trace how today's choices ripple into tomorrow.",
        rhythm_ignition="72 BPM Three-Time Waltz Sway (Track 12 'Changes' & Track 2 'Days of the Week'):\n"
                        "• Gentle 1-2-3 pendulum sway: 'Yesterday (left) — Today (center) — Tomorrow (right)!'\n"
                        "• Ring the Twilight Slow-Down Chime before framing our big question (S-13).",
        tactile_discovery_ritual="The Constellation Consequence Chain & Analogy Web (7 Minutes):\n"
                                 "1. Lay 4 star mats in a curved arc across the rug: 'Choice/Event -> First Ripple -> Second Ripple -> Community Result' (S-35).\n"
                                 "2. Walk two contrasting chains physically: Chain A ('Sun warms ocean -> vapor rises -> rain waters Terrasol garden -> Vitalis bodies eat fresh food') and Chain B ('Leaving trash in park -> rain washes it into Aquaria stream -> fish lose clean water').\n"
                                 "3. Analogy Yarn Bridge (S-11, S-23): Stretch golden yarn connecting a sprouting seed card, a piano/drum card, and a friendship card—children explain how ALL THREE grow stronger through daily patience and care!",
        socratic_wonder_circle=[
            "Consequences (S-35): If the Sun took a vacation for one whole month, what ripple chain would happen to clouds, plants, animals, and us?",
            "Analogous Transfer (S-11): How is watering a tiny seed a little bit every day just like practicing a tricky word or rhythm for 10 minutes each morning?",
            "Perspective Growth (S-12): What is one thing you understand today that seemed confusing or scary when you were smaller?",
        ],
        five_domain_spider={
            "language": "Causal & temporal connectives ('because', 'therefore', 'just like', 'if...then') in multi-clause speech.",
            "cognitive": "Cross-domain analogical reasoning and multi-step consequence forecasting.",
            "physical": "Vestibular pendulum balance and sequential locomotor stepping across timeline mats.",
            "science_sensory": "Solar energy, water-cycle interdependence, and ecological systems thinking.",
            "social_emotional": "Long-horizon stewardship, gratitude for growth over time, and serene evening reflection.",
        },
        seriphia_whisper="Analogical mapping across music, nature, and relationships strengthens rostrolateral prefrontal cortex integration—the highest seat of human relational reasoning and creative transfer.",
        institutional_standards=["ELOF P-SCI 4, P-ATL 5 & P-LC 7", "NAEYC 2.A.08 & 2.L.03", "CCSS.ELA RL.K.2 & NGSS K-ESS3-1"],
    ),
}


def get_strategies_by_land(land_id: Optional[str] = None, category: Optional[str] = None) -> List[CriticalThinkingStrategy]:
    """Filter the 35 Critical Thinking Strategies by SOE Land ID and/or Category."""
    results = CRITICAL_THINKING_STRATEGIES
    if land_id:
        lid = land_id.strip().lower()
        results = [s for s in results if s.land_id == lid]
    if category:
        cat = category.strip().lower()
        results = [s for s in results if cat in s.category.lower()]
    return results


def get_remodelled_units_by_land(land_id: Optional[str] = None) -> List[RemodelledUnitMap]:
    """Return textbook remodelled lessons mapped to a specific SOE Land (or all 70 units)."""
    if not land_id:
        return REMODELLED_LESSON_CATALOG
    lid = land_id.strip().lower()
    return [u for u in REMODELLED_LESSON_CATALOG if u.soe_land_id == lid]


def export_socratic_quest_markdown(quest: SocraticQuestModule) -> str:
    """Render a turnkey, classroom-ready SOE Critical Thinking & Socratic Rhythm Quest in Markdown."""
    strats = ", ".join(quest.strategies_activated)
    wonder_bullets = "\n".join([f"- {q}" for q in quest.socratic_wonder_circle])
    standards_str = " | ".join([f"`{st}`" for st in quest.institutional_standards])

    return f"""# 🧠 SOE Critical Thinking Quest: {quest.land_name} (`{quest.quest_id}`)
> **The Sound of Essentials: Rhythm Quest — Socratic Curriculum Expansion**  
> **Land:** {quest.land_name} | **Hero Guides:** {quest.hero_guides} | **Sovereign Guardian:** Seriphia  
> **Paired Album Track:** `{quest.paired_track_title}` (`{quest.paired_track_slug}`) | **Age Scope:** {quest.age_band} | **Duration:** {quest.duration}  
> **Critical Thinking Dimensions Activated:** `{strats}`

---

## 🔄 Pedagogical Remodel (Didactic Trap ➔ SOE Sovereign Inquiry)
- **Didactic Habit Replaced:** {quest.didactic_trap_replaced}
- **SOE Core Directive:** *Talk FROM, Not ABOUT — Music is the beacon for all children to learn.*

---

## 1. 🎯 Quest Mission (1 Sentence)
{quest.quest_mission}

---

## 2. 🥁 The Rhythm Ignition (2 Minutes)
{quest.rhythm_ignition}

---

## 3. 🖐️ Tactile Discovery Ritual (7 Minutes)
{quest.tactile_discovery_ritual}

---

## 4. 💬 Seriphia's Socratic Wonder Circle (4 Minutes)
{wonder_bullets}

---

## 5. 🌐 The 5-Domain Spider
- **🗣️ Language & Early Literacy:** {quest.five_domain_spider['language']}
- **🔢 Cognitive & Critical Logic:** {quest.five_domain_spider['cognitive']}
- **🤸 Physical & Somatic Movement:** {quest.five_domain_spider['physical']}
- **🔬 Science & Sensory Inquiry:** {quest.five_domain_spider['science_sensory']}
- **🤝 Social-Emotional & Fairmindedness:** {quest.five_domain_spider['social_emotional']}

---

## 6. 🌟 Seriphia's Parent / Teacher Whisper (Neuro-Pedagogical Insight)
*{quest.seriphia_whisper}*

---

## 🏛️ Multi-Institutional Standards Alignment
{standards_str}

---
*Crafted by a father's heart and a mother's love • Humanly handcrafted for Ages 2–7 • The Sound of Essentials (`soelearn.com`)*
"""


def build_foundation_dataset() -> Dict[str, Any]:
    """Assemble the complete, deterministic JSON syllabus & SOE Critical Thinking Curriculum dataset."""
    from soe_curriculum.workbook_block_k import export_block_k_schedule_list

    return {
        "provenance": TEXTBOOK_PROVENANCE,
        "universal_intellectual_standards": INTELLECTUAL_STANDARDS,
        "socratic_questioning_taxonomy": SOCRATIC_TAXONOMY,
        "syllabus_chapters": [c.model_dump() for c in SYLLABUS_CHAPTERS],
        "strategies_35": [s.model_dump() for s in CRITICAL_THINKING_STRATEGIES],
        "supplemental_dimensions_4": SUPPLEMENTAL_DIMENSIONS,
        "remodelled_units_70": [u.model_dump() for u in REMODELLED_LESSON_CATALOG],
        "flagship_soe_socratic_quests": {k: v.model_dump() for k, v in SOE_SOCRATIC_QUESTS.items()},
        "workbook_block_k_40_day_schedule": export_block_k_schedule_list(),
    }


def export_foundation_json(indent: int = 2) -> str:
    """Serialize the complete Critical Thinking Curriculum foundation to JSON."""
    return json.dumps(build_foundation_dataset(), indent=indent, ensure_ascii=False)

