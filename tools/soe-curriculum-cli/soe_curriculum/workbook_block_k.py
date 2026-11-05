"""
40-Day Workbook Block K ("Seriphia's Socratic Spark") Generator & Validator.

Wires the complete Critical Thinking & Socratic Inquiry foundation
(Paul, Binker & Weil, 1990 — 35 Core Strategies S-1..S-35 + 4 Dalzell
Supplemental Dimensions D-1..D-4 + 1 Grand Sovereign Synthesis S-ALL = 40 Days)
directly into The Sound of Essentials: Rhythm Ready Workbook (workbook_content.json).

Canonical Invariants:
- Strictly Ages 2–7 (Pre-K to Grade 2; Sprouts 2–4, Pathfinders 4–5, Wayfarers 6–7)
- 7 Canonical Lands mapped to workbook CSS classes:
    1: Harmonia (#d4a843)   | 2: Numeria (#7fb685)    | 3: Terrasol (#5fb685)
    4: Aquaria (#5ba4c9)    | 5: Vitalis (#c4785a)    | 6: Luminosity (#d4897a)
    7: Celestia (#9678c4)
- 15 Canonical Heroes (14 Land Heroes + Sovereign Guardian Seriphia)
- 100% Screen-Free, Acoustic & Tactile Socratic Pedagogy ("Talk FROM, Not ABOUT")
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from pydantic import BaseModel, Field

from soe_curriculum.critical_thinking import (
    CRITICAL_THINKING_STRATEGIES,
    SUPPLEMENTAL_DIMENSIONS,
    INTELLECTUAL_STANDARDS,
    SOCRATIC_TAXONOMY,
)

WORKBOOK_LAND_INDEX: Dict[str, Tuple[int, str, str]] = {
    "harmonia": (1, "Harmonia", "Kenji & Aiko"),
    "numeria": (2, "Numeria", "Kwame & Octavia"),
    "terrasol": (3, "Terrasol", "Vesta & Silas"),
    "aquaria": (4, "Aquaria", "Nerissa & Ronan"),
    "vitalis": (5, "Vitalis", "Felix & Amara"),
    "luminosity": (6, "Luminosity", "Athena & Ezra"),
    "celestia": (7, "Celestia", "Elias & Selene"),
}


class WorkbookBlockK(BaseModel):
    """Schema for a single daily Block K ('Seriphia's Socratic Spark') entry in workbook_content.json."""

    title: str
    time: int = 3
    domain: str = "Critical Thinking & Fairminded Inquiry"
    strategy_code: str
    strategy_name: str
    intellectual_standard: str
    socratic_category: str
    land: int = Field(ge=1, le=7)
    land_class: str
    land_name: str
    hero_guides: str
    char_img: str = "seriphia.png"
    rhythm_cue: str
    tactile_spark: str
    socratic_question: str
    tip: str
    standard_alignment: str


def _build_strategy_lookup() -> Dict[str, Dict[str, Any]]:
    lookup: Dict[str, Dict[str, Any]] = {}
    for s in CRITICAL_THINKING_STRATEGIES:
        wb_num, wb_name, wb_heroes = WORKBOOK_LAND_INDEX[s.land_id]
        lookup[s.code] = {
            "strategy_name": s.formal_name,
            "land_id": s.land_id,
            "land": wb_num,
            "land_class": f"land{wb_num}",
            "land_name": wb_name,
            "hero_guides": wb_heroes,
            "standard_alignment": s.elof_naeyc_alignment,
        }
    supp_lands = {
        "D-1": ("celestia", "ELOF P-ATL 4 (Intellectual Curiosity) | NAEYC 2.A.10"),
        "D-2": ("aquaria", "ELOF P-SE 6 (Social Sensitivity & Empathy) | NAEYC 2.B.01"),
        "D-3": ("harmonia", "ELOF P-SCI 1 (Critical Sensory Observation) | NAEYC 2.G.01"),
        "D-4": ("harmonia", "ELOF P-LC 5 (Precise Expressive Language) | CCSS.ELA SL.K.6"),
    }
    for d in SUPPLEMENTAL_DIMENSIONS:
        code = d["code"]
        lid, align = supp_lands[code]
        wb_num, wb_name, wb_heroes = WORKBOOK_LAND_INDEX[lid]
        lookup[code] = {
            "strategy_name": d["formal_name"],
            "land_id": lid,
            "land": wb_num,
            "land_class": f"land{wb_num}",
            "land_name": wb_name,
            "hero_guides": wb_heroes,
            "standard_alignment": align,
        }
    wb_num, wb_name, _ = WORKBOOK_LAND_INDEX["celestia"]
    lookup["S-ALL"] = {
        "strategy_name": "Strong-Sense Fairminded Synthesis Across All 7 Lands",
        "land_id": "celestia",
        "land": wb_num,
        "land_class": f"land{wb_num}",
        "land_name": wb_name,
        "hero_guides": "All 14 Land Heroes",
        "standard_alignment": "ELOF P-ATL 5, P-LC 3 & P-SE 7 | NAEYC 2.A.08 | CCSS.ELA SL.K-2.1",
    }
    return lookup


# Raw 40-day Socratic Spark specifications keyed by (week, day).
# Bijective coverage: 35 Core Strategies (S-1..S-35) + 4 Dalzell Supplements (D-1..D-4) + 1 Capstone (S-ALL) = 40 Days.
_RAW_40_DAY_SPECS: List[Tuple[int, int, str, str, str, str, str, str, str, str]] = [
    # ── WEEK 1: Hello, 7 Lands! ─────────────────────────────────────────────
    (
        1, 1, "S-6", "Courageous Greeting Voice",
        "Clarity", "1. Questions of Clarification",
        "68 BPM Open-Palm Echo Tap (tap knees gently twice before speaking)",
        "Hold a spoon or smooth stone like a microphone. Practice saying 'Good morning!' first in a tiny shy whisper, then in a clear, warm Harmonia voice.",
        "When everyone in a group stays quiet or agrees, why does it take gentle courage to ask a question or welcome a new friend first?",
        "Seriphia says: Brave thinking starts with a kind, honest voice — just like Kenji trying his new word again!",
    ),
    (
        1, 2, "S-10", "All, Most, or Some Shapes?",
        "Precision", "2. Questions that Probe Assumptions",
        "92 BPM Ten-Finger Check (wiggle all 10 fingers, then fold some down)",
        "Look at 5 objects near your table (books, cups, pencils, blocks). Touch each one to test how many have straight sides.",
        "Would it be accurate to say ALL things in our room have four corners, or is it truer to say SOME or MOST? How did counting prove it?",
        "Seriphia says: Careful thinkers skip words like 'always' and 'everything' when 'most' or 'some' tells the real truth!",
    ),
    (
        1, 3, "S-5", "The 'Let's Check!' Weather Test",
        "Accuracy", "3. Questions that Probe Reasons, Evidence & Causes",
        "76 BPM Three-Beat Detective Knock (knock-knock-knock on the table)",
        "Step to a window or door and use three senses: look at the sky, listen for wind, and feel the air temperature on your hand.",
        "Just like Silas checking his shiny quartz rock, what do your senses know FOR SURE about today's weather — and what do we have to say 'I don't know yet' about?",
        "Seriphia says: Saying 'I don't know yet — let's test!' is how every true scientist in Terrasol begins.",
    ),
    (
        1, 4, "S-17", "Why Do Communities Have Helpers?",
        "Significance", "6. Questions About the Question",
        "84 BPM Hands-Over-Heart Pause Breath (inhale 4 counts before answering)",
        "Line up 3 household items representing helpers (a bandage, a broom, a storybook) and take one away at a time.",
        "What deep wonder-question hides inside our neighborhood: what would happen in one single week if nobody helped clean, heal, or teach?",
        "Seriphia says: Big wisdom grows when we ask 'Why does this matter?' about everyday things around us.",
    ),
    (
        1, 5, "D-1", "Seven-Day Wonder Spark",
        "Depth", "1. Questions of Clarification",
        "72 BPM Seven-Day Clap Circle (one warm clap for each day of the week)",
        "Point to your favorite page from Week 1 and place a small coin, leaf, or star token on the picture that made you most curious.",
        "Out of everything you explored across the 7 Lands this week, which mystery made your mind ask 'How does that work?' the most?",
        "Seriphia says: Curiosity is the golden key to all 7 Lands — every great learner starts by wondering aloud!",
    ),

    # ── WEEK 2: Feelings & Families ─────────────────────────────────────────
    (
        2, 1, "S-22", "Cupped Ears & Silent Dialogue",
        "Completeness", "1. Questions of Clarification",
        "68 BPM Cupped 'Sonorous Ears' Echo Pulse (4-beat pause before replying)",
        "Ask a family member or classmate, 'What made you smile today?' Listen without interrupting, then echo their idea back until they nod 'Yes!'",
        "What is the difference between just waiting quietly for your turn to talk versus truly listening so well you can echo your friend's heart?",
        "Seriphia says: When you paraphrase someone's thought fairly before sharing yours, two minds harmonize like one song.",
    ),
    (
        2, 2, "S-29", "Pets vs. Wild Horses: Deep Clues",
        "Relevance", "3. Questions that Probe Reasons, Evidence & Causes",
        "88 BPM Trotting Knee-Pat (left-right-left-right horse cadence)",
        "Compare a small indoor pet (like a cat or puppy) with a galloping wild horse using your hands to show space and food needs.",
        "Beyond fur color or four legs, what BIG difference in daily care explains why a puppy thrives in a home while a wild horse needs open fields?",
        "Seriphia says: Looking past surface colors to spot deep needs is how Numeria and Terrasol thinkers compare wisely.",
    ),
    (
        2, 3, "S-4", "The Thought Beneath the Feeling Wave",
        "Fairmindedness", "4. Questions About Viewpoints or Perspectives",
        "64 BPM Ocean Tide Breath (4-count inhale, 6-count '/shhhh/' exhale)",
        "Draw a quick wave in the air with your hand, then smooth the water flat as you breathe out slowly.",
        "Imagine someone accidentally smudges your drawing: how does your feeling wave change if you switch your thought from 'They were mean!' to 'Their elbow slipped!'?",
        "Seriphia says: Every big feeling rides on a hidden thought — checking that thought brings calm Aquaria waters.",
    ),
    (
        2, 4, "S-14", "What Makes 'Thank You' Real?",
        "Clarity", "1. Questions of Clarification",
        "70 BPM Two-Hand Heart-to-Open-Palm Gesture",
        "Act out saying 'Thank you!' two ways: first snatching an object with a frown, second receiving it gently with warm eyes.",
        "If someone says the polite words 'Please' and 'Thank you' while grabbing roughly, did they really use good manners? What makes courtesy real?",
        "Seriphia says: Words aren't magic spells by themselves — true Harmonia manners unite kind words with respectful actions!",
    ),
    (
        2, 5, "D-2", "Gentle Voice, Safe Circle",
        "Fairmindedness", "4. Questions About Viewpoints or Perspectives",
        "60 BPM Soft Chime Hum (hum one warm note before speaking)",
        "Place one hand gently on your chest and practice asking a helpful question in your kindest, most welcoming tone.",
        "When a friend makes a mistake counting or reading, how can we ask a question gently so they feel safe and excited to keep trying?",
        "Seriphia says: Social sensitivity means caring for our friend's heart at the exact same moment we sharpen our thinking.",
    ),

    # ── WEEK 3: Community & Cooperation ─────────────────────────────────────
    (
        3, 1, "S-20", "Testing What Makes a Rule Wise",
        "Logic", "5. Questions that Probe Implications & Consequences",
        "84 BPM Two-Step Rule Check (stomp for 'Why', clap for 'What Happens Next')",
        "Compare two pretend home rules: Rule A ('Walk with scissors pointed down') and Rule B ('Only children wearing blue may speak').",
        "Why is Rule A wise and helpful for everyone, while Rule B is unfair? How can we test whether any rule is doing a good job?",
        "Seriphia says: Fair rules aren't bossy wishes — they protect everyone's safety, learning, and dignity equally!",
    ),
    (
        3, 2, "S-19", "Three Fair Paths for One Shared Tool",
        "Completeness", "4. Questions About Viewpoints or Perspectives",
        "90 BPM Three-Path Finger Tap (tap finger 1, finger 2, finger 3)",
        "Set one favorite crayon or musical shaker on the table and imagine three friends all reach for it at the exact same moment.",
        "Instead of grabbing first, can you invent THREE different fair ways for three friends to share one tool — and pick which works best?",
        "Seriphia says: Strong problem-solvers never stop at their first impulse — they invent multiple fair paths and test them!",
    ),
    (
        3, 3, "S-2", "Me-First vs. Fair-for-All",
        "Fairmindedness", "2. Questions that Probe Assumptions",
        "76 BPM Ripple Circle Sweep (sweep both arms wide to include the whole room)",
        "Pretend you are choosing the game for music time, and a younger child wants a slower rhythm so they can keep up.",
        "How can we tell the difference between thinking an idea is 'best' because it is truly fair for everyone versus only because it lets US win first?",
        "Seriphia says: Spotting the 'me-first' tug inside our own mind is one of the bravest superpowers in Aquaria!",
    ),
    (
        3, 4, "S-30", "Mystery Drops on the Cold Cup",
        "Accuracy", "2. Questions that Probe Assumptions",
        "76 BPM Raindrop Finger-Patter (patter fingertips softly like rain)",
        "Touch the outside of a cold cup of water (or imagine water tinted red with berry juice while the outside drops stay clear).",
        "Many people ASSUME cold water leaked right through the glass! If berry water inside is red but the outside drops are clear, where did the drops REALLY come from?",
        "Seriphia says: Checking hidden assumptions with a simple real-world test turns everyday surprises into Terrasol science!",
    ),
    (
        3, 5, "S-13", "The Twilight Slow-Down Question",
        "Clarity", "6. Questions About the Question",
        "60 BPM Largo Pause Bell (count 1-2-3-4 silently before speaking)",
        "Take one slow Celestia breath and turn a messy complaint ('Everything is ruined!') into one clear, calm problem statement.",
        "Why does slowing down to state the exact problem clearly and fairly make disagreements twice as easy to solve?",
        "Seriphia says: A muddled question tangles our feet, while a clear, star-bright question lights the path halfway home.",
    ),

    # ── WEEK 4: Wonders of the World ────────────────────────────────────────
    (
        4, 1, "S-3", "Stepping Onto Another Traveler's Shore",
        "Fairmindedness", "4. Questions About Viewpoints or Perspectives",
        "72 BPM Two-Shore Step (step left for Shore A, cross right for Shore B)",
        "Place two pieces of paper on the floor: stand on Paper A as a child who rides a boat to school, then step onto Paper B as a child who walks snowy hills.",
        "Why might a boat seem strange to a mountain traveler at first — and what happens when we step into their shoes before judging?",
        "Seriphia says: Fairminded explorers travel across two sets of footprints before deciding what makes sense!",
    ),
    (
        4, 2, "S-15", "Three Rules for a Trustworthy Borrower",
        "Specificity", "3. Questions that Probe Reasons, Evidence & Causes",
        "88 BPM Three-Star Clap-Pat-Clap Yardstick Rhythm",
        "Hold a pencil or book that belongs to someone else gently in both hands as if you borrowed it for one day.",
        "Before lending your favorite treasure, what THREE clear measuring rules (criteria) show that someone is ready to borrow responsibly?",
        "Seriphia says: Clear criteria turn vague wishes like 'be careful' into fair, specific promises everyone can keep.",
    ),
    (
        4, 3, "S-32", "Map Clues: Observe vs. Infer",
        "Logic", "3. Questions that Probe Reasons, Evidence & Causes",
        "80 BPM Tracker Cadence: 1 Stomp for 'Eyes Observe', 2 Claps for 'Mind Infers'",
        "Look at today's map or out your window at wet pavement, swaying branches, or footprints.",
        "What is one fact your eyes OBSERVE directly right now — and what smart INFERENCE can your mind make from that clue while checking alternatives?",
        "Seriphia says: Knowing the bridge between what our eyes see and what our mind infers keeps our thinking sharp and honest!",
    ),
    (
        4, 4, "S-16", "The Lantern of Truth: Checking Sources",
        "Accuracy", "3. Questions that Probe Reasons, Evidence & Causes",
        "84 BPM Two-Tap Lantern Check ('Were they there? Why do they say so?')",
        "Cup your hands like Athena's glowing lantern and shine it first toward a pretend candy commercial, then toward a real apple or vegetable.",
        "Who is a more trustworthy source about what helps your body grow strong — a flashy commercial trying to sell candy, or testing real whole foods yourself? Why?",
        "Seriphia says: Wise Luminosity thinkers always check whether a voice has real firsthand knowledge or is just trying to sell something!",
    ),
    (
        4, 5, "S-28", "Clapping Out Thinker's Power Words",
        "Precision", "1. Questions of Clarification",
        "84 BPM Syllable Slowdown Clap (Track 15 'Hard Words' beat)",
        "Clap the syllables slowly on your knees: 'Ob-serve' (2 claps), 'In-fer' (2 claps), 'As-sume' (2 claps), 'Ev-i-dence' (3 claps).",
        "How does using exact thinking words like 'evidence' and 'assume' help your mind spot clues that fuzzy words like 'stuff' hide?",
        "Seriphia says: Slowing down to clap out precise thinking words gives your growing mind crystal-clear lenses!",
    ),

    # ── WEEK 5: Body, Mind & Balance ────────────────────────────────────────
    (
        5, 1, "S-1", "My Own Hands Test It First",
        "Adequacy", "1. Questions of Clarification",
        "96 BPM Solo 4-Beat Body-Percussion Invention (invent your own 4-beat tap!)",
        "Try balancing a soft book or rolled sock on your palm, elbow, or foot in three original ways invented purely by YOU.",
        "Why does testing three ways with your own hands and mind BEFORE asking an adult for help make your brain grow stronger?",
        "Seriphia says: Independent thinking doesn't mean never asking for help — it means trusting your own curious hands to explore first!",
    ),
    (
        5, 2, "S-7", "The Same Fair Kitchen Rule for Me",
        "Consistency", "4. Questions About Viewpoints or Perspectives",
        "80 BPM Mirror-Palm Balance (press palms together evenly left and right)",
        "Think of a sharing or clean-up rule at snack time (like taking an equal slice or wiping crumbs).",
        "Why is it so easy to notice when SOMEONE ELSE breaks a sharing rule, and what does true Vitalis integrity ask us to check about ourselves?",
        "Seriphia says: Intellectual integrity means holding ourselves to the exact same fair yardstick we hold up for our friends!",
    ),
    (
        5, 3, "S-8", "Two Vitalis Breaths When Puzzles Wobble",
        "Depth", "5. Questions that Probe Implications & Consequences",
        "100 BPM Cadet Reset: Freeze -> Hand on Heart -> 2 Slow Breaths -> Steady Pulse",
        "Try tapping your head with one hand while rubbing your tummy in circles with the other — pause, breathe, and try slower!",
        "When a tricky rhythm or math puzzle wobbles on try number one, what helpful clue did that wobble teach your hands for try number two?",
        "Seriphia says: Mistakes are never stop signs in Vitalis — after one calm breath, every wobble becomes a clue!",
    ),
    (
        5, 4, "S-9", "Tracing WHY a Strategy Works",
        "Logic", "3. Questions that Probe Reasons, Evidence & Causes",
        "92 BPM Step-by-Step March ('First we check, next we test, then we know!')",
        "Group 10 small items (beans, coins, or blocks) first in a messy heap, then into two neat rows of 5.",
        "Why did organizing into neat fives make counting faster and more accurate than guessing at a messy pile? Trace the reason!",
        "Seriphia says: When you see WHY a smart strategy works instead of copying blindly, your confidence in reason shines!",
    ),
    (
        5, 5, "S-27", "Matching Our Promise With Our Practice",
        "Consistency", "2. Questions that Probe Assumptions",
        "96 BPM Sovereign Statue Freeze Check on the Beat Stop",
        "Compare saying 'I'm sorry!' super fast while rushing past versus stopping gently to help rebuild what fell.",
        "How can we notice when the words we SAY ('I play fairly') don't quite match what our hands ACTUALLY did — and repair the gap?",
        "Seriphia says: Champions align their real everyday actions with their highest ideals — one honest repair at a time.",
    ),

    # ── WEEK 6: Inventions & Discoveries ────────────────────────────────────
    (
        6, 1, "S-18", "Testing the Root Reason Behind an Idea",
        "Logic", "3. Questions that Probe Reasons, Evidence & Causes",
        "78 BPM Root-and-Branch Tap (tap floor for 'Reasons', reach up for 'Claim')",
        "Compare a small heavy coin and a larger light piece of paper or wooden block in your two hands.",
        "If a friend predicts 'Big things always sink and tiny things always float,' how does comparing a tiny coin and a wooden block test their reason?",
        "Seriphia says: Every invention and explanation stands on reasons — testing those roots keeps our discoveries strong!",
    ),
    (
        6, 2, "S-31", "Clue Basket vs. Tricky Decoy Numbers",
        "Relevance", "6. Questions About the Question",
        "92 BPM Clue Filter: 1 Firm Stomp for Needed Clue, Side-Wave for Decoy Fact",
        "Listen closely: 'Octavia wound 4 brass clocks, wore 2 green ribbons, and fixed 3 sundials. How many timepieces did she tend?'",
        "The fact '2 green ribbons' is completely true — so why did you leave the number 2 OUT when counting Octavia's timepieces?",
        "Seriphia says: Not every true number belongs in your equation! Filtering relevant clues beats blind number-crunching every time.",
    ),
    (
        6, 3, "S-33", "Why Scientists Use Two Matching Jars",
        "Adequacy", "3. Questions that Probe Reasons, Evidence & Causes",
        "76 BPM Two-Hand Comparison Tap (tap left knee for Jar A, right knee for Jar B)",
        "Cup your left hand as 'Sunny Wet Seed Jar A' and your right hand as 'Dry Seed Jar B' side by side.",
        "To prove seeds need water to sprout, why must a scientist test BOTH a watered jar AND an identical dry jar instead of only one jar?",
        "Seriphia says: Fair side-by-side evidence lets nature speak clearly instead of leaving us guessing!",
    ),
    (
        6, 4, "S-25", "Guest & Host: Dialogical Two-Voice Check",
        "Completeness", "4. Questions About Viewpoints or Perspectives",
        "68 BPM Passing-Shell Call-and-Response Sway",
        "Sit on Chair A as a tired traveler arriving in a new town, then move to Chair B as the busy host preparing the room.",
        "What helpful detail does the traveler notice that the host might miss — and how does talking back and forth make hospitality wiser for both?",
        "Seriphia says: Dialogical thinking means letting two honest perspectives converse until a fuller picture appears.",
    ),
    (
        6, 5, "S-34", "The Polyrhythm Contradiction Detector",
        "Consistency", "2. Questions that Probe Assumptions",
        "88 BPM Smooth Pulse vs. Crossed-Wrists 'X' Clash Signal",
        "Tap a steady beat, then cross your wrists in an 'X' if these two claims clash: 'My bag is completely empty' and 'Three apples are inside my bag.'",
        "Why can't two opposite claims both be true in the exact same way at the exact same moment — and what should we check when beats clash?",
        "Seriphia says: Spotting contradictions is like hearing an out-of-tune note — pausing to check restores clear harmony!",
    ),

    # ── WEEK 7: Sound & Story ───────────────────────────────────────────────
    (
        7, 1, "S-21", "Sound-Detective Story Critique",
        "Depth", "3. Questions that Probe Reasons, Evidence & Causes",
        "74 BPM Two-Tap Story Pause ('Wait — does that make sense?')",
        "Think of a classic tale like The Gingerbread Man trusting the clever fox or Goldilocks walking into an empty house.",
        "When we listen like story detectives instead of passive listeners, what hidden warning clue did the Gingerbread Man overlook?",
        "Seriphia says: Critical listeners don't just swallow a story whole — they ask why characters acted and whether clues add up!",
    ),
    (
        7, 2, "S-26", "Weighing Both Sides on the Ocean Scale",
        "Fairmindedness", "4. Questions About Viewpoints or Perspectives",
        "64 BPM Two-Cup Balance Scale Sway (weigh left palm vs. right palm)",
        "Hold out both palms like balance cups for an ocean town: Cup A holds 'Fishermen need boats to feed families'; Cup B holds 'Sea turtles need quiet clean water.'",
        "When two caring groups disagree, how can weighing the strongest clues in BOTH cups help us invent a solution that protects families AND sea life?",
        "Seriphia says: Dialectical thinking weighs competing truths fairly instead of cheering for only one side.",
    ),
    (
        7, 3, "D-3", "Feeling the Invisible Soundwave",
        "Specificity", "3. Questions that Probe Reasons, Evidence & Causes",
        "72 BPM Humming Throat-Touch Observation (hum low, then high)",
        "Rest two gentle fingers on the front of your throat while humming a low giant note and then a high bird note — feel the buzz change!",
        "What tiny difference did your fingertips OBSERVE between a loud hum and total silence, and how does that connect soundwaves to ocean waves?",
        "Seriphia says: Critical observation means training our eyes, ears, and fingertips to catch fine clues rushing minds miss!",
    ),
    (
        7, 4, "D-4", "Painting Exact Pictures With Words",
        "Precision", "1. Questions of Clarification",
        "80 BPM Crisp Articulation Tap (one clean tap per descriptive word)",
        "Close your eyes, touch one textured object nearby (bark, spoon, cloth, or page), and replace the fuzzy word 'nice' with three exact sensory words.",
        "Why does saying 'cool, smooth, golden wooden spoon' help a listener understand your mind so much clearer than saying 'that thing'?",
        "Seriphia says: Precise expression gives your inner thoughts clear wings so every listener sees what you mean!",
    ),
    (
        7, 5, "S-24", "Leading Your Own Socratic Wonder Circle",
        "Depth", "6. Questions About the Question",
        "68 BPM Socratic Talking Drum (4 quiet heartbeats of wait-time between turns)",
        "Invite one family member or friend into a 3-minute circle using a rolled napkin or spoon as the Talking Stick.",
        "Practice being the Socratic Guide! Ask your partner: 'What makes a story unforgettable — and can you give me an example?' Then listen and ask one follow-up 'Why?'",
        "Seriphia says: When YOU ask thoughtful questions and honor quiet thinking time, you light up every mind in the circle!",
    ),

    # ── WEEK 8: Grand Celebration & Launch ──────────────────────────────────
    (
        8, 1, "S-11", "The Golden Yarn Bridge Across Lands",
        "Relevance", "5. Questions that Probe Implications & Consequences",
        "72 BPM Bridge-Sweep Gesture (arc one hand from left knee to right knee)",
        "Point to a seed picture from Terrasol and a music/handwriting page from Harmonia, drawing an invisible golden bridge between them.",
        "How is watering a tiny seed a little bit every morning JUST LIKE practicing a hard word, math count, or friendship skill each day?",
        "Seriphia says: Analogous transfer lets wisdom earned in one Land shine brightly in brand-new adventures!",
    ),
    (
        8, 2, "S-12", "Yesterday, Today & Tomorrow's Wiser Eyes",
        "Significance", "4. Questions About Viewpoints or Perspectives",
        "72 BPM Three-Time Waltz Sway: 'Yesterday (left) — Today (center) — Tomorrow (right)'",
        "Flip back briefly to Week 1 Day 1 and compare your very first page with your work here in Week 8.",
        "What is one skill or idea you understand clearly TODAY that felt tricky or unfamiliar back in Week 1 — and how did your perspective grow?",
        "Seriphia says: Strong thinkers celebrate how their understanding deepens across seasons of patient practice!",
    ),
    (
        8, 3, "S-23", "Weaving All Seven Lands Into One World",
        "Completeness", "5. Questions that Probe Implications & Consequences",
        "84 BPM Seven-Finger Constellation Count (raise 7 fingers for 7 Lands)",
        "Touch 5 fingers as you connect one everyday event — baking bread or tending a garden — across Words, Numbers, Science, Movement, and Sharing.",
        "How do Harmonia's words, Numeria's measurements, Terrasol's plants, Vitalis's muscles, and Aquaria's kindness all work TOGETHER inside one family meal?",
        "Seriphia says: School subjects aren't separate boxes — in the real world, all 7 Lands sing one connected symphony!",
    ),
    (
        8, 4, "S-35", "Four-Star Consequence Ripples Into Tomorrow",
        "Significance", "5. Questions that Probe Implications & Consequences",
        "76 BPM Domino Clap Ripple (4 escalating claps from soft to bright)",
        "Tap four invisible stars across your desk from left to right: Choice -> Ripple 1 -> Ripple 2 -> Community Gift.",
        "Trace the four-step consequence chain: if you share a kind question or help a younger learner today, what ripple happens second, third, and fourth?",
        "Seriphia says: Looking ahead at consequences before we leap turns everyday choices into lasting Celestia starlight!",
    ),
    (
        8, 5, "S-ALL", "The Sovereign Fairminded Thinker's Pledge",
        "Fairmindedness", "6. Questions About the Question",
        "88 BPM Grand Champion Heart-Tap-Clap-Open-Arms Cadence",
        "Stand tall with hands over your heart, take one calm breath, and speak the Sovereign Thinker's Pledge aloud to someone you love.",
        "Speak & reflect: 'I observe closely, ask brave questions, check my assumptions, listen fairly to every shore, and test ideas with care!' Which thinking superpower will you carry forward first?",
        "Seriphia says: Crafted with love and earned through 40 days of rhythm and reason — the 7 Lands and fairminded wisdom shine inside you now!",
    ),
]


def build_40_day_block_k_map() -> Dict[Tuple[int, int], WorkbookBlockK]:
    """Build and deterministically validate all 40 daily Block K entries."""
    lookup = _build_strategy_lookup()
    valid_standards = {item["standard"] for item in INTELLECTUAL_STANDARDS}
    valid_categories = {item["category"] for item in SOCRATIC_TAXONOMY}

    schedule: Dict[Tuple[int, int], WorkbookBlockK] = {}
    seen_codes: set[str] = set()

    for (
        week,
        day,
        code,
        short_title,
        standard,
        soc_cat,
        rhythm_cue,
        tactile_spark,
        socratic_q,
        tip,
    ) in _RAW_40_DAY_SPECS:
        if (week, day) in schedule:
            raise ValueError(f"Duplicate week/day in Block K schedule: W{week}D{day}")
        if code in seen_codes:
            raise ValueError(f"Duplicate strategy code in 40-day Block K schedule: {code}")
        if code not in lookup:
            raise ValueError(f"Unknown strategy code: {code}")
        if standard not in valid_standards:
            raise ValueError(f"Invalid Intellectual Standard '{standard}' at W{week}D{day}")
        if soc_cat not in valid_categories:
            raise ValueError(f"Invalid Socratic Category '{soc_cat}' at W{week}D{day}")

        seen_codes.add(code)
        meta = lookup[code]
        schedule[(week, day)] = WorkbookBlockK(
            title=f"Socratic Spark: {short_title}",
            time=3,
            strategy_code=code,
            strategy_name=meta["strategy_name"],
            intellectual_standard=standard,
            socratic_category=soc_cat,
            land=meta["land"],
            land_class=meta["land_class"],
            land_name=meta["land_name"],
            hero_guides=meta["hero_guides"],
            char_img="seriphia.png",
            rhythm_cue=rhythm_cue,
            tactile_spark=tactile_spark,
            socratic_question=socratic_q,
            tip=tip,
            standard_alignment=meta["standard_alignment"],
        )

    expected_codes = {f"S-{i}" for i in range(1, 36)} | {f"D-{i}" for i in range(1, 5)} | {"S-ALL"}
    if seen_codes != expected_codes:
        missing = expected_codes - seen_codes
        extra = seen_codes - expected_codes
        raise ValueError(f"40-day Block K bijection mismatch! Missing={missing}, Extra={extra}")

    return schedule


def export_block_k_schedule_list() -> List[Dict[str, Any]]:
    """Return a JSON-serializable 40-entry list ordered W1D1..W8D5 for foundation exports."""
    schedule = build_40_day_block_k_map()
    out: List[Dict[str, Any]] = []
    for (week, day), entry in sorted(schedule.items()):
        row = {"week": week, "day": day}
        row.update(entry.model_dump())
        out.append(row)
    return out


def apply_block_k_to_workbook(
    workbook_json_path: Path,
    foundation_json_path: Optional[Path] = None,
    write: bool = True,
) -> Dict[str, Any]:
    """
    Inject and validate all 40 daily Block K ('Seriphia's Socratic Spark') entries
    into workbook_content.json, optionally cross-checking against soe_critical_thinking_foundation.json.
    """
    schedule = build_40_day_block_k_map()

    if foundation_json_path and foundation_json_path.exists():
        foundation = json.loads(foundation_json_path.read_text(encoding="utf-8"))
        foundation_codes = (
            {s["code"] for s in foundation.get("strategies_35", [])}
            | {d["code"] for d in foundation.get("supplemental_dimensions_4", [])}
            | {"S-ALL"}
        )
        scheduled_codes = {e.strategy_code for e in schedule.values()}
        if scheduled_codes != foundation_codes:
            raise ValueError("Block K codes do not match soe_critical_thinking_foundation.json!")

    content = json.loads(workbook_json_path.read_text(encoding="utf-8-sig"))
    weeks = content.get("weeks", [])
    total_days = 0

    for w_obj in weeks:
        wn = int(w_obj["week"])
        for d_obj in w_obj.get("days", []):
            dn = int(d_obj["day"])
            key = (wn, dn)
            if key not in schedule:
                raise ValueError(f"Workbook contains unexpected day W{wn}D{dn} not in 40-day schedule.")
            d_obj.setdefault("blocks", {})["K"] = schedule[key].model_dump()
            expected_blocks = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"}
            actual_blocks = set(d_obj["blocks"].keys())
            if actual_blocks != expected_blocks:
                raise ValueError(f"Day W{wn}D{dn} blocks mismatch: {actual_blocks} vs {expected_blocks}")
            total_days += 1

    if total_days != 40:
        raise ValueError(f"Expected 40 workbook days, found {total_days}.")

    if write:
        workbook_json_path.write_text(
            json.dumps(content, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    return {
        "days_updated": total_days,
        "blocks_per_day": 11,
        "total_activities": total_days * 11,
        "unique_strategies_wired": len(schedule),
    }

