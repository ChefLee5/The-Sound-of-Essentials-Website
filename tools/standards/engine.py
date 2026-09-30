"""
Core Standards Crosswalk Engine for The Sound of Essentials: Rhythm Quest.
Ingests canonical tracks and builds verifiable multi-institutional alignments across:
- Head Start ELOF (all 7 domains)
- NAEYC Early Learning Standards
- 50-State Early Learning Frameworks (with emphasis on the 28 Approved-List states)
"""

import json
import os
from typing import List, Dict, Optional
from pathlib import Path

from tools.standards.models import TrackAlignment, NeurologicalImpact
from tools.standards.state_registry import STATES_REGISTRY, get_state, get_states_by_tier

# Canonical track crosswalk metadata with deep neurological and pedagogical proofs
TRACK_STANDARDS_MAPPING: List[Dict] = [
    {
        "track_id": 1,
        "slug": "sunny-day",
        "title": "Sunny Day (Intro)",
        "land": "Terrasol",
        "bpm": 96,
        "primary_domain": "Social-Emotional & Approaches to Learning",
        "elof_codes": ["P-ATL.1", "P-SE.1"],
        "naeyc_codes": ["2.D", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.SED.1"],
            "FL": ["FL-FELDS.I.A"],
            "GA": ["GELDS.SED.1"],
            "NY": ["NY-ELG.SED.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Acoustic Entrainment (96 BPM) to synchronize heart rate variability and down-regulate sympathetic nervous system activity.",
            developmental_readiness="Prepares auditory processing centers for receptive language; reduces transition anxiety into morning circle time.",
            classroom_application="Morning arrival anchor ritual; replaces shouting or visual digital noise with calming acoustic resonance.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "10-min sunlight stretch: Children hold warm polished stones while synchronizing deep breaths with the guitar pulse.",
        "target_skills": ["Transition Self-Regulation", "Acoustic Attending", "Morning Orientation"]
    },
    {
        "track_id": 2,
        "slug": "days-of-the-week",
        "title": "Days of the Week",
        "land": "Celestia",
        "bpm": 108,
        "primary_domain": "Mathematics & Temporal Cognition",
        "elof_codes": ["P-MATH.8", "P-LC.2"],
        "naeyc_codes": ["2.F", "2.B"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "FL": ["FL-FELDS.V.A"],
            "NC": ["NC-FELD.CD.1"],
            "MI": ["MI-ECSQ.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Sequential Auditory Memory encoding via 7-beat melodic loop anchoring temporal cyclical structures in hippocampus.",
            developmental_readiness="Builds chronological ordering, past/present/future conceptualization, and verbal sequencing stamina.",
            classroom_application="Daily calendar transition; replaces rote drill cards with an embodied 7-step rhythmic cadence.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "7-stone day path: Children physically step or hop across 7 numbered floor tiles matching the sung cadence.",
        "target_skills": ["Temporal Sequencing", "Sequential Memory", "Calendar Literacy"]
    },
    {
        "track_id": 3,
        "slug": "alphabet-song-remix",
        "title": "Alphabet Song Remix",
        "land": "Harmonia",
        "bpm": 102,
        "primary_domain": "Language & Emergent Literacy",
        "elof_codes": ["P-LIT.1", "P-LIT.3"],
        "naeyc_codes": ["2.B", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.III.A"],
            "CA": ["CA-PTKLF.LLD.3"],
            "FL": ["FL-FELDS.IV.A"],
            "VA": ["VA-ELDS.LIT.1"],
            "OH": ["OH-ELDS.LIT.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Phonemic segmentation breakdown (A-A-A, B-B-B) isolating individual phonemes to sharpen auditory cortical discrimination.",
            developmental_readiness="Prevents the 'L-M-N-O-P' blur; primes vocal articulators for reading readiness and letter-sound correspondence.",
            classroom_application="Core phonemic awareness drill; screen-free letter recognition with clapping staccato accents.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Sandpaper letter tracing: Children trace tactile letter cards with index finger in sync with the staccato triplets.",
        "target_skills": ["Phonemic Segmentation", "Alphabet Mastery", "Auditory Discrimination"]
    },
    {
        "track_id": 4,
        "slug": "horses-interlude",
        "title": "Horses Interlude",
        "land": "Terrasol",
        "bpm": 92,
        "primary_domain": "Scientific Inquiry & Auditory Discrimination",
        "elof_codes": ["P-SCI.2", "P-LC.1"],
        "naeyc_codes": ["2.G", "2.B"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "TN": ["TN-ELDS.SCI.1"],
            "AR": ["AR-CDELS.SCI.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Cognitive dissonance resolution through playful non-examples (donkey, pig, sheep, cat) stimulating executive categorization.",
            developmental_readiness="Enhances selective auditory attention, taxonomic sorting, and humor-driven cognitive engagement.",
            classroom_application="Living systems animal classification game; sparks verbal reasoning during circle time discussions.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Animal figurine sorting: Children sort miniature animals into 'Horse' vs 'Not a Horse' baskets upon hearing dialogue cues.",
        "target_skills": ["Biological Classification", "Critical Listening", "Category Discrimination"]
    },
    {
        "track_id": 5,
        "slug": "le-cheval",
        "title": "Le Cheval",
        "land": "Luminosity",
        "bpm": 100,
        "primary_domain": "Language & Multilingual Sensitivity",
        "elof_codes": ["P-LC.4", "P-LC.3"],
        "naeyc_codes": ["2.B", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "LA": ["LA-B5.LLD.1"],
            "NY": ["NY-ELG.LLD.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Foreign phonemic mapping expanding phonetic perceptual boundaries before the synaptogenesis pruning window closes (~age 7).",
            developmental_readiness="Instills native-like ear for French vowel nasals and cadences; builds cognitive flexibility and global empathy.",
            classroom_application="Multilingual circle time; children embody French gait terminology (marche, trot, galop) through movement.",
            vagal_regulation=False,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "Equestrian gait ribbons: Children wave silk ribbons in high, medium, and fast arcs matching 'marche, trot, galop'.",
        "target_skills": ["Multilingual Phonology", "Cognitive Flexibility", "Descriptive Vocabulary"]
    },
    {
        "track_id": 6,
        "slug": "lets-stretch",
        "title": "Let's Stretch",
        "land": "Vitalis",
        "bpm": 98,
        "primary_domain": "Physical Development & Somatic Regulation",
        "elof_codes": ["P-PMP.1", "P-ATL.1"],
        "naeyc_codes": ["2.C", "2.D"],
        "state_codes": {
            "TX": ["TX-TPG.IX.A"],
            "CA": ["CA-PTKLF.PD.1"],
            "FL": ["FL-FELDS.I.A"],
            "GA": ["GELDS.PD.1"],
            "MI": ["MI-ECSQ.PD.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Vestibular stimulation and bilateral midline crossing activating the corpus callosum for hemisphere integration.",
            developmental_readiness="Enhances proprioceptive feedback, spinal elongation, diaphragmatic lung capacity, and stress reduction.",
            classroom_application="Pre-seatwork motor primer; grounds restless energy before writing or focused reading blocks.",
            vagal_regulation=True,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "Toe-touch cloud reach: Children pair nasal inhalation with vertical reaching and mouth exhalation with floor tapping.",
        "target_skills": ["Bilateral Midline Crossing", "Proprioception", "Diaphragmatic Breathing"]
    },
    {
        "track_id": 7,
        "slug": "drill-time",
        "title": "Drill Time",
        "land": "Vitalis",
        "bpm": 104,
        "primary_domain": "Physical Coordination & Motor Planning",
        "elof_codes": ["P-PMP.2", "P-PMP.1", "P-ATL.2"],
        "naeyc_codes": ["2.C", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.IX.A"],
            "CA": ["CA-PTKLF.PD.1"],
            "FL": ["FL-FELDS.I.A"],
            "OH": ["OH-ELDS.PD.1"],
            "PA": ["PA-ELS.PD.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Contralateral locomotor march and cross-lateral limb isolation stimulating motor cortex cerebellar pathways.",
            developmental_readiness="Develops left/right bodily differentiation, auditory-motor reaction timing, and aerobic stamina.",
            classroom_application="High-energy reset ritual; channels active physical excitement into disciplined, joyful coordination.",
            vagal_regulation=False,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "Knuckle-step cadence: Children march in rhythm while tapping alternating opposite knees (left hand to right knee).",
        "target_skills": ["Contralateral Marching", "Left/Right Differentiation", "Rhythmic Synchronization"]
    },
    {
        "track_id": 8,
        "slug": "numbers",
        "title": "Numbers",
        "land": "Numeria",
        "bpm": 105,
        "primary_domain": "Mathematics & Numerical Cognition",
        "elof_codes": ["P-MATH.1", "P-PMP.2"],
        "naeyc_codes": ["2.F", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "FL": ["FL-FELDS.V.A"],
            "IN": ["IN-IELS.M.1"],
            "IL": ["IL-IELDS.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Kinesthetic-Auditory 1-to-1 Correspondence: associating discrete motor claps with verbalized numerical symbols.",
            developmental_readiness="Solidifies cardinality (understanding the last counted number represents total quantity 1 to 10).",
            classroom_application="Core numeracy circle; transitions counting from abstract memorization to visceral physical experience.",
            vagal_regulation=False,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "Bead-counter clap: Children clap hands then slide matching wooden beads across a counting string 1 through 10.",
        "target_skills": ["One-to-One Correspondence", "Cardinality", "Motor Synchronization"]
    },
    {
        "track_id": 9,
        "slug": "my-body",
        "title": "My Body",
        "land": "Terrasol",
        "bpm": 98,
        "primary_domain": "Science, Health & Somatosensory Awareness",
        "elof_codes": ["P-SCI.2", "P-PMP.1"],
        "naeyc_codes": ["2.G", "2.C"],
        "state_codes": {
            "TX": ["TX-TPG.IX.A"],
            "CA": ["CA-PTKLF.PD.1"],
            "FL": ["FL-FELDS.I.A"],
            "AL": ["AL-AELG.PD.1"],
            "SC": ["SC-ELS.PD.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Somatosensory cortical mapping: activating parietal lobe body schema through sequential anatomical self-touch.",
            developmental_readiness="Builds spatial self-awareness, anatomical vocabulary, and positive health habits (living foods, hydration).",
            classroom_application="Morning body check-in; connects physical wellness, healthy choices, and calm bodily respect.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Top-to-toe body tap: Children lightly tap facial features, upper limbs, and lower joints in anatomical sequence.",
        "target_skills": ["Body Schema Awareness", "Anatomical Vocabulary", "Health & Living Foods"]
    },
    {
        "track_id": 10,
        "slug": "manners",
        "title": "Manners",
        "land": "Harmonia",
        "bpm": 94,
        "primary_domain": "Social-Emotional Development & Prosocial Etiquette",
        "elof_codes": ["P-SE.2", "P-LC.2"],
        "naeyc_codes": ["2.D", "2.B"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.SED.1"],
            "NY": ["NY-ELG.SED.1"],
            "NJ": ["NJ-PTLS.SED.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Mirror neuron activation for reciprocal social exchanges, reducing peer conflict via rhythmic polite scripts.",
            developmental_readiness="Instills spontaneous empathy, perspective taking, gratitude expression, and conversational turn-taking.",
            classroom_application="Snack time and shared play transition ritual; establishes harmonious classroom community culture.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Polite pass circle: Children pass a wooden heart to their neighbor saying 'Please' and receiving with 'Thank You'.",
        "target_skills": ["Prosocial Etiquette", "Empathy Expression", "Conversational Courtesy"]
    },
    {
        "track_id": 11,
        "slug": "time",
        "title": "Time",
        "land": "Celestia",
        "bpm": 100,
        "primary_domain": "Mathematics & Circadian Routine Sequencing",
        "elof_codes": ["P-MATH.8", "P-ATL.2"],
        "naeyc_codes": ["2.F", "2.D"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "FL": ["FL-FELDS.V.A"],
            "AZ": ["AZ-AZELS.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Temporal interval estimation linking abstract clock numerals with concrete circadian routines (wake, lunch, bed).",
            developmental_readiness="Demystifies analog clock faces and half-hour intervals; reduces behavior dysregulation by clarifying daily schedules.",
            classroom_application="Daily visual schedule review; anchors transition points in children's temporal mental models.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Clock arm movement: Children use their bodies as clock hands, pointing one arm straight up and one out.",
        "target_skills": ["Clock Concept Awareness", "Circadian Routine Planning", "Temporal Logic"]
    },
    {
        "track_id": 12,
        "slug": "changes",
        "title": "Changes",
        "land": "Terrasol",
        "bpm": 92,
        "primary_domain": "Science, Meteorology & Emotional Permanence",
        "elof_codes": ["P-SCI.1", "P-SE.1"],
        "naeyc_codes": ["2.G", "2.D"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.SED.1"],
            "CO": ["CO-ELDG.SCI.1"],
            "WA": ["WA-ELDG.SCI.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Distinguishing mutable environmental phenomena (weather) from immutable social-emotional security (unconditional care).",
            developmental_readiness="Builds emotional resilience, weather observation skills, and security in the face of sudden life changes.",
            classroom_application="Weather reporting station; provides comfort during rainy or stormy classroom days.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Weather window wheel: Children rotate a tactile dial between sun, rain, and snow, concluding with hand over heart.",
        "target_skills": ["Weather Observation", "Emotional Permanence", "Resilience Building"]
    },
    {
        "track_id": 13,
        "slug": "one-hundred",
        "title": "One Hundred",
        "land": "Numeria",
        "bpm": 106,
        "primary_domain": "Mathematics & Extended Counting Stamina",
        "elof_codes": ["P-MATH.1", "P-ATL.2"],
        "naeyc_codes": ["2.F", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "FL": ["FL-FELDS.V.A"],
            "MD": ["MD-ELS.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Decade-based chunking (10s to 100) fostering working memory capacity and long-chain rhythmic sequence retention.",
            developmental_readiness="Establishes base-10 intuitive foundations and kindergarten numerical benchmark readiness.",
            classroom_application="100th day of school celebrations and physical hundred-step math drills.",
            vagal_regulation=False,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "100-button abacus: Children move clusters of 10 smooth buttons across a counting board with every 10-count beat.",
        "target_skills": ["Decade Counting", "Base-10 Intuition", "Working Memory Stamina"]
    },
    {
        "track_id": 14,
        "slug": "the-ocean",
        "title": "The Ocean",
        "land": "Aquaria",
        "bpm": 90,
        "primary_domain": "Science, Fluid Motion & Somatic Calm",
        "elof_codes": ["P-SCI.1", "P-PMP.1", "P-ATL.1"],
        "naeyc_codes": ["2.G", "2.C", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.IX.A"],
            "CA": ["CA-PTKLF.PD.1"],
            "MA": ["MA-ELG.SCI.1"],
            "HI": ["HI-HELDS.SCI.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Slow undulating tempo (90 BPM) activating parasympathetic nervous system response through wave imagery.",
            developmental_readiness="Fosters whole-body fluid motor coordination, breath pacing, and sensory oceanic imagination.",
            classroom_application="Rest time or sensory transition; calms agitated classrooms through gentle wave-motion breathing.",
            vagal_regulation=True,
            bilateral_integration=True
        ),
        "tactile_extension_summary": "Blue silk wave pass: Children hold edges of a light blue silk cloth, gently rippling it up and down in ocean rhythm.",
        "target_skills": ["Fluid Motor Control", "Parasympathetic Calming", "Marine Ecosystems"]
    },
    {
        "track_id": 15,
        "slug": "hard-words",
        "title": "Hard Words",
        "land": "Luminosity",
        "bpm": 95,
        "primary_domain": "Language & Multisyllabic Articulation",
        "elof_codes": ["P-LC.3", "P-LIT.1"],
        "naeyc_codes": ["2.B", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.III.A"],
            "CA": ["CA-PTKLF.LLD.3"],
            "FL": ["FL-FELDS.IV.A"],
            "KY": ["KY-KECS.LIT.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Slowed speech pacing and syllable tapping breaking multisyllabic hurdles into manageable articulatory chunks.",
            developmental_readiness="Conquers childhood speech hesitation, strengthens oral motor control, and introduces state geography.",
            classroom_application="Speech therapy integration and morning vocabulary drill; removes fear of long unfamiliar words.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Syllable drum tap: Children tap wooden spoons on soft pads for each syllable (Oc-to-pus, Lou-i-si-an-a).",
        "target_skills": ["Multisyllabic Segmentation", "Articulatory Confidence", "Geographic Vocabulary"]
    },
    {
        "track_id": 16,
        "slug": "shapes",
        "title": "Shapes",
        "land": "Numeria",
        "bpm": 102,
        "primary_domain": "Mathematics & Geometric Spatial Reasoning",
        "elof_codes": ["P-MATH.9", "P-PMP.3"],
        "naeyc_codes": ["2.F", "2.C"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "MO": ["MO-MELS.M.1"],
            "WI": ["WI-WMELS.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Visual-spatial pattern recognition: classifying geometric polygons from simple (circle) to complex (heptagon, cube, sphere).",
            developmental_readiness="Develops geometric attribute identification (equal sides, angles) and prepares visual cortex for orthographic reading.",
            classroom_application="Tangram and block-building math centers; brings tactile geometry into kinesthetic play.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Tactile shape trace: Children trace wooden polygon edges counting the sides out loud in tempo.",
        "target_skills": ["2D & 3D Shape Recognition", "Geometric Properties", "Visual-Spatial Mapping"]
    },
    {
        "track_id": 17,
        "slug": "months-of-the-year",
        "title": "Months of the Year",
        "land": "Celestia",
        "bpm": 104,
        "primary_domain": "Mathematics & Long-Horizon Temporal Memory",
        "elof_codes": ["P-MATH.8", "P-ATL.2"],
        "naeyc_codes": ["2.F", "2.B"],
        "state_codes": {
            "TX": ["TX-TPG.V.A"],
            "CA": ["CA-PTKLF.LLD.1"],
            "FL": ["FL-FELDS.V.A"],
            "UT": ["UT-ECCS.M.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Cyclic melodic sequencing embedding the 12-month calendar progression in long-term semantic memory.",
            developmental_readiness="Understands seasons, birthdays, and yearly milestones; masters kindergarten temporal benchmark requirements.",
            classroom_application="Monthly transitions and seasonal science units; grounds time progression throughout the school year.",
            vagal_regulation=False,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "12-month wheel walk: Children walk in a circle around 12 season markers, pausing on the current month.",
        "target_skills": ["12-Month Progression", "Seasonal Awareness", "Long-Term Working Memory"]
    },
    {
        "track_id": 18,
        "slug": "rain",
        "title": "Rain",
        "land": "Terrasol",
        "bpm": 92,
        "primary_domain": "Science, Atmospheric Hydrology & Calming",
        "elof_codes": ["P-SCI.1", "P-ATL.1"],
        "naeyc_codes": ["2.G", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.SED.1"],
            "OR": ["OR-ELKG.SCI.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Auditory rainfall frequencies (pink/white noise spectrum) gently down-regulating hyperactive sensory processing.",
            developmental_readiness="Encourages atmospheric observation, curiosity about water cycles, and serene mental focus.",
            classroom_application="Post-recess cool down or quiet work period; centers overstimulated classroom energy.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Rainstick finger-tap: Children gently tap fingertips on paper like falling rain, matching the acoustic tempo.",
        "target_skills": ["Atmospheric Science", "Sensory Downregulation", "Auditory Sensitivity"]
    },
    {
        "track_id": 19,
        "slug": "after-the-storm",
        "title": "After the Storm (Outro)",
        "land": "Terrasol",
        "bpm": 88,
        "primary_domain": "Social-Emotional Equilibrium & Integration",
        "elof_codes": ["P-ATL.1", "P-SE.1"],
        "naeyc_codes": ["2.D", "2.J"],
        "state_codes": {
            "TX": ["TX-TPG.II.A"],
            "CA": ["CA-PTKLF.SED.1"],
            "FL": ["FL-FELDS.I.A"],
            "DE": ["DE-DELF.SED.1"]
        },
        "neurological_impact": NeurologicalImpact(
            mechanism="Slow acoustic release (88 BPM) triggering vagal brake activation for deep physiological equilibrium and closure.",
            developmental_readiness="Integrates learning experiences, fosters quiet contemplation, and builds peace after emotional turbulence.",
            classroom_application="End-of-day dismissal or rest-mat transition ritual; ensures children leave school calm, regulated, and confident.",
            vagal_regulation=True,
            bilateral_integration=False
        ),
        "tactile_extension_summary": "Rainbow calm breathe: Children gently sweep hands across chests like a peaceful rainbow with slow exhalations.",
        "target_skills": ["Parasympathetic Closure", "Emotional Integration", "Dismissal Calming"]
    }
]

class StandardsEngine:
    def __init__(self, tracks_json_path: Optional[str] = None):
        if not tracks_json_path:
            # Auto-locate tracks.json in ecosystem
            base_dir = Path(__file__).resolve().parents[2]
            tracks_json_path = os.path.join(base_dir, "web", "src", "data", "tracks.json")
        self.tracks_json_path = tracks_json_path
        self._raw_tracks = self._load_raw_tracks()

    def _load_raw_tracks(self) -> List[Dict]:
        if os.path.exists(self.tracks_json_path):
            with open(self.tracks_json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def generate_master_crosswalk(self) -> List[TrackAlignment]:
        """Builds and returns all 19 canonical track alignments."""
        alignments = []
        for mapping in TRACK_STANDARDS_MAPPING:
            alignment = TrackAlignment(
                track_id=mapping["track_id"],
                slug=mapping["slug"],
                title=mapping["title"],
                land=mapping["land"],
                bpm=mapping["bpm"],
                primary_domain=mapping["primary_domain"],
                elof_codes=mapping["elof_codes"],
                naeyc_codes=mapping["naeyc_codes"],
                state_codes=mapping.get("state_codes", {}),
                neurological_impact=mapping["neurological_impact"],
                tactile_extension_summary=mapping["tactile_extension_summary"],
                target_skills=mapping.get("target_skills", [])
            )
            alignments.append(alignment)
        return alignments

    def get_track_alignment(self, slug_or_id) -> Optional[TrackAlignment]:
        """Fetch alignment for a specific track by slug or track_id."""
        for item in self.generate_master_crosswalk():
            if str(item.track_id) == str(slug_or_id) or item.slug == str(slug_or_id):
                return item
        return None
