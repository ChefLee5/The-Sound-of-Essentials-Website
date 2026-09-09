"""
Standards crosswalk for Head Start ELOF, NAEYC, and Kindergarten Readiness.
"""

from typing import Dict, List
from soe_curriculum.models import StandardsCrosswalk

# Track-specific crosswalk mappings
STANDARDS_CATALOG: Dict[str, StandardsCrosswalk] = {
    "drill-time": StandardsCrosswalk(
        elof_codes=["P-PMP 1 (Gross Motor)", "P-ATL 2 (Executive Function/Inhibition)", "P-SE 1 (Emotional Regulation)"],
        elof_domains=["Perceptual, Motor, and Physical Development", "Approaches to Learning", "Social and Emotional Development"],
        naeyc_standards=["2.C.04 (Gross Motor & Bilateral Coordination)", "2.A.10 (Movement & Multimodal Arts)", "2.L.01 (Self-Regulation)"],
        kindergarten_readiness="Demonstrates controlled bilateral midline crossing, auditory rhythm following, and rapid physical inhibition ('freeze' command)."
    ),
    "lets-stretch": StandardsCrosswalk(
        elof_codes=["P-PMP 2 (Body Awareness/Proprioception)", "P-ATL 1 (Attention and Persistence)", "IT-PMP 3 (Spatial Relations)"],
        elof_domains=["Perceptual, Motor, and Physical Development", "Approaches to Learning"],
        naeyc_standards=["2.C.02 (Body Awareness & Flexibility)", "2.K.01 (Health & Respiration Practices)"],
        kindergarten_readiness="Executes intentional deep diaphragmatic breathing and multi-plane stretching to down-regulate sympathetic nervous arousal."
    ),
    "numbers": StandardsCrosswalk(
        elof_codes=["P-MATH 1 (Number Words & Counting)", "P-MATH 2 (Cardinality)", "P-ATL 4 (Auditory Pattern Following)"],
        elof_domains=["Cognition: Mathematics", "Approaches to Learning"],
        naeyc_standards=["2.F.01 (Number Sense & Quantity)", "2.F.03 (1-to-1 Correspondence)", "2.J.03 (Rhythmic Cadence)"],
        kindergarten_readiness="Accurately pairs physical percussion (claps/foot taps) 1-to-1 with spoken numeral sequence from 1 to 10."
    ),
    "days-of-the-week": StandardsCrosswalk(
        elof_codes=["P-SCI 4 (Cycles & Predictable Patterns)", "P-LC 4 (Vocabulary & Sequence)", "P-MATH 6 (Temporal Relations)"],
        elof_domains=["Cognition: Scientific Inquiry", "Language and Communication", "Cognition: Mathematics"],
        naeyc_standards=["2.G.02 (Time Cycles & Seasons)", "2.D.03 (Sequencing Language)"],
        kindergarten_readiness="Recalls temporal calendar sequence through melodic memory; articulates days in forward ordinal order."
    ),
    "alphabet-song-remix": StandardsCrosswalk(
        elof_codes=["P-LIT 1 (Phonological Awareness)", "P-LIT 3 (Letter Knowledge)", "P-LC 2 (Expressive Auditory Phonics)"],
        elof_domains=["Literacy", "Language and Communication"],
        naeyc_standards=["2.D.04 (Alphabet Knowledge)", "2.B.02 (Phoneme Segmentation)"],
        kindergarten_readiness="Segments letter sounds with distinct rhythmic phrasing; identifies letter name-sound associations through syncopated beat."
    ),
    "horses-interlude": StandardsCrosswalk(
        elof_codes=["P-SCI 1 (Living Things)", "P-ATL 5 (Humor & Cognitive Flexibility)", "P-LC 5 (Descriptive Categorization)"],
        elof_domains=["Cognition: Scientific Inquiry", "Approaches to Learning", "Language and Communication"],
        naeyc_standards=["2.G.05 (Animal Characteristics & Habitats)", "2.B.03 (Critical Listening)"],
        kindergarten_readiness="Differentiates domestic animal attributes (equine vs. livestock) using auditory cues and morphological vocabulary."
    ),
    "le-cheval": StandardsCrosswalk(
        elof_codes=["P-LC 7 (Dual Language / Global Phonemes)", "P-SCI 1 (Animal Observation)", "P-PMP 1 (Locomotor Trot/Gallop)"],
        elof_domains=["Language and Communication", "Cognition: Science", "Physical Development"],
        naeyc_standards=["2.B.07 (World Languages & Cultural Soundscapes)", "2.C.04 (Galloping & Locomotor Rhythm)"],
        kindergarten_readiness="Discriminates non-native phonemic sound patterns (French vocabulary); mimics equine gait (trot, canter, gallop) with physical coordination."
    ),
    "my-body": StandardsCrosswalk(
        elof_codes=["P-PMP 2 (Anatomical Body Awareness)", "P-SCI 3 (Human Body & Nutrition)", "P-LC 4 (Specific Anatomical Lexicon)"],
        elof_domains=["Perceptual, Motor, and Physical Development", "Cognition: Science", "Language"],
        naeyc_standards=["2.K.02 (Human Body Structures)", "2.C.02 (Somatosensory Mapping)"],
        kindergarten_readiness="Locates and names major anatomical joints and sensory organs; connects physical nutrition to energy and body vitality."
    ),
    "manners": StandardsCrosswalk(
        elof_codes=["P-SE 3 (Prosocial Behavior & Empathy)", "P-LC 6 (Pragmatic Conversational Courtesy)", "P-ATL 3 (Cooperative Play)"],
        elof_domains=["Social and Emotional Development", "Language and Communication"],
        naeyc_standards=["2.L.02 (Prosocial Communication)", "2.B.04 (Reciprocal Conversation Etiquette)"],
        kindergarten_readiness="Applies situational courtesy formulas ('Please', 'Thank you', 'Excuse me') in peer interactions without prompting."
    ),
    "seasons": StandardsCrosswalk(
        elof_codes=["P-SCI 4 (Weather, Seasons & Earth Systems)", "P-MATH 6 (Cyclical Time)", "P-LC 5 (Descriptive Adjectives)"],
        elof_domains=["Cognition: Science", "Cognition: Mathematics", "Language"],
        naeyc_standards=["2.G.04 (Earth & Sky Observations)", "2.D.02 (Environmental Lexicon)"],
        kindergarten_readiness="Identifies characteristics of the four seasons and links temperature changes to animal/plant life cycles."
    ),
    "months-of-the-year": StandardsCrosswalk(
        elof_codes=["P-MATH 6 (Temporal Ordering)", "P-LC 4 (Auditory Recall)", "P-LIT 2 (Chanted Syllabic Meter)"],
        elof_domains=["Cognition: Mathematics", "Language and Communication"],
        naeyc_standards=["2.F.05 (Calendar & Sequencing)", "2.B.05 (Melodic Memorization)"],
        kindergarten_readiness="Orders 12-month calendar progression through rhythmic recall and connects months to personal milestones."
    ),
    "shapes": StandardsCrosswalk(
        elof_codes=["P-MATH 8 (2D/3D Geometric Shapes)", "P-PMP 3 (Fine Motor Shape Tracing)", "P-ATL 4 (Visual-Spatial Analysis)"],
        elof_domains=["Cognition: Mathematics", "Physical Development"],
        naeyc_standards=["2.F.04 (Geometry & Spatial Reasoning)", "2.C.03 (Tactile Form Exploration)"],
        kindergarten_readiness="Identifies circles, triangles, rectangles, and hexagons in real-world environments by side and vertex counts."
    ),
    "colors": StandardsCrosswalk(
        elof_codes=["P-SCI 2 (Visual Discrimination & Optics)", "P-ATL 1 (Attentive Visual Sorting)", "P-LC 4 (Chromatic Lexicon)"],
        elof_domains=["Cognition: Science", "Approaches to Learning", "Language"],
        naeyc_standards=["2.G.03 (Light, Pigment & Color Mixing)", "2.J.01 (Visual Arts)"],
        kindergarten_readiness="Names primary and secondary colors; predicts color mixing outcomes through sensory hands-on paint/clay blending."
    ),
    "feelings": StandardsCrosswalk(
        elof_codes=["P-SE 1 (Emotional Self-Awareness)", "P-SE 2 (Expressing Complex Emotions)", "P-LC 4 (Affective Vocabulary)"],
        elof_domains=["Social and Emotional Development", "Language and Communication"],
        naeyc_standards=["2.L.01 (Emotional Expression & Labeling)", "2.L.03 (Empathic Peer Recognition)"],
        kindergarten_readiness="Labels own emotional state (calm, excited, frustrated) and demonstrates healthy coping/breathing mechanisms."
    ),
    "opposite-words": StandardsCrosswalk(
        elof_codes=["P-LC 5 (Comparative Vocabulary & Antonyms)", "P-ATL 4 (Relational Thinking)", "P-PMP 2 (Oppositional Movement)"],
        elof_domains=["Language and Communication", "Cognition", "Physical Development"],
        naeyc_standards=["2.B.03 (Vocabulary Contrasts)", "2.C.04 (High/Low, Fast/Slow Movement)"],
        kindergarten_readiness="Comprehends and uses paired conceptual opposites (big/small, high/low, loud/soft) in expressive speech and movement."
    ),
    "time": StandardsCrosswalk(
        elof_codes=["P-MATH 6 (Clock Awareness & Duration)", "P-SCI 4 (Day/Night Diurnal Cycle)", "P-ATL 2 (Delayed Gratification)"],
        elof_domains=["Cognition: Mathematics", "Cognition: Science"],
        naeyc_standards=["2.F.05 (Measurement of Time)", "2.G.02 (Solar Cycles)"],
        kindergarten_readiness="Understands relative time durations (minutes vs. hours) and recognizes clock face mechanisms and daily schedules."
    ),
    "thank-you": StandardsCrosswalk(
        elof_codes=["P-SE 3 (Gratitude & Social Bonding)", "P-LC 6 (Interpersonal Communication)", "P-ATL 1 (Reflective Grounding)"],
        elof_domains=["Social and Emotional Development", "Language"],
        naeyc_standards=["2.L.04 (Classroom Community Harmony)", "2.B.06 (Reciprocal Appreciation)"],
        kindergarten_readiness="Expresses authentic gratitude to peers and caregivers, strengthening social belonging and prosocial classroom culture."
    ),
    "sunny-day": StandardsCrosswalk(
        elof_codes=["P-SCI 4 (Weather Observation & Solar Energy)", "P-PMP 2 (Morning Sensory Awakening)", "P-SE 1 (Optimism)"],
        elof_domains=["Cognition: Science", "Perceptual & Motor", "Social-Emotional"],
        naeyc_standards=["2.G.04 (Meteorological Observation)", "2.K.01 (Circadian Health)"],
        kindergarten_readiness="Observes and articulates atmospheric conditions; engages in morning greeting rituals with enthusiasm."
    ),
    "goodnight-terrasol": StandardsCrosswalk(
        elof_codes=["P-SE 1 (Somatic Down-Regulation)", "P-PMP 2 (Parasympathetic Calming)", "P-SCI 4 (Nocturnal Nature)"],
        elof_domains=["Social and Emotional Development", "Physical Development", "Science"],
        naeyc_standards=["2.L.01 (Restorative Calming Practices)", "2.K.03 (Rest & Sleep Health)"],
        kindergarten_readiness="Self-regulates physical stillness, releases muscle tension, and prepares for rest using gentle acoustic lullaby rhythm."
    )
}


def get_standards_for_track(track_slug: str) -> StandardsCrosswalk:
    """Return specific standards crosswalk or default universal mapping."""
    slug_clean = track_slug.lower().strip()
    if slug_clean in STANDARDS_CATALOG:
        return STANDARDS_CATALOG[slug_clean]

    # Universal 5-domain fallback crosswalk
    return StandardsCrosswalk(
        elof_codes=["P-LC 1 (Communication)", "P-PMP 1 (Physical Movement)", "P-ATL 1 (Engagement)"],
        elof_domains=["Language and Communication", "Physical Development", "Approaches to Learning"],
        naeyc_standards=["2.A.10 (Creative Arts & Movement)", "2.B.02 (Language Exploration)"],
        kindergarten_readiness="Actively participates in screen-free multi-sensory rhythm rituals and articulates key conceptual observations."
    )
