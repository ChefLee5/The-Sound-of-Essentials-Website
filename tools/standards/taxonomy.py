"""
Comprehensive Standards Taxonomy for SOE Alignment.
Defines national accreditation and developmental standards:
- Head Start Early Learning Outcomes Framework (ELOF)
- NAEYC Early Learning Program Standards
- State-Specific Framework Standard Indicators (CA, TX, FL, GA, NY, etc.)
"""

from typing import Dict
from tools.standards.models import StandardCode

# =========================================================================
# HEAD START EARLY LEARNING OUTCOMES FRAMEWORK (ELOF) TAXONOMY
# =========================================================================
ELOF_TAXONOMY: Dict[str, StandardCode] = {
    # 1. Language and Communication (P-LC)
    "P-LC.1": StandardCode(
        framework="Head Start ELOF", domain="P-LC", code="P-LC.1",
        title="Attending and Understanding",
        description="Child attends to, understands, and responds to increasingly complex language from others and rhythmic vocal prompts."
    ),
    "P-LC.2": StandardCode(
        framework="Head Start ELOF", domain="P-LC", code="P-LC.2",
        title="Communicating and Speaking",
        description="Child varies amount and style of speech, vocalizes words clearly, and participates in call-and-response vocal exchanges."
    ),
    "P-LC.3": StandardCode(
        framework="Head Start ELOF", domain="P-LC", code="P-LC.3",
        title="Vocabulary Acquisition",
        description="Child understands and uses a wide variety of increasingly complex words across living systems, nature, and emotional states."
    ),
    "P-LC.4": StandardCode(
        framework="Head Start ELOF", domain="P-LC", code="P-LC.4",
        title="Multilingual Communication & Sensitivity",
        description="Child demonstrates receptive understanding and vocal repetition of multi-language phrases and global phonemes."
    ),

    # 2. Literacy (P-LIT)
    "P-LIT.1": StandardCode(
        framework="Head Start ELOF", domain="P-LIT", code="P-LIT.1",
        title="Phonological Awareness",
        description="Child demonstrates awareness that spoken language is composed of smaller units of sound, such as words, syllables, and phonemes."
    ),
    "P-LIT.2": StandardCode(
        framework="Head Start ELOF", domain="P-LIT", code="P-LIT.2",
        title="Print Concepts",
        description="Child demonstrates an understanding of how print works, directionality, and text-to-meaning correspondence."
    ),
    "P-LIT.3": StandardCode(
        framework="Head Start ELOF", domain="P-LIT", code="P-LIT.3",
        title="Alphabet Knowledge",
        description="Child recognizes, identifies, and names letters of the alphabet and identifies corresponding letter sounds in rhythmic sequences."
    ),

    # 3. Cognition: Mathematics (P-MATH)
    "P-MATH.1": StandardCode(
        framework="Head Start ELOF", domain="P-MATH", code="P-MATH.1",
        title="Counting and Cardinality",
        description="Child understands that number words refer to quantity, counts aloud in sequence, and associates physical claps with numerals."
    ),
    "P-MATH.2": StandardCode(
        framework="Head Start ELOF", domain="P-MATH", code="P-MATH.2",
        title="Pattern Recognition",
        description="Child recognizes, duplicates, and extends repeating patterns in acoustic beats, bodily movements, and geometric shapes."
    ),
    "P-MATH.8": StandardCode(
        framework="Head Start ELOF", domain="P-MATH", code="P-MATH.8",
        title="Measurement and Time Sequencing",
        description="Child understands time sequences (days of the week, months, seasons, morning/night) and temporal progression."
    ),
    "P-MATH.9": StandardCode(
        framework="Head Start ELOF", domain="P-MATH", code="P-MATH.9",
        title="Geometry and Spatial Reasoning",
        description="Child identifies, compares, and manipulates two- and three-dimensional shapes in space and tactile environments."
    ),

    # 4. Cognition: Scientific Inquiry (P-SCI)
    "P-SCI.1": StandardCode(
        framework="Head Start ELOF", domain="P-SCI", code="P-SCI.1",
        title="Scientific Inquiry and Observation",
        description="Child observes and describes characteristics of natural materials, weather patterns, and sensory textures."
    ),
    "P-SCI.2": StandardCode(
        framework="Head Start ELOF", domain="P-SCI", code="P-SCI.2",
        title="Living Things and Ecosystems",
        description="Child identifies and compares characteristics, behaviors, and habitats of animals, plants, and natural life cycles."
    ),

    # 5. Perceptual, Motor, and Physical Development (P-PMP)
    "P-PMP.1": StandardCode(
        framework="Head Start ELOF", domain="P-PMP", code="P-PMP.1",
        title="Gross Motor Control & Bilateral Integration",
        description="Child demonstrates control, strength, balance, and coordination of large muscles, crossing the midline and stretching."
    ),
    "P-PMP.2": StandardCode(
        framework="Head Start ELOF", domain="P-PMP", code="P-PMP.2",
        title="Rhythmic Motor Synchronization & Cardiovascular Agility",
        description="Child synchronizes bodily locomotion (marching, knuckle-stepping, hopping) with an audible musical tempo (90-110 BPM)."
    ),
    "P-PMP.3": StandardCode(
        framework="Head Start ELOF", domain="P-PMP", code="P-PMP.3",
        title="Fine Motor Control & Hand-Eye Precision",
        description="Child demonstrates strength and dexterity in small hand and finger muscles through tactile manipulation."
    ),

    # 6. Approaches to Learning (P-ATL)
    "P-ATL.1": StandardCode(
        framework="Head Start ELOF", domain="P-ATL", code="P-ATL.1",
        title="Emotional and Behavioral Self-Regulation",
        description="Child manages and regulates actions, emotions, and attention using acoustic grounding rituals and somatic breathing."
    ),
    "P-ATL.2": StandardCode(
        framework="Head Start ELOF", domain="P-ATL", code="P-ATL.2",
        title="Cognitive Flexibility & Working Memory",
        description="Child maintains focus, shifts attention across tasks, and holds sequence information in mind during multi-step song games."
    ),

    # 7. Social and Emotional Development (P-SE)
    "P-SE.1": StandardCode(
        framework="Head Start ELOF", domain="P-SE", code="P-SE.1",
        title="Sense of Identity and Belonging",
        description="Child recognizes own unique physical and personal characteristics, feelings, and role in community harmony."
    ),
    "P-SE.2": StandardCode(
        framework="Head Start ELOF", domain="P-SE", code="P-SE.2",
        title="Social Manners and Empathy",
        description="Child demonstrates cooperative behaviors, courteous interactions, listening etiquette, and empathy toward peers."
    )
}

# =========================================================================
# NAEYC EARLY LEARNING PROGRAM STANDARDS
# =========================================================================
NAEYC_TAXONOMY: Dict[str, StandardCode] = {
    "2.B": StandardCode(
        framework="NAEYC", domain="2.B", code="2.B.01",
        title="Language Development & Emergent Literacy",
        description="Curriculum provides opportunities for children to develop oral language, phonemic discrimination, and early vocabulary."
    ),
    "2.C": StandardCode(
        framework="NAEYC", domain="2.C", code="2.C.01",
        title="Physical Development & Bilateral Motor Health",
        description="Curriculum promotes physical fitness, gross-motor midline crossing, balance, and spatial body awareness."
    ),
    "2.D": StandardCode(
        framework="NAEYC", domain="2.D", code="2.D.01",
        title="Social-Emotional Equilibrium & Self-Regulation",
        description="Curriculum fosters healthy self-concept, cooperative peer interaction, and somatic calming rituals."
    ),
    "2.F": StandardCode(
        framework="NAEYC", domain="2.F", code="2.F.01",
        title="Early Mathematics, Number Sense & Patterns",
        description="Curriculum engages children in counting, temporal concepts, pattern recognition, and geometric relationships."
    ),
    "2.G": StandardCode(
        framework="NAEYC", domain="2.G", code="2.G.01",
        title="Science & Living Systems Inquiry",
        description="Curriculum supports children in exploring living things, earth systems, weather, and sensory properties."
    ),
    "2.J": StandardCode(
        framework="NAEYC", domain="2.J", code="2.J.01",
        title="Creative Expression, Music & Movement",
        description="Curriculum integrates musical cadence, vocal call-and-response, rhythmic instruments, and creative kinesthetic play."
    )
}

# =========================================================================
# TARGET STATE EARLY LEARNING STANDARDS TAXONOMY (SELECTED HIGH-VOLUME)
# =========================================================================
STATE_STANDARDS_TAXONOMY: Dict[str, StandardCode] = {
    # Texas Pre-K Guidelines (TX-TPG)
    "TX-TPG.II.A": StandardCode(framework="Texas TPG", domain="Language", code="TX-TPG.II.A", title="Listening Comprehension", description="Child listens attentively and follows rhythm-based instructions."),
    "TX-TPG.III.A": StandardCode(framework="Texas TPG", domain="Literacy", code="TX-TPG.III.A", title="Phonological Awareness", description="Child discriminates sounds and segments syllables."),
    "TX-TPG.V.A": StandardCode(framework="Texas TPG", domain="Math", code="TX-TPG.V.A", title="Number and Operations", description="Child counts objects and claps with 1-to-1 correspondence."),
    "TX-TPG.IX.A": StandardCode(framework="Texas TPG", domain="Physical", code="TX-TPG.IX.A", title="Gross Motor Coordination", description="Child demonstrates body control, balance, and bilateral coordination."),
    
    # California Preschool/TK Learning Foundations (CA-PTKLF)
    "CA-PTKLF.LLD.1": StandardCode(framework="California PTKLF", domain="Language", code="CA-PTKLF.LLD.1", title="Listening and Speaking", description="Child communicates effectively through song, rhyme, and dialogue."),
    "CA-PTKLF.LLD.3": StandardCode(framework="California PTKLF", domain="Literacy", code="CA-PTKLF.LLD.3", title="Phonological Awareness", description="Child attends to sound structures and rhythm of language."),
    "CA-PTKLF.PD.1": StandardCode(framework="California PTKLF", domain="Physical", code="CA-PTKLF.PD.1", title="Perceptual-Motor & Movement", description="Child integrates sensory input with gross motor coordination."),
    "CA-PTKLF.SED.1": StandardCode(framework="California PTKLF", domain="Social-Emotional", code="CA-PTKLF.SED.1", title="Self-Regulation", description="Child regulates emotion and energy using musical cadence."),

    # Florida Early Learning Standards (FL-FELDS)
    "FL-FELDS.IV.A": StandardCode(framework="Florida FELDS", domain="Language", code="FL-FELDS.IV.A", title="Language and Literacy", description="Child demonstrates phonological sensitivity and active listening."),
    "FL-FELDS.I.A": StandardCode(framework="Florida FELDS", domain="Physical", code="FL-FELDS.I.A", title="Physical Health & Motor", description="Child practices full-body coordination and bilateral movement."),
    "FL-FELDS.V.A": StandardCode(framework="Florida FELDS", domain="Math", code="FL-FELDS.V.A", title="Mathematical Thinking", description="Child recognizes counts and temporal order.")
}
