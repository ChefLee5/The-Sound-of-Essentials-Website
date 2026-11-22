"""
Core Pedagogical Engine wrapping @early-childhood-lesson-extender.
Generates turnkey 10–15 minute screen-free, music-powered lesson extensions.
"""

from typing import Dict, List, Optional
from soe_curriculum.models import (
    LessonExtension,
    FiveDomainSpider,
    SocraticWonderCircle,
    TrackInfo,
    LandInfo,
    HeroInfo
)
from soe_curriculum.standards import get_standards_for_track
from soe_curriculum.data_loader import DataLoader
from soe_curriculum.critical_thinking import (
    REMODELLED_LESSON_CATALOG,
    get_strategies_by_land,
)

# Curated lesson templates for the 19 tracks matching SOE's exact pedagogical guidelines
LESSON_BLUEPRINTS: Dict[str, dict] = {
    "drill-time": {
        "mission": "Join Felix and Amara in Vitalis to form the Sovereign Cadet March and restore focused harmony to our classroom.",
        "materials": ["Floor tape / chalk line (optional)", "Wooden rhythm sticks or bare hands/feet"],
        "ignition": "Teacher leads a crisp 100 BPM military-style cadence with chest-pats and foot-stomps:\n"
                    "• Chant: 'Left, left, left-right-left! Wisdom is more precious than gold!'\n"
                    "• Children mirror the exact rhythm with alternating knee-taps while chanting the count '1, 2, 3, 4!'",
        "ritual": "The Bilateral March & Statue Reset:\n"
                  "1. Children line up along the carpet edge or circle-time rug.\n"
                  "2. Step 1 (March): March in place, lifting knees high to touch opposite elbows (bilateral midline crossing).\n"
                  "3. Step 2 (Shake-Off): On the lyric cue 'We want to shake!', shake left arm, right arm, left leg, right leg for 4 counts each to discharge excess kinetic energy.\n"
                  "4. Step 3 (Sovereign Freeze): On the beat drop, freeze completely still like an ancient mountain in Vitalis for 5 slow breaths.\n"
                  "5. Sit down in unison on the rug without speaking a single word.",
        "spider": FiveDomainSpider(
            language="Articulate crisp cadence chant ('Left, left, left-right-left; Sound off! 1, 2, 3, 4!') with vocal projection.",
            cognitive="Auditory response inhibition—processing sudden musical cues to switch from rapid shaking to absolute stillness.",
            physical="Gross-motor bilateral midline crossing (opposite knee-to-elbow touch) and vestibular balance stabilization.",
            science_sensory="Acoustic percussion resonance felt through floor vibrations into the feet, grounding kinetic hyperactivity.",
            social_emotional="Cooperative collective pacing; feeling synchronized pride as a unified circle-time community."
        ),
        "whisper": "Cross-body bilateral marching activates both cerebral hemispheres simultaneously while acoustic drumming synchronizes the vagus nerve, rapidly resetting the nervous system from chaotic fight-or-flight into calm social engagement."
    },
    "lets-stretch": {
        "mission": "Travel with Amara and Felix to the Canopy of Vitalis to breathe like great ancient trees and awaken our somatic awareness.",
        "materials": ["A washcloth, silk scarf, or bare hands", "Soft carpet or floor mat"],
        "ignition": "Teacher models the 4-count Ocean Inhale:\n"
                    "• 'Breathe in through your nose (1, 2, 3, 4)... Breathe out through your mouth (wooosh!).'\n"
                    "• Children hold their hands in front of their mouths to feel the warm tactile rush of their own breath.",
        "ritual": "Canopy Rise & Root Grounding:\n"
                  "1. Children place a scarf or washcloth on their heads.\n"
                  "2. Reach both arms high into the sky on tiptoes—stretching toward the sun without letting the scarf fall (proprioceptive control).\n"
                  "3. Slowly bend at the waist without bending the knees to touch toes, letting the scarf drift gently to the floor.\n"
                  "4. Pick up the scarf with toes of the left foot, then the right foot, testing balance and plantar fine motor grip.",
        "spider": FiveDomainSpider(
            language="Verbalize somatic sensations ('tight', 'soft', 'rooted', 'reaching') matching physical movement.",
            cognitive="Spatial awareness of body boundaries (kinesphere) and vertical/horizontal body axis orientation.",
            physical="Spinal elongation, hamstring flexibility, and intrinsic toe-muscle grasping mechanics.",
            science_sensory="Airflow thermodynamics (feeling exhaled air temperature) and vestibular balance fluid equilibrium.",
            social_emotional="Autonomous somatic regulation—learning that intentional breathing is a lifelong tool for emotional self-soothing."
        ),
        "whisper": "Intentional exhalations longer than inhalations stimulate the parasympathetic brake via the vagus nerve, dropping child heart rates into optimal readiness before cognitive work begins."
    },
    "numbers": {
        "mission": "Step through the Golden Gates of Numeria with Kwame and Octavia to build tactile towers using the Sacred Count.",
        "materials": ["10 wooden blocks, counting stones, or dried large pasta shells per pair", "Two wooden spoons or hands"],
        "ignition": "Call-and-response clapping percussion:\n"
                    "• Teacher: 'One clap. Follow me!' ➔ [CLAP!]\n"
                    "• Children: 'ONE!' ➔ [CLAP!]\n"
                    "• Increment through the track up to 10 claps with steady crescendo and group cheering.",
        "ritual": "The Tactile Stone Pyramid:\n"
                  "1. Children work in pairs with 10 physical stones or blocks on a cloth mat.\n"
                  "2. As the track counts each number, children place exactly one physical stone down with an audible 'tap'.\n"
                  "3. On 'One' tap one stone. On 'Two' add a stone. At 'Ten' assemble the stones into a complete pyramid (4-3-2-1 base).\n"
                  "4. Stand up and deliver a triumphant 10-beat group drumroll on knees.",
        "spider": FiveDomainSpider(
            language="Cardinal number words articulated clearly with precise 1-to-1 phonemic emphasis.",
            cognitive="One-to-one correspondence and spatial conservation of quantity (10 items remain 10 regardless of arrangement).",
            physical="Pincer grasp tactile placement (fine motor) coordinated with auditory rhythm timing.",
            science_sensory="Acoustic resonance contrast—comparing the sound of wood-on-wood tapping versus stone-on-cloth.",
            social_emotional="Turn-taking collaboration in pairs, celebrating shared completion of the 10-stone pyramid."
        ),
        "whisper": "Pairing physical tactile resistance (placing an object) with an auditory percussion beat anchors numerical cardinality into the parietal cortex far deeper than visual flashcards ever can."
    },
    "days-of-the-week": {
        "mission": "Ascend the Starlight Observatories of Celestia with Elias and Selene to weave the 7 Days of Creation into time rings.",
        "materials": ["7 wooden rings, colored clothespins, or ribbon strips per table", "A circular tray or plate"],
        "ignition": "Rhythmic finger-clicking and knee-slapping cadence singing the 7-day chorus:\n"
                    "• 'Sunday, Monday, Tuesday, Wednesday... Thursday, Friday, Saturday!'\n"
                    "• Alternate clicking fingers on right hand for daytime, left hand for nighttime.",
        "ritual": "The 7-Day Sun Wheel:\n"
                  "1. Place a circular paper plate or tray representing the sun in the center.\n"
                  "2. Children take 7 clothespins or ribbon pieces representing the 7 days.\n"
                  "3. As each day of the week is sung, clip one pin onto the rim moving clockwise.\n"
                  "4. Identify 'Today' by placing a golden star sticker or yellow leaf on the active day's pin.\n"
                  "5. Whisper the days that came before, and cheer for the days that lie ahead.",
        "spider": FiveDomainSpider(
            language="Temporal sequencing vocabulary ('yesterday', 'today', 'tomorrow') and ordinal temporal order.",
            cognitive="Understanding circular, cyclical time patterns versus linear progression.",
            physical="Hand-eye coordination and bilateral pincer pinch strength when attaching clothespins.",
            science_sensory="Solar diurnal cycles (daylight, sunsets, starry night sky observation).",
            social_emotional="Predictability and security—grounding young children in the soothing rhythm of consistent daily routines."
        ),
        "whisper": "Cyclical physical sequencing rituals anchor episodic memory in the hippocampus, giving children internal temporal stability that drastically reduces transition anxiety."
    },
    "alphabet-song-remix": {
        "mission": "Explore the Echoing Caves of Harmonia with Kenji and Aiko to discover the hidden beat inside every letter of the alphabet.",
        "materials": ["Sand trays, sensory salt bins, or sandpaper letter cards", "Smooth river pebbles"],
        "ignition": "The Syncopated Phonics Beat:\n"
                    "• Instead of rushing L-M-N-O-P, follow the Remix syncopated drumbreak:\n"
                    "• 'A A A... B B B... C C C... D... E E F F... G G!'\n"
                    "• Children bounce on their heels to the triple-pulse rhythm.",
        "ritual": "Sensory Letter Sculpting:\n"
                  "1. Provide a shallow tray filled with colored cornmeal or beach sand.\n"
                  "2. As the remix repeats letter clusters, children trace the letter with their index finger in the sand.\n"
                  "3. Shake the tray gently left-to-right (tactile reset) on the beat drop.\n"
                  "4. Place a pebble at the starting point of the letter stroke to anchor proper top-to-bottom stroke direction.",
        "spider": FiveDomainSpider(
            language="Phonemic isolation and distinct letter-name articulation without melodic slur.",
            cognitive="Pattern recognition between auditory rhythm breaks and visual grapheme shapes.",
            physical="Fine motor tactile finger tracing, wrist stabilization, and pre-writing grip control.",
            science_sensory="Somatosensory granular friction of sand against fingertips, activating sensory nerve endings.",
            social_emotional="Joy in phonological mastery; cheering when friends complete the full 26-letter circuit."
        ),
        "whisper": "Tracing graphemes in textured mediums while chanting rhythmic phonemes binds the visual occipital cortex, motor cortex, and auditory temporal lobe into a unified reading circuit."
    },
    "le-cheval": {
        "mission": "Ride with Athena and Ezra across the Plains of Luminosity to study the majestic strength of the horse in French and English.",
        "materials": ["Two clean plastic cups or coconut halves per child (for hooves)", "A wide open circle rug"],
        "ignition": "French Call-and-Response Trotting Rhythm:\n"
                    "• Chant: 'Deux accrets le cheval, fort et puissant!'\n"
                    "• Tap coconut halves or cups together on floor: [Clip-clop, clip-clop, clip-clop!]",
        "ritual": "Equine Gaits Exploration:\n"
                  "1. Children hold two cups facing downward on the floor.\n"
                  "2. Gait 1 (Walk - Slow): Four distinct beats [1 - 2 - 3 - 4] on the carpet.\n"
                  "3. Gait 2 (Trot - Two-beat): Alternating diagonal taps [1-2, 1-2, 1-2].\n"
                  "4. Gait 3 (Gallop - Three-beat syncopation): [Ba-da-BUM! Ba-da-BUM!].\n"
                  "5. Test equine panoramic vision: Stand tall and turn eyes left and right without moving head (peripheral vision challenge).",
        "spider": FiveDomainSpider(
            language="French vocabulary acquisition ('le cheval', 'fort', 'puissant') and equine gait terminology.",
            cognitive="Auditory tempo discrimination (accelerando from 4-beat walk to 3-beat syncopated gallop).",
            physical="Bilateral forearm and wrist coordination using cups as percussion tools; locomotor balance during gallop.",
            science_sensory="Equine anatomy (panoramic 350-degree vision, herbivore grazing, hooves) and acoustic percussive resonance.",
            social_emotional="Empathy and respect for animal nobility and courage in service of others."
        ),
        "whisper": "Mimicking equine gaits with percussive handheld instruments forces the brain to calculate complex polyrhythms, building cerebellar synaptic density crucial for higher-order mathematics."
    },
    "my-body": {
        "mission": "Team up with Vesta and Silas in Terrasol to map the living architecture of our strong, healthy bodies.",
        "materials": ["A hand mirror or partner", "Stickers or soft felt dots"],
        "ignition": "Rhythmic Body Tapping Chant:\n"
                    "• 'What’s on your face? Eyes, nose, mouth, chin!' [Tap each feature with fingertip]\n"
                    "• 'Don’t forget about your forehead, cheeks, and two ears!' [Gentle cup over ears]",
        "ritual": "The Head-to-Toe Somatosensory Scan:\n"
                  "1. Verse 1 (Face): Children look in mirror or pair with a buddy, touching each facial feature.\n"
                  "2. Verse 2 (Upper Body): Cross arms over chest to tap shoulders ('butterfly tap'), slide down to elbows, wrists, and wiggle all 10 fingertips.\n"
                  "3. Verse 3 (Lower Body): Tap hips, thighs, pat knees, grasp ankles, and stomp 10 individual toes.\n"
                  "4. Bridge (Living Vitality): Inhale deeply, placing right hand on heart to feel the physical cardiac pulse.",
        "spider": FiveDomainSpider(
            language="Accurate anatomical vocabulary (chin, forehead, neck, ankles, thighs, living foods).",
            cognitive="Spatial top-to-bottom ordering and bilateral bodily symmetry (left ear vs. right ear).",
            physical="Proprioceptive tactile mapping and bilateral butterfly self-soothing cross-taps.",
            science_sensory="Biological sensory perception (heartbeat rhythm, respiratory movement, joint articulation).",
            social_emotional="Positive somatic self-image, bodily autonomy, and gratitude for one’s physical temple."
        ),
        "whisper": "Cross-body tapping (the butterfly hug) directly calms the amygdala by activating bilateral sensory pathways, reinforcing a grounded and secure internal somatic body schema."
    },
    "manners": {
        "mission": "Visit the Tea Gardens of Harmonia with Kenji and Aiko to master the Magic Keys of kindness and respectful communication.",
        "materials": ["A small wooden bowl or tea cup per child", "Smooth stones or flowers to pass"],
        "ignition": "The Reciprocal Courtesies Chant:\n"
                    "• 'When you receive, say Thank You!' ➔ 'Then I’ll say You’re Welcome!'\n"
                    "• 'Yes, Please!' ➔ 'Excuse Me!' ➔ 'No, Thank You!' ➔ 'I’m Sorry!'\n"
                    "• Practice vocal tone modulation: whispering with warmth, not shouting.",
        "ritual": "The Passing Bowl Ceremony:\n"
                  "1. Children sit in an unbroken circle on the rug.\n"
                  "2. Child 1 gently passes a flower or smooth stone in a bowl to Child 2 with two hands, making soft eye contact and saying: 'For you, my friend.'\n"
                  "3. Child 2 receives with two hands: 'Thank you, [Name]!'\n"
                  "4. Child 1 responds with an open smile: 'You are welcome.'\n"
                  "5. Repeat around the entire circle until every child has experienced the giving and receiving loop.",
        "spider": FiveDomainSpider(
            language="Pragmatic prosocial phrases ('Thank you', 'You're welcome', 'Excuse me', 'I'm sorry') with authentic inflection.",
            cognitive="Theory of mind—understanding the emotional impact of polite words on another person's feelings.",
            physical="Bilateral two-handed grasp and delicate passing coordination without dropping fragile contents.",
            science_sensory="Tactile softness of flower petals or cool polish of river stone; visual gaze anchoring.",
            social_emotional="Prosocial bonding, reciprocal gratitude, and mutual respect in community living."
        ),
        "whisper": "Practicing two-handed giving paired with direct eye contact releases oxytocin in both giver and receiver, replacing dominance-seeking classroom behaviors with communal trust."
    }
}


# Curated Step 3 (Seriphia's Socratic Wonder Circle) blueprints for all 19 canonical published tracks.
# Every track activates strategies strictly from its canonical Land's 5 assigned strategies (7 x 5 = 35).
TRACK_SOCRATIC_CIRCLES: Dict[str, dict] = {
    "sunny-day": {
        "rhythm_cue": "Three-Beat Detective Knock (90 BPM: Knock-Knock-Knock — 'What Clue Did We Notice?')",
        "strategies": ["S-5", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Accuracy", "Specificity", "Clarity"],
        "prompts": [
            "Intellectual Humility (S-5): Before stepping outside on a sunny morning, how can we check whether the air is warm or chilly instead of just guessing from bright light?",
            "Testing Assumptions (S-30): Many people assume bright sunshine always means hot weather—what sensory evidence (skin, breath, frost, wind) proves that assumption isn't always true?",
            "Plausible Inferences (S-32): If we see long shadows stretching across the rug or yard, what clues tell us where the Sun is in the sky right now?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Point to warm sunlit spots vs. cool shady spots and say 'I notice...' before guessing.",
            "Pathfinders (Ages 4–5)": "Touch two stones—one from the sun and one from the shade—to compare direct temperature clues.",
            "Wayfarers (Ages 6–7)": "Trace why winter sunlight can look bright while air stays cold, testing assumption vs. observation.",
        },
    },
    "days-of-the-week": {
        "rhythm_cue": "Domino Clap Ripple Around the Circle (100 BPM: Yesterday -> Today -> Tomorrow)",
        "strategies": ["S-11", "S-12", "S-13", "S-35"],
        "intellectual_standards": ["Logic", "Completeness", "Significance"],
        "prompts": [
            "Analogous Transfer (S-11): How is the 7-day wheel of Sunday through Saturday just like a circle of seasons or a clock face that keeps returning?",
            "Clarifying Core Cycles (S-13): What changes from daytime clouds to sparkling night stars while Earth turns, and what stays steady every single week?",
            "Exploring Consequences (S-35): If our week had no predictable rhythm of rest days and learning days, what ripple would happen to our bodies and community?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Move the golden star pin one space forward and whisper 'yesterday' and 'today'.",
            "Pathfinders (Ages 4–5)": "Name one routine that happens on the same day every week and why knowing it feels safe.",
            "Wayfarers (Ages 6–7)": "Map a 3-step consequence chain showing how preparing on Sunday evening changes Monday morning.",
        },
    },
    "alphabet-song-remix": {
        "rhythm_cue": "Open-Palm Echo Tap (95 BPM: Slow down the sound — Echo back clearly)",
        "strategies": ["S-6", "S-14", "S-21", "S-22", "S-28"],
        "intellectual_standards": ["Precision", "Clarity", "Consistency"],
        "prompts": [
            "Clarifying Word & Sound Boundaries (S-14): Why did our Remix slow down L-M-N-O-P instead of rushing them into one blurry sound?",
            "Listening Critically (S-22): Close your eyes as a friend taps a letter rhythm in the sand—can you echo back the exact sound you heard without peeking?",
            "Thinking Vocabulary (S-28): What is the difference between hearing a letter's NAME and testing the SOUND that letter makes inside your own name?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Clap one crisp beat per letter in the child's first name with zero rush.",
            "Pathfinders (Ages 4–5)": "Echo a partner's chosen letter sound back accurately before tracing it in sand.",
            "Wayfarers (Ages 6–7)": "Compare two letters that look or sound similar (like b/d or m/n) using precise sensory descriptors.",
        },
    },
    "horses-interlude": {
        "rhythm_cue": "Three-Beat Detective Knock ('Wait a Minute — Check the Evidence!')",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Accuracy", "Precision", "Relevance"],
        "prompts": [
            "Evaluating Evidence (S-33): In 'Horses Interlude', donkeys, sheep, pigs, and chickens showed up first—what exact sound and body clues proved each one was NOT a horse?",
            "Testing Assumptions (S-30): Why might someone assume a donkey is a horse at first glance, and what closer observations separate the two?",
            "Intellectual Humility (S-5): When we hear an unfamiliar animal sound behind a curtain, why is it wise to say 'Let's listen again and check clues' before deciding?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Sort animal voice clues aloud: 'Horse sound or different friend?'",
            "Pathfinders (Ages 4–5)": "Name two observable clues (ears, hooves, voice, size) that separate a horse from a donkey or sheep.",
            "Wayfarers (Ages 6–7)": "Explain why one shared trait (four legs) is not enough evidence to classify two creatures as identical.",
        },
    },
    "le-cheval": {
        "rhythm_cue": "Passing Bowl & Two-Finger Chin Tap (85 BPM Waltz: 'Ask the Root Question')",
        "strategies": ["S-16", "S-17", "S-19", "S-20", "S-24"],
        "intellectual_standards": ["Depth", "Fairmindedness", "Significance"],
        "prompts": [
            "Questioning Deeply (S-17): The song tells us the horse ('le cheval') can see almost all the way around its body—why does a grazing animal need wide panoramic vision?",
            "Generating Solutions (S-19): If two riders speak different languages (French and English), what fair, respectful ways can they communicate and care for the same horse together?",
            "Evaluating Rules & Strength (S-20): The lyric calls the horse 'fort et puissant' (strong and powerful)—what makes using strength wise and protective instead of bossy?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Notice how hands move gently when brushing a gentle horse vs. loud stomping.",
            "Pathfinders (Ages 4–5)": "Test wide side-vision without turning your head and explain how it helps horses stay safe.",
            "Wayfarers (Ages 6–7)": "Hold a 3-turn Socratic circle weighing how physical strength pairs with gentle stewardship.",
        },
    },
    "lets-stretch": {
        "rhythm_cue": "4-Count Breath Anchor (75 BPM: Inhale 1-2-3-4, Exhale Wooosh — Notice Before Acting)",
        "strategies": ["S-1", "S-7", "S-8", "S-9", "S-27"],
        "intellectual_standards": ["Clarity", "Consistency", "Adequacy"],
        "prompts": [
            "Thinking Independently (S-1): Before looking at a neighbor, how can you listen to your own muscles and breath to find your steady balance while holding the scarf?",
            "Intellectual Perseverance (S-8): When touching your toes or picking up the scarf with your toes feels wobbly, what happens when we slow our breath and try a second time?",
            "Comparing Ideals with Actual Practice (S-27): We say calm breathing helps when we feel frustrated—how can we remember to use our 4-count stretch breath during a real hard moment?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Feel warm breath on your palm and name whether your body feels 'wiggly' or 'calm'.",
            "Pathfinders (Ages 4–5)": "Invent one original slow-tree stretch independently before mirroring a partner.",
            "Wayfarers (Ages 6–7)": "Connect bodily practice (slow exhale) directly to thinking clearly before answering a tricky question.",
        },
    },
    "drill-time": {
        "rhythm_cue": "110 BPM Freeze-and-Think Cadence (Left-Right-Freeze — Hold 4 Quiet Beats)",
        "strategies": ["S-1", "S-7", "S-8", "S-9", "S-27"],
        "intellectual_standards": ["Consistency", "Significance", "Logic"],
        "prompts": [
            "Comparing Ideals with Practice (S-27): Our Drill Time chant says 'Wisdom is more precious than gold'—what does choosing wisdom look like with our feet, hands, and voice right now?",
            "Intellectual Perseverance (S-8): During the rapid shake-off and sudden Sovereign Freeze, why is stopping on cue harder than keeping moving—and how does practice strengthen self-control?",
            "Confidence in Reason (S-9): Why does staying on a steady, thoughtful path together help everyone learn better than rushing without listening?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Notice the difference between fast shaking hands and still mountain hands.",
            "Pathfinders (Ages 4–5)": "Explain one way practicing the freeze helps you pause before grabbing or shouting.",
            "Wayfarers (Ages 6–7)": "Compare 'gold' (something shiny) with 'wisdom' (knowing how to act fairly and thoughtfully).",
        },
    },
    "numbers": {
        "rhythm_cue": "Three-Beat Detective Knock (90 BPM: Tap-Tap-Tap — 'Count & Check the Criteria!')",
        "strategies": ["S-10", "S-15", "S-29", "S-31", "S-34"],
        "intellectual_standards": ["Precision", "Accuracy", "Relevance"],
        "prompts": [
            "Refining Generalizations (S-10): If we rearrange our 10 pyramid stones into one long line instead of a triangle, did the number of stones change or stay exactly 10? Prove it!",
            "Distinguishing Relevant from Irrelevant Facts (S-31): Suppose Kwame has 4 gray stones, 3 smooth wooden blocks, and is wearing a blue shirt—which details matter for counting the total pieces, and which detail is a decoy?",
            "Recognizing Contradictions (S-34): If someone claps 7 times while saying '10 stones!', how can our ears and fingers spot the mismatch right away?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Touch and move one stone per clap so hands and voice always match.",
            "Pathfinders (Ages 4–5)": "Check whether spreading 5 stones far apart changes how many stones there are.",
            "Wayfarers (Ages 6–7)": "Spot the decoy detail in a live counting riddle and explain why it does not affect the sum.",
        },
    },
    "my-body": {
        "rhythm_cue": "Butterfly Heart-Tap Check (95 BPM: Feel the Pulse — Observe Before Inferring)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Accuracy", "Completeness", "Logic"],
        "prompts": [
            "Evaluating Evidence (S-33): Place your palm over your heart before jumping and after 10 jumps—what direct physical evidence tells you how movement changes your heartbeat?",
            "Evaluating Explanations (S-18): Our song says we keep our bodies strong by 'consuming living foods, stretching, and keeping our hearts right'—why do all three work together instead of just one?",
            "Plausible Inferences (S-32): If your eyes are closed and you touch your forehead, chin, and elbows, how does your brain still know exactly where each body part is?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Tap eyes, ears, nose, and hands while naming what each sense helps us notice.",
            "Pathfinders (Ages 4–5)": "Compare heartbeat speed resting vs. marching and report what your hand actually felt.",
            "Wayfarers (Ages 6–7)": "Connect living whole foods, water, rest, and movement as a testable cause-and-effect health system.",
        },
    },
    "manners": {
        "rhythm_cue": "Passing Bowl Silent Dialogue (85 BPM: Echo Friend's Words Before Answering)",
        "strategies": ["S-6", "S-14", "S-21", "S-22", "S-28"],
        "intellectual_standards": ["Clarity", "Fairmindedness", "Consistency"],
        "prompts": [
            "Clarifying Word Meaning (S-14): What is the difference between saying a quick robotic 'Sorry!' and showing a true, caring repair after bumping a friend?",
            "Listening Critically (S-22): When a friend passes the bowl and says 'No, thank you' politely, how can we echo their boundary back with respect?",
            "Intellectual Courage (S-6): Why does it sometimes take real courage to say 'Excuse me' or 'No, thank you' kindly when everyone else is rushing?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Practice warm eye contact and two-handed giving while saying 'Thank you' and 'You're welcome'.",
            "Pathfinders (Ages 4–5)": "Role-play both a rushed 'Sorry' and a caring 'Are you okay? Let me help pick it up' repair.",
            "Wayfarers (Ages 6–7)": "Clarify how courteous boundaries ('No, thank you') protect both self-respect and friendship.",
        },
    },
    "time": {
        "rhythm_cue": "Twilight Pendulum Sway (90 BPM: Morning -> Afternoon -> Evening Ripple)",
        "strategies": ["S-11", "S-12", "S-13", "S-23", "S-35"],
        "intellectual_standards": ["Logic", "Relevance", "Significance"],
        "prompts": [
            "Clarifying Issues & Routines (S-13): Besides looking at clock numbers like 1:00 or 1:30, what light, sky, and body clues tell us whether it is morning, afternoon, or evening?",
            "Exploring Consequences (S-35): If we skipped our calm evening wind-down routine and stayed up playing late, what ripple would happen at morning wake-up?",
            "Interdisciplinary Connections (S-23): How does keeping steady musical tempo in Harmonia connect to keeping steady daily routines in Celestia?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Sort 3 picture/object clues into 'Wake-Up Morning', 'Lunch Afternoon', and 'Bedtime Evening'.",
            "Pathfinders (Ages 4–5)": "Explain which sensory clues (sun height, tummy hunger, yawns) confirm the time of day.",
            "Wayfarers (Ages 6–7)": "Trace a 3-step morning-to-evening consequence chain and connect rhythmic beat to daily pacing.",
        },
    },
    "changes": {
        "rhythm_cue": "Gentle 80 BPM Weather-Shift Pulse (Observe What Shifts vs. What Stays Constant)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Consistency", "Accuracy", "Depth"],
        "prompts": [
            "Evaluating Evidence (S-33): The song notices 'It's sunny outside. Yesterday it rained. Somewhere it might snow tomorrow'—what outdoor clues prove weather is always changing?",
            "Examining Assumptions (S-30): When a stormy or rainy day arrives, why might we assume the whole day is ruined—and what real-world benefits does changing weather bring?",
            "Plausible Inferences (S-32): Why does the song contrast changing weather with unchanging love—what stays steady in a caring family even when moods or seasons shift?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Act out sun, rain, and snow with hands, then hug self for 'steady love'.",
            "Pathfinders (Ages 4–5)": "Name two things that change every week and two loving promises that stay steady.",
            "Wayfarers (Ages 6–7)": "Compare evidence of seasonal/weather shifts across places while explaining why constants anchor security.",
        },
    },
    "one-hundred": {
        "rhythm_cue": "100 BPM Decuple Clap-Check (10-20-30... Spot the Structure!)",
        "strategies": ["S-10", "S-15", "S-29", "S-31", "S-34"],
        "intellectual_standards": ["Precision", "Logic", "Completeness"],
        "prompts": [
            "Noting Structural Similarities & Differences (S-29): How is counting by tens (10, 20, 30... 100) like counting 1 to 10—and what makes ten-bundles faster and more reliable?",
            "Developing Evaluation Criteria (S-15): If we have a giant jar of 100 beans, what criteria make a counting method fair and easy to double-check without losing track?",
            "Refining Generalizations (S-10): Does a bigger pile ALWAYS have more items than a neat stack of 100 small stones? How could big blocks trick our eyes?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Drop 10 stones into a cup together and cheer each full bundle of ten.",
            "Pathfinders (Ages 4–5)": "Compare a loose messy pile of 20 beans with two neat 10-stone rows to check accuracy.",
            "Wayfarers (Ages 6–7)": "Design a rule for verifying a 100-item count and explain why visual volume can mislead.",
        },
    },
    "the-ocean": {
        "rhythm_cue": "60 BPM Slow Ocean-Wave Exhale (Listen Deeply Before Speaking)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Depth", "Accuracy", "Clarity"],
        "prompts": [
            "Evaluating Evidence (S-33): As we listen to slow 60 BPM ocean waves, what do you notice happening to the speed of your own breathing and shoulders?",
            "Evaluating Explanations (S-18): When we ripple a water tray or jump rope, why do waves look like the water is racing forward even though a floating cork mostly bobs up and down?",
            "Intellectual Humility (S-5): Much of the deep ocean has never been seen by human eyes—why does admitting 'We don't know yet' make ocean explorers better scientists?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Sway softly with 60 BPM wave breaths and tap gentle crest-up, trough-down motions.",
            "Pathfinders (Ages 4–5)": "Watch a floating leaf or cork on rippled water and describe what it actually does.",
            "Wayfarers (Ages 6–7)": "Connect ocean waves (water energy) with acoustic sound waves (air vibration) using direct observation.",
        },
    },
    "hard-words": {
        "rhythm_cue": "Passing Shell Slow-Syllable Tap (85 BPM: Slow Down -> Notice Feelings -> Break Into Beats)",
        "strategies": ["S-2", "S-3", "S-4", "S-25", "S-26"],
        "intellectual_standards": ["Fairmindedness", "Clarity", "Precision"],
        "prompts": [
            "Thoughts Underlying Feelings (S-4): When you hear a big multi-syllable word like 'Louisiana' or 'vegetables', what thought makes your tummy feel frustrated—and what calm thought helps you slow down?",
            "Fairmindedness (S-3): If a friend stumbles over a tricky word in circle time, how does it feel from their side of the rug if others laugh versus if everyone slows down and taps syllables together?",
            "Overcoming Egocentricity (S-2): Why is a word that feels easy for one person sometimes brand-new and hard for someone learning another language or starting out?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Tap slow syllables on knees ('spa-ghet-ti') and cheer every brave try.",
            "Pathfinders (Ages 4–5)": "Swap spots on the rug to practice encouraging a friend trying a tricky word.",
            "Wayfarers (Ages 6–7)": "Name the hidden thought behind frustration ('I can't do it!') and replace it with a fairminded strategy ('Break it into beats!').",
        },
    },
    "shapes": {
        "rhythm_cue": "Three-Beat Detective Knock (95 BPM: Count the Sides — Test the Rule!)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Precision", "Consistency", "Accuracy"],
        "prompts": [
            "Testing Assumptions (S-30): If we tilt a square onto one corner so it looks like a diamond, is it STILL a square? Let's test our song's rule ('four equal sides' and square corners)!",
            "Evaluating Evidence (S-33): How do our fingers prove the difference between a flat circle drawn on paper and a 3D sphere (ball) we can roll across the rug?",
            "Evaluating Theories (S-18): Why do honeybees build hexagons and bridges use triangles—what happens when we gently press on a wooden-stick triangle versus a square?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Trace round vs. pointy edges with fingers on real household objects.",
            "Pathfinders (Ages 4–5)": "Rotate a square block on its corner and count its 4 equal sides to check if its shape changed.",
            "Wayfarers (Ages 6–7)": "Test structural stability of a triangle vs. square and compare 2D shapes against 3D cubes/spheres.",
        },
    },
    "months-of-the-year": {
        "rhythm_cue": "95 BPM Twelve-Step Seasonal Orbit (Connect Months -> Seasons -> Ecosystems)",
        "strategies": ["S-11", "S-12", "S-13", "S-23", "S-35"],
        "intellectual_standards": ["Completeness", "Logic", "Significance"],
        "prompts": [
            "Interdisciplinary Connections (S-23): Our intro builds from 'seconds, minutes, hours, days, weeks, months'—how do tiny seconds add up to whole seasons of sprouting seeds and falling leaves?",
            "Developing One's Perspective (S-12): In January, is it snowy everywhere on Earth, or are children on the other side of our planet having sunny summer?",
            "Exploring Consequences (S-35): How do farmers, squirrels, and families plan differently in September and October because they know winter months follow?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Clap through the 12 months and cheer when your birthday month arrives.",
            "Pathfinders (Ages 4–5)": "Match clothing and tree clues to winter, spring, summer, and autumn months.",
            "Wayfarers (Ages 6–7)": "Compare seasonal evidence across hemispheres and trace how humans and animals prepare across the 12-month cycle.",
        },
    },
    "rain": {
        "rhythm_cue": "70 BPM Raindrop Finger-Patter (Observe -> Infer -> Test to Know!)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Accuracy", "Logic", "Depth"],
        "prompts": [
            "Examining Assumptions (S-30): When clear water drops appear outside a cold red berry-water cup, why do many assume the cup leaked—and how does the clear color disprove that assumption?",
            "Evaluating Evidence (S-33): Our song chants 'Watching raindrops falling down, cleaning the atmosphere'—what sights, smells, and puddle clues can we observe right after rain falls?",
            "Intellectual Humility (S-5): Why does a real Terrasol scientist love saying 'I don't know yet—let's design a fair test!' instead of rushing to guess?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Tap soft 2-finger drizzle vs. 8-finger rain and describe what rain feels and smells like.",
            "Pathfinders (Ages 4–5)": "Compare a dry bean jar and a damp-cloth bean jar to test what rain gives living seeds.",
            "Wayfarers (Ages 6–7)": "Use the red-tinted cold cup condensation check to separate hidden assumptions from empirical evidence.",
        },
    },
    "after-the-storm": {
        "rhythm_cue": "65 BPM Sanctuary Rainbow Arc (4-Beat Quiet Pause -> Reflect on Growth)",
        "strategies": ["S-5", "S-18", "S-30", "S-32", "S-33"],
        "intellectual_standards": ["Completeness", "Fairmindedness", "Significance"],
        "prompts": [
            "Plausible Inferences (S-32): After a storm passes, what clues on the ground, in the sky, and in the air tell us the storm happened even if we slept through it?",
            "Evaluating Explanations (S-18): Why does a rainbow need BOTH lingering water droplets AND returning sunlight—what does that teach us about hard moments and calm recovery?",
            "Testing Assumptions (S-30): When a stormy feeling (anger, worry, or tears) hits, why is it false to assume the storm will last forever—and what calm tools help our sanctuary reset?",
        ],
        "scaffolds": {
            "Sprouts (Ages 2–4)": "Trace a slow rainbow arc overhead while taking 3 calm 65 BPM breaths.",
            "Pathfinders (Ages 4–5)": "Spot 3 after-rain clues (wet leaves, puddles, earthworms, fresh air) and explain how rain helped.",
            "Wayfarers (Ages 6–7)": "Synthesize how sunlight + water create rainbows and connect physical weather recovery to emotional resilience.",
        },
    },
}


def _build_socratic_wonder_circle(track: TrackInfo, land_name: str, hero_guides: str) -> SocraticWonderCircle:
    """Build a canonical Step 3 Seriphia's Socratic Wonder Circle for any of the 19 tracks."""
    slug = track.slug.lower()
    land_id = track.land_id.lower()
    spec = TRACK_SOCRATIC_CIRCLES.get(slug)

    # Pull canonical linked remodelled units for this track (fallback to Land units)
    matched_units = [u for u in REMODELLED_LESSON_CATALOG if u.soe_track_slug == slug]
    if not matched_units:
        matched_units = [u for u in REMODELLED_LESSON_CATALOG if u.soe_land_id == land_id][:3]
    unit_refs = [f"Unit #{u.unit_id}: {u.source_title} (PDF p.{u.pdf_page})" for u in matched_units[:4]]

    if spec:
        return SocraticWonderCircle(
            duration="4 Minutes",
            rhythm_cue=spec["rhythm_cue"],
            strategies_activated=spec["strategies"],
            intellectual_standards=spec["intellectual_standards"],
            prompts=spec["prompts"],
            age_tier_scaffolds=spec["scaffolds"],
            remodelled_unit_refs=unit_refs,
        )

    # Deterministic fallback pulling the Land's 5 canonical strategies
    land_strats = get_strategies_by_land(land_id=land_id)
    codes = [s.code for s in land_strats]
    prompts = [f"{s.formal_name} ({s.code}): {s.socratic_spark}" for s in land_strats[:3]]
    return SocraticWonderCircle(
        duration="4 Minutes",
        rhythm_cue="Open-Palm Echo Tap (60–90 BPM: Pause 4 Beats Before Answering)",
        strategies_activated=codes,
        intellectual_standards=["Clarity", "Accuracy", "Fairmindedness"],
        prompts=prompts,
        age_tier_scaffolds={
            "Sprouts (Ages 2–4)": f"Point to real sensory clues in {land_name} before guessing.",
            "Pathfinders (Ages 4–5)": f"Test one simple hands-on prediction with {hero_guides}.",
            "Wayfarers (Ages 6–7)": f"Share reasons and echo a friend's perspective in {land_name}'s Wonder Circle.",
        },
        remodelled_unit_refs=unit_refs,
    )


class CurriculumEngine:
    def __init__(self, data_loader: Optional[DataLoader] = None):
        self.data_loader = data_loader or DataLoader()

    def generate_lesson(self, track_identifier: str, age_group: str = "Ages 2–7 (Pre-K to Grade 2)") -> LessonExtension:
        """Generate a complete 4-step Rhythm-to-Reason LessonExtension (15 min) for a track."""
        track = self.data_loader.get_track(track_identifier)
        if not track:
            raise ValueError(f"Track '{track_identifier}' not found in SOE catalog.")

        land = self.data_loader.get_land(track.land_id)
        land_name = land.name if land else track.land_id.capitalize()
        land_color = land.color if land else track.color
        hero_guides = land.duo_label if land and land.duo_label else "Seriphia Sovereign"

        # Check blueprint
        slug = track.slug.lower()
        bp = LESSON_BLUEPRINTS.get(slug)

        if not bp:
            # Fallback algorithmic generator honoring strict SOE rules
            bp = {
                "mission": f"Join {hero_guides} in {land_name} on an acoustic sensory quest to explore {track.title}.",
                "materials": ["Household rhythm sticks or wooden spoons", "Sensory mat or carpet circle"],
                "ignition": f"Teacher models a steady 2-minute rhythmic call-and-response beat to '{track.title}', synchronizing clapping and vocal chanting with the children.",
                "ritual": f"The Hands-On Sensory Discovery:\n"
                          f"1. Children gather in a circle with tactile items.\n"
                          f"2. Follow the musical cues of {track.title} to touch, sort, and move in rhythmic unison.\n"
                          f"3. Pair high-reach movements with deep somatic exhalations.\n"
                          f"4. Freeze in quiet stillness at the final chord.",
                "spider": FiveDomainSpider(
                    language=f"Articulate clear auditory phrasing and target vocabulary connected to {track.title}.",
                    cognitive=f"Identify rhythmic patterns, tempo shifts, and conceptual categories in {land_name}.",
                    physical="Gross motor whole-body balance, bilateral coordination, and fine motor finger rhythm.",
                    science_sensory="Tactile exploration of real-world materials and acoustic auditory pitch discrimination.",
                    social_emotional="Cooperative participation, shared attentional focus, and calming self-regulation."
                ),
                "whisper": "Auditory rhythmic pacing stimulates brainstem regulation and synchronizes attention across the classroom without visual screen fatigue."
            }

        standards = get_standards_for_track(slug)
        socratic_circle = _build_socratic_wonder_circle(track, land_name, hero_guides)

        return LessonExtension(
            track_id=track.id,
            track_slug=track.slug,
            title=track.title,
            land_name=land_name,
            land_id=track.land_id,
            land_color=land_color,
            domain_icon=track.domain_icon,
            hero_guides=hero_guides,
            age_group=age_group,
            duration="15 Minutes",
            materials=bp["materials"],
            quest_mission=bp["mission"],
            rhythm_ignition=bp["ignition"],
            tactile_ritual=bp["ritual"],
            socratic_wonder_circle=socratic_circle,
            domain_spider=bp["spider"],
            teacher_whisper=bp["whisper"],
            standards=standards
        )

    def generate_all_lessons(self, age_group: str = "Ages 2–7 (Pre-K to Grade 2)") -> List[LessonExtension]:
        """Generate lessons for all 19 tracks in the album."""
        return [self.generate_lesson(t.slug, age_group) for t in self.data_loader.tracks]

    def generate_land_lessons(self, land_id: str, age_group: str = "Ages 2–7 (Pre-K to Grade 2)") -> List[LessonExtension]:
        """Generate lessons for all tracks in a given Land."""
        tracks = self.data_loader.get_tracks_by_land(land_id)
        if not tracks:
            raise ValueError(f"No tracks found for land '{land_id}'. Available: {list(self.data_loader.lands.keys())}")
        return [self.generate_lesson(t.slug, age_group) for t in tracks]
