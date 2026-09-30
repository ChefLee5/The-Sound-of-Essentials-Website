"""
Complete 50-State Early Childhood Procurement & Adoption Registry.
Maps all 50 US States (+ DC) across the 3 Strategic Procurement Tiers:
- Tier 1: 28 State-Approved Curriculum List States (Centralized DOE Gate)
- Tier 2: 16 Open-Territory / Local District States (Direct LEA Procurement)
- Tier 3: 6 Federal Head Start & Title I Primary States
"""

from typing import Dict, List, Optional
from tools.standards.models import StateProfile

STATES_REGISTRY: Dict[str, StateProfile] = {
    # =========================================================================
    # TIER 1: 28 STATE-APPROVED CURRICULUM STATES (CENTRALIZED DOE GATE)
    # =========================================================================
    "TX": StateProfile(
        code="TX", name="Texas", tier=1,
        procurement_type="State Board / Approved Curriculum List (Proclamation)",
        standards_framework="Texas Pre-Kindergarten Guidelines (TPG)",
        framework_acronym="TX-TPG",
        doe_agency_name="Texas Education Agency (TEA)",
        approved_list_required=True,
        prek_program_name="Texas High-Quality Pre-K Grant",
        key_priorities=["Phonological Awareness", "Rapid Letter Naming", "Bilateral Coordination", "Bilingual Literacy"]
    ),
    "CA": StateProfile(
        code="CA", name="California", tier=1,
        procurement_type="State Curriculum Commission / Universal TK Adoption",
        standards_framework="California Preschool/TK Learning Foundations (PTKLF) & DRDP",
        framework_acronym="CA-PTKLF",
        doe_agency_name="California Department of Education (CDE)",
        approved_list_required=True,
        prek_program_name="California Universal Transitional Kindergarten (UTK)",
        key_priorities=["Screen-Free Exploration", "Social-Emotional Literacy", "Multilingual Support", "Vagal Regulation"]
    ),
    "FL": StateProfile(
        code="FL", name="Florida", tier=1,
        procurement_type="Division of Early Learning Approved Curriculum List",
        standards_framework="Florida Early Learning and Developmental Standards (FELDS)",
        framework_acronym="FL-FELDS",
        doe_agency_name="Florida Department of Education (FDOE - DEL)",
        approved_list_required=True,
        prek_program_name="Florida Voluntary Prekindergarten (VPK)",
        key_priorities=["Print Knowledge", "Phonological Sensitivity", "Oral Language Fluency"]
    ),
    "GA": StateProfile(
        code="GA", name="Georgia", tier=1,
        procurement_type="Department of Early Care and Learning (DECAL) Approved Models",
        standards_framework="Georgia Early Learning and Development Standards (GELDS)",
        framework_acronym="GA-GELDS",
        doe_agency_name="Georgia DECAL (Bright from the Start)",
        approved_list_required=True,
        prek_program_name="Georgia's Pre-K Program (Lottery-Funded)",
        key_priorities=["Active Physical Movement", "Expressive Communication", "Rhythmic Cadence"]
    ),
    "NC": StateProfile(
        code="NC", name="North Carolina", tier=1,
        procurement_type="NC Pre-K Advisory Committee Approved Curriculum List",
        standards_framework="North Carolina Foundations for Early Learning and Development (NC-FELD)",
        framework_acronym="NC-FELD",
        doe_agency_name="NC Department of Health and Human Services / DPI",
        approved_list_required=True,
        prek_program_name="NC Pre-K Program",
        key_priorities=["Sensory Exploration", "Approaches to Play", "Early Mathematics"]
    ),
    "MI": StateProfile(
        code="MI", name="Michigan", tier=1,
        procurement_type="Great Start Readiness Program (GSRP) Vetted Curriculum List",
        standards_framework="Michigan Early Childhood Standards of Quality for Pre-K (ECSQ-PK)",
        framework_acronym="MI-ECSQ",
        doe_agency_name="Michigan Department of Education (MDE)",
        approved_list_required=True,
        prek_program_name="Great Start Readiness Program (GSRP)",
        key_priorities=["Kinesthetic Learning", "Emergent Literacy", "Trauma-Informed Calming"]
    ),
    "TN": StateProfile(
        code="TN", name="Tennessee", tier=1,
        procurement_type="State Textbook and Instructional Materials Quality Commission",
        standards_framework="Tennessee Early Learning Developmental Standards (TN-ELDS)",
        framework_acronym="TN-ELDS",
        doe_agency_name="Tennessee Department of Education (TDOE)",
        approved_list_required=True,
        prek_program_name="Voluntary Pre-K for Tennessee (VPK)",
        key_priorities=["Foundational Literacy Skills", "Number Sense", "Rhythmic Chanting"]
    ),
    "AR": StateProfile(
        code="AR", name="Arkansas", tier=1,
        procurement_type="Arkansas Division of Elementary and Secondary Education (DESE) Approved List",
        standards_framework="Arkansas Child Development and Early Learning Standards (CDELS)",
        framework_acronym="AR-CDELS",
        doe_agency_name="Arkansas Department of Education (ADE)",
        approved_list_required=True,
        prek_program_name="Arkansas Better Chance (ABC)",
        key_priorities=["Evidence-Based HQIM", "Speech Articulation", "Physical Coordination"]
    ),
    "OH": StateProfile(
        code="OH", name="Ohio", tier=1,
        procurement_type="Step Up To Quality (SUTQ) Approved Curriculum Standards",
        standards_framework="Ohio's Early Learning & Development Standards (ELDS)",
        framework_acronym="OH-ELDS",
        doe_agency_name="Ohio Department of Children and Youth (DCY)",
        approved_list_required=True,
        prek_program_name="Early Childhood Education Grant (ECE)",
        key_priorities=["Motor Development", "Phonemic Cadence", "Cognitive Flexibility"]
    ),
    "PA": StateProfile(
        code="PA", name="Pennsylvania", tier=1,
        procurement_type="Office of Child Development and Early Learning (OCDEL) Approved List",
        standards_framework="Pennsylvania Early Learning Standards (PA-ELS)",
        framework_acronym="PA-ELS",
        doe_agency_name="PA Department of Education (PDE) & DHS",
        approved_list_required=True,
        prek_program_name="PA Pre-K Counts",
        key_priorities=["Creative Arts & Music", "Health & Physical Wellness", "Early Scientific Inquiry"]
    ),
    "VA": StateProfile(
        code="VA", name="Virginia", tier=1,
        procurement_type="Virginia Literacy Act (VLA) & VPI Approved Curriculum Matrix",
        standards_framework="Virginia Early Learning and Development Standards (ELDS / Birth-5)",
        framework_acronym="VA-ELDS",
        doe_agency_name="Virginia Department of Education (VDOE)",
        approved_list_required=True,
        prek_program_name="Virginia Preschool Initiative (VPI)",
        key_priorities=["Acoustic Phonemic Awareness", "Structured Literacy", "Fine Motor Grasp"]
    ),
    "MD": StateProfile(
        code="MD", name="Maryland", tier=1,
        procurement_type="Blueprint for Maryland's Future Approved Pre-K Curriculum List",
        standards_framework="Maryland Early Learning Standards & Pedagogy Guidelines",
        framework_acronym="MD-ELS",
        doe_agency_name="Maryland State Department of Education (MSDE)",
        approved_list_required=True,
        prek_program_name="Prekindergarten Expansion Grant / Blueprint Pre-K",
        key_priorities=["Whole-Child Readiness", "Vocabulary Enrichment", "Self-Regulation"]
    ),
    "AL": StateProfile(
        code="AL", name="Alabama", tier=1,
        procurement_type="Department of Early Childhood Education Approved Standards Models",
        standards_framework="Alabama Early Learning Guidelines (AELG)",
        framework_acronym="AL-AELG",
        doe_agency_name="Alabama Department of Early Childhood Education (ADECE)",
        approved_list_required=True,
        prek_program_name="Alabama First Class Pre-K",
        key_priorities=["Gold Standard Quality", "Tactile Movement", "Rich Language Exchanges"]
    ),
    "SC": StateProfile(
        code="SC", name="South Carolina", tier=1,
        procurement_type="First Steps & State DOE Vetted Instructional Materials",
        standards_framework="South Carolina Early Learning Standards (SC-ELS)",
        framework_acronym="SC-ELS",
        doe_agency_name="South Carolina Department of Education (SCDE)",
        approved_list_required=True,
        prek_program_name="Child Development Education Program (CDEP 4K)",
        key_priorities=["Musical Rhythmics", "Spatial Reasoning", "Oral Storytelling"]
    ),
    "LA": StateProfile(
        code="LA", name="Louisiana", tier=1,
        procurement_type="LDOE Tier 1 Instructional Materials Reviews (HQIM)",
        standards_framework="Louisiana Birth to Five Early Learning & Development Standards",
        framework_acronym="LA-B5",
        doe_agency_name="Louisiana Department of Education (LDOE)",
        approved_list_required=True,
        prek_program_name="LA 4 Early Childhood Program",
        key_priorities=["Tier 1 HQIM Rating", "Phonological Precision", "Sensory Integration"]
    ),
    "OK": StateProfile(
        code="OK", name="Oklahoma", tier=1,
        procurement_type="State Textbook Committee & Early Childhood Approved Roster",
        standards_framework="Oklahoma Early Learning Guidelines for Children Ages 3-5 (ELG)",
        framework_acronym="OK-ELG",
        doe_agency_name="Oklahoma State Department of Education (OSDE)",
        approved_list_required=True,
        prek_program_name="Oklahoma Universal Pre-K (Early Childhood 4-Year-Old Program)",
        key_priorities=["Universal School Readiness", "Expressive Arts", "Motor Milestones"]
    ),
    "CO": StateProfile(
        code="CO", name="Colorado", tier=1,
        procurement_type="Department of Early Childhood (CDEC) Approved Curriculum Resource Bank",
        standards_framework="Colorado Early Learning & Development Guidelines (ELDG)",
        framework_acronym="CO-ELDG",
        doe_agency_name="Colorado Department of Early Childhood (CDEC)",
        approved_list_required=True,
        prek_program_name="Colorado Universal Preschool (UPK)",
        key_priorities=["Holistic Health", "Multilingual Literacy", "Play-Based Tactility"]
    ),
    "NJ": StateProfile(
        code="NJ", name="New Jersey", tier=1,
        procurement_type="Division of Early Childhood Services Approved Comprehensive Curricula",
        standards_framework="New Jersey Preschool Teaching & Learning Standards (PTLS)",
        framework_acronym="NJ-PTLS",
        doe_agency_name="New Jersey Department of Education (NJDOE)",
        approved_list_required=True,
        prek_program_name="NJ High-Quality Preschool Expansion (Abbott / PEA)",
        key_priorities=["Acoustic Listening", "Creative Arts", "Emotional Equilibrium"]
    ),
    "IN": StateProfile(
        code="IN", name="Indiana", tier=1,
        procurement_type="Paths to QUALITY Approved Curriculum Framework",
        standards_framework="Indiana Early Learning Standards (IELS)",
        framework_acronym="IN-IELS",
        doe_agency_name="Indiana Department of Education (IDOE) & FSSA",
        approved_list_required=True,
        prek_program_name="On My Way Pre-K",
        key_priorities=["Physical Motor Health", "Early Literacy", "Pattern Recognition"]
    ),
    "AZ": StateProfile(
        code="AZ", name="Arizona", tier=1,
        procurement_type="First Things First & ADE Quality First Approved Curricula",
        standards_framework="Arizona Early Learning Standards (AZELS)",
        framework_acronym="AZ-AZELS",
        doe_agency_name="Arizona Department of Education (ADE)",
        approved_list_required=True,
        prek_program_name="Quality First / Preschool Development Grant",
        key_priorities=["Dual Language Acquisition", "Sensory Discovery", "Rhythm and Pulse"]
    ),
    "MO": StateProfile(
        code="MO", name="Missouri", tier=1,
        procurement_type="DESE Early Learning Approved Curriculum Matrix",
        standards_framework="Missouri Early Learning Standards (MELS)",
        framework_acronym="MO-MELS",
        doe_agency_name="Missouri Department of Elementary and Secondary Education (DESE)",
        approved_list_required=True,
        prek_program_name="Missouri Preschool Program (MPP)",
        key_priorities=["Physical & Cognitive Coordination", "Phonics Grounding", "Social Bonds"]
    ),
    "KY": StateProfile(
        code="KY", name="Kentucky", tier=1,
        procurement_type="Kentucky Department of Education Early Learning Guidance",
        standards_framework="Kentucky Early Childhood Standards (KECS)",
        framework_acronym="KY-KECS",
        doe_agency_name="Kentucky Department of Education (KDE)",
        approved_list_required=True,
        prek_program_name="Kentucky Preschool Program",
        key_priorities=["Kinesthetic Readiness", "Sound Discrimination", "Cooperative Play"]
    ),
    "NM": StateProfile(
        code="NM", name="New Mexico", tier=1,
        procurement_type="Early Childhood Education and Care Department (ECECD) Approved Curriculum",
        standards_framework="New Mexico Early Learning Guidelines (NM-ELG)",
        framework_acronym="NM-ELG",
        doe_agency_name="New Mexico ECECD",
        approved_list_required=True,
        prek_program_name="NM PreK",
        key_priorities=["Indigenous & Multilingual Respect", "Sensory Movement", "Earth Literacy"]
    ),
    "UT": StateProfile(
        code="UT", name="Utah", tier=1,
        procurement_type="State Board of Education High-Quality School Readiness Approved Roster",
        standards_framework="Utah Early Childhood Core Standards",
        framework_acronym="UT-ECCS",
        doe_agency_name="Utah State Board of Education (USBE)",
        approved_list_required=True,
        prek_program_name="Utah High Quality School Readiness Program",
        key_priorities=["Numeracy Foundations", "Gross Motor Equilibrium", "Speech Rhythm"]
    ),
    "NV": StateProfile(
        code="NV", name="Nevada", tier=1,
        procurement_type="State Board of Education Instructional Materials Adoption",
        standards_framework="Nevada Pre-K Content Standards",
        framework_acronym="NV-PKCS",
        doe_agency_name="Nevada Department of Education (NDE)",
        approved_list_required=True,
        prek_program_name="Nevada Ready! State Pre-K",
        key_priorities=["Multilingual Phonics", "Active Listening", "Somatic Movement"]
    ),
    "MS": StateProfile(
        code="MS", name="Mississippi", tier=1,
        procurement_type="Early Learning Collaborative Act Vetted Curriculum List",
        standards_framework="Mississippi Early Learning Standards for Classrooms Serving 3- and 4-Year-Olds",
        framework_acronym="MS-ELS",
        doe_agency_name="Mississippi Department of Education (MDE)",
        approved_list_required=True,
        prek_program_name="Early Learning Collaboratives (ELC)",
        key_priorities=["Foundational Phonemic Awareness", "Auditory Discrimination", "Movement Drills"]
    ),
    "WV": StateProfile(
        code="WV", name="West Virginia", tier=1,
        procurement_type="WV Board of Education Policy 2525 Approved Curricula",
        standards_framework="West Virginia Early Learning Standards Framework (WV-ELSF)",
        framework_acronym="WV-ELSF",
        doe_agency_name="West Virginia Department of Education (WVDE)",
        approved_list_required=True,
        prek_program_name="West Virginia Universal Pre-K",
        key_priorities=["Universal Child Access", "Acoustic Calming", "Physical Agility"]
    ),
    "DE": StateProfile(
        code="DE", name="Delaware", tier=1,
        procurement_type="Delaware Early Learning Guidelines & Purchase Agreement Roster",
        standards_framework="Delaware Early Learning Foundations for Preschool",
        framework_acronym="DE-DELF",
        doe_agency_name="Delaware Department of Education (DDOE)",
        approved_list_required=True,
        prek_program_name="Delaware Early Childhood Assistance Program (ECAP)",
        key_priorities=["Whole-Child Health", "Early Phonics", "Emotional Grounding"]
    ),

    # =========================================================================
    # TIER 2: 16 OPEN-TERRITORY / LOCAL DISTRICT STATES (+ DC)
    # =========================================================================
    "NY": StateProfile(
        code="NY", name="New York", tier=2,
        procurement_type="Local District (LEA) Adoption / Universal Pre-K (UPK) Grants",
        standards_framework="New York State Early Learning Guidelines (NYS-ELG)",
        framework_acronym="NY-ELG",
        doe_agency_name="New York State Education Department (NYSED)",
        approved_list_required=False,
        prek_program_name="NYS Universal Prekindergarten (UPK / 3-K)",
        key_priorities=["Arts Integration", "Multilingual Phonics", "Somatic Calming"]
    ),
    "IL": StateProfile(
        code="IL", name="Illinois", tier=2,
        procurement_type="Local School District Adoption / Preschool for All Grants",
        standards_framework="Illinois Early Learning and Development Standards (IELDS)",
        framework_acronym="IL-IELDS",
        doe_agency_name="Illinois State Board of Education (ISBE)",
        approved_list_required=False,
        prek_program_name="Preschool for All (PFA)",
        key_priorities=["Screen-Free Play", "Language Exploration", "Gross Motor Midline Crossing"]
    ),
    "MA": StateProfile(
        code="MA", name="Massachusetts", tier=2,
        procurement_type="Local District & Regional Early Education and Care (EEC) Adoption",
        standards_framework="Massachusetts Early Learning Guidelines for Preschool",
        framework_acronym="MA-ELG",
        doe_agency_name="MA Department of Early Education and Care (EEC) & DESE",
        approved_list_required=False,
        prek_program_name="Commonwealth Preschool Partnership Initiative (CPPI)",
        key_priorities=["Inquiry-Based Discovery", "Music & Rhythm", "Executive Function"]
    ),
    "WA": StateProfile(
        code="WA", name="Washington", tier=2,
        procurement_type="Local Educational Service District (ESD) & ECEAP Contractor Choice",
        standards_framework="Washington State Early Learning and Development Guidelines",
        framework_acronym="WA-ELDG",
        doe_agency_name="Washington Department of Children, Youth, and Families (DCYF)",
        approved_list_required=False,
        prek_program_name="Early Childhood Education and Assistance Program (ECEAP)",
        key_priorities=["Outdoor Nature Connection", "Self-Regulation", "Sensory Processing"]
    ),
    "OR": StateProfile(
        code="OR", name="Oregon", tier=2,
        procurement_type="Local Early Learning Hub & School District Selection",
        standards_framework="Oregon Early Learning and Kindergarten Guidelines",
        framework_acronym="OR-ELKG",
        doe_agency_name="Oregon Department of Early Learning and Care (DELC)",
        approved_list_required=False,
        prek_program_name="Preschool Promise & Oregon Pre-Kindergarten (OPK)",
        key_priorities=["Holistic Development", "Rhythmic Movement", "Vagal Nerve Regulation"]
    ),
    "WI": StateProfile(
        code="WI", name="Wisconsin", tier=2,
        procurement_type="Local School District Control (4K Community Approaches)",
        standards_framework="Wisconsin Model Early Learning Standards (WMELS)",
        framework_acronym="WI-WMELS",
        doe_agency_name="Wisconsin Department of Public Instruction (DPI)",
        approved_list_required=False,
        prek_program_name="Wisconsin Four-Year-Old Kindergarten (4K)",
        key_priorities=["Community Groundedness", "Early Number Sense", "Expressive Song"]
    ),
    "MN": StateProfile(
        code="MN", name="Minnesota", tier=2,
        procurement_type="Local School Board & Early Learning Scholarship Discretion",
        standards_framework="Minnesota Early Childhood Indicators of Progress (ECIPs)",
        framework_acronym="MN-ECIP",
        doe_agency_name="Minnesota Department of Education (MDE)",
        approved_list_required=False,
        prek_program_name="Voluntary Pre-K (VPK) & School Readiness",
        key_priorities=["Bilateral Motor Play", "Vocal Articulation", "Emotional Harmony"]
    ),
    "CT": StateProfile(
        code="CT", name="Connecticut", tier=2,
        procurement_type="Local School Readiness Council & LEA Procurement",
        standards_framework="Connecticut Early Learning and Development Standards (CT-ELDS)",
        framework_acronym="CT-ELDS",
        doe_agency_name="Connecticut Office of Early Childhood (OEC)",
        approved_list_required=False,
        prek_program_name="School Readiness Program & Smart Start",
        key_priorities=["Fine Motor Agility", "Oral Language Breadth", "Creative Play"]
    ),
    "IA": StateProfile(
        code="IA", name="Iowa", tier=2,
        procurement_type="Local District Choice / Statewide Voluntary Preschool Program",
        standards_framework="Iowa Early Learning Standards (IELS)",
        framework_acronym="IA-IELS",
        doe_agency_name="Iowa Department of Education",
        approved_list_required=False,
        prek_program_name="Statewide Voluntary Preschool Program for Four-Year-Old Children (SWVPP)",
        key_priorities=["Foundational Phonics", "Gross Motor Cadence", "Emotional Grounding"]
    ),
    "KS": StateProfile(
        code="KS", name="Kansas", tier=2,
        procurement_type="Local School District Discretion / Preschool-Aged At-Risk Grants",
        standards_framework="Kansas Early Learning Standards (KELS)",
        framework_acronym="KS-KELS",
        doe_agency_name="Kansas State Department of Education (KSDE)",
        approved_list_required=False,
        prek_program_name="State Pre-K 4-Year-Old At-Risk Program",
        key_priorities=["Active Listening", "Number Cadence", "Classroom Rituals"]
    ),
    "ME": StateProfile(
        code="ME", name="Maine", tier=2,
        procurement_type="Local School Administrative Unit (SAU) Selection",
        standards_framework="Maine Early Learning and Development Standards (MELDS)",
        framework_acronym="ME-MELDS",
        doe_agency_name="Maine Department of Education",
        approved_list_required=False,
        prek_program_name="Maine Public Pre-K",
        key_priorities=["Sensory Exploration", "Nature Learning", "Speech Fluency"]
    ),
    "NE": StateProfile(
        code="NE", name="Nebraska", tier=2,
        procurement_type="Local District Discretion / Early Childhood Education Grant Program",
        standards_framework="Nebraska Early Learning Guidelines (NELG)",
        framework_acronym="NE-NELG",
        doe_agency_name="Nebraska Department of Education (NDE)",
        approved_list_required=False,
        prek_program_name="Nebraska Early Childhood Education Grant Program",
        key_priorities=["Physical Endurance", "Vocal Articulation", "Play Rituals"]
    ),
    "RI": StateProfile(
        code="RI", name="Rhode Island", tier=2,
        procurement_type="Local LEA and Early Learning Center Choice with RIDE Guidelines",
        standards_framework="Rhode Island Early Learning and Development Standards (RIELDS)",
        framework_acronym="RI-RIELDS",
        doe_agency_name="Rhode Island Department of Education (RIDE)",
        approved_list_required=False,
        prek_program_name="RI State Pre-K Program",
        key_priorities=["Expressive Language", "Gross Motor Midline", "Acoustic Cadence"]
    ),
    "VT": StateProfile(
        code="VT", name="Vermont", tier=2,
        procurement_type="Act 166 Universal PreK Local School District / Partner Selection",
        standards_framework="Vermont Early Learning Standards (VELS)",
        framework_acronym="VT-VELS",
        doe_agency_name="Vermont Agency of Education (AOE)",
        approved_list_required=False,
        prek_program_name="Act 166 Universal Pre-K",
        key_priorities=["Childhood Independence", "Nature & Movement", "Auditory Discrimination"]
    ),
    "HI": StateProfile(
        code="HI", name="Hawaii", tier=2,
        procurement_type="Executive Office on Early Learning (EOEL) & Single Statewide District",
        standards_framework="Hawaii Early Learning and Development Standards (HELDS)",
        framework_acronym="HI-HELDS",
        doe_agency_name="Hawaii Executive Office on Early Learning (EOEL) / HIDOE",
        approved_list_required=False,
        prek_program_name="EOEL Public Pre-Plus & Pre-K",
        key_priorities=["Cultural Richness", "Musical Storytelling", "Social Empathy"]
    ),
    "AK": StateProfile(
        code="AK", name="Alaska", tier=2,
        procurement_type="Local School District and Tribal Council Adoption",
        standards_framework="Alaska Early Learning Guidelines (AK-ELG)",
        framework_acronym="AK-ELG",
        doe_agency_name="Alaska Department of Education & Early Development (DEED)",
        approved_list_required=False,
        prek_program_name="Alaska Pre-Elementary Grants",
        key_priorities=["Oral Traditions", "Physical Balance", "Emotional Resilience"]
    ),
    "DC": StateProfile(
        code="DC", name="District of Columbia", tier=2,
        procurement_type="DCPS & Public Charter School Board Direct Local Procurement",
        standards_framework="District of Columbia Early Learning Standards (DC-ELS)",
        framework_acronym="DC-ELS",
        doe_agency_name="Office of the State Superintendent of Education (OSSE)",
        approved_list_required=False,
        prek_program_name="DC Universal Pre-K (Pre-K for All)",
        key_priorities=["Universal Pre-K Access", "Phonological Acuity", "Kinesthetic Learning"]
    ),

    # =========================================================================
    # TIER 3: 6 FEDERAL HEAD START & TITLE I PRIMARY STATES
    # =========================================================================
    "ID": StateProfile(
        code="ID", name="Idaho", tier=3,
        procurement_type="Federal Head Start Grantees & Local Private/Co-Op Procurement",
        standards_framework="Idaho Early Learning eXchange Guidelines & Federal ELOF",
        framework_acronym="ID-ELOF",
        doe_agency_name="Idaho State Department of Education (SDE) / Head Start Grants",
        approved_list_required=False,
        prek_program_name="Head Start / Community Pre-K Co-ops",
        key_priorities=["Federal ELOF Compliance", "Screen-Free Motor Readiness", "Phonemic Basics"]
    ),
    "WY": StateProfile(
        code="WY", name="Wyoming", tier=3,
        procurement_type="Federal Head Start Grantees & TANF/Early Learning Grantees",
        standards_framework="Wyoming Early Learning Guidelines & Federal ELOF",
        framework_acronym="WY-ELOF",
        doe_agency_name="Wyoming Department of Education (WDE)",
        approved_list_required=False,
        prek_program_name="Wyoming TANF Preschool Grants / Head Start",
        key_priorities=["Early Numeracy", "Physical Agility", "Acoustic Regulation"]
    ),
    "MT": StateProfile(
        code="MT", name="Montana", tier=3,
        procurement_type="Head Start Grantees & Local District Title I Set-Asides",
        standards_framework="Montana Early Learning Standards & Federal ELOF",
        framework_acronym="MT-ELOF",
        doe_agency_name="Montana Office of Public Instruction (OPI)",
        approved_list_required=False,
        prek_program_name="Montana Head Start Collaboration / Stars to Quality",
        key_priorities=["Indigenous Storytelling", "Gross Motor Endurance", "Auditory Attention"]
    ),
    "ND": StateProfile(
        code="ND", name="North Dakota", tier=3,
        procurement_type="Head Start Grantees & Best In Class Pre-K Grants",
        standards_framework="North Dakota Early Learning Standards & Federal ELOF",
        framework_acronym="ND-ELOF",
        doe_agency_name="North Dakota Department of Public Instruction (NDDPI)",
        approved_list_required=False,
        prek_program_name="ND Best in Class Grant Program",
        key_priorities=["Foundational Phonetics", "Spatial Geometry", "Classroom Harmony"]
    ),
    "SD": StateProfile(
        code="SD", name="South Dakota", tier=3,
        procurement_type="Head Start Grantees, Title I, and Tribal Early Learning Centers",
        standards_framework="South Dakota Early Learning Guidelines & Federal ELOF",
        framework_acronym="SD-ELOF",
        doe_agency_name="South Dakota Department of Education (SD DOE)",
        approved_list_required=False,
        prek_program_name="Head Start / Tribal Pre-K Consortia",
        key_priorities=["Federal ELOF Rigor", "Oral Cadence", "Motor Synchronization"]
    ),
    "NH": StateProfile(
        code="NH", name="New Hampshire", tier=3,
        procurement_type="Head Start Grantees & Local Community Child Care Partnerships",
        standards_framework="New Hampshire Early Learning Standards & Federal ELOF",
        framework_acronym="NH-ELOF",
        doe_agency_name="New Hampshire Department of Education (NH DOE)",
        approved_list_required=False,
        prek_program_name="New Hampshire Head Start & Community Pre-K",
        key_priorities=["Creative Play", "Auditory Sound Discrimination", "Emotional Grounding"]
    )
}

def get_state(code: str) -> Optional[StateProfile]:
    """Retrieve StateProfile by 2-letter uppercase postal code."""
    return STATES_REGISTRY.get(code.upper())

def get_states_by_tier(tier: int) -> List[StateProfile]:
    """Retrieve list of state profiles belonging to a specific procurement tier (1, 2, or 3)."""
    return [s for s in STATES_REGISTRY.values() if s.tier == tier]

def get_all_states() -> List[StateProfile]:
    """Return all cataloged states in alphabetical order by state code."""
    return sorted(STATES_REGISTRY.values(), key=lambda s: s.code)
