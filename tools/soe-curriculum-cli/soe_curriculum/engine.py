"""
Core Pedagogical Engine wrapping @early-childhood-lesson-extender.
Generates turnkey 10–15 minute screen-free, music-powered lesson extensions.
"""

from typing import Dict, List, Optional
from soe_curriculum.models import (
    LessonExtension,
    FiveDomainSpider,
    TrackInfo,
    LandInfo,
    HeroInfo
)
from soe_curriculum.standards import get_standards_for_track
from soe_curriculum.data_loader import DataLoader

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


class CurriculumEngine:
    def __init__(self, data_loader: Optional[DataLoader] = None):
        self.data_loader = data_loader or DataLoader()

    def generate_lesson(self, track_identifier: str, age_group: str = "Ages 2–7 (Pre-K to Grade 1)") -> LessonExtension:
        """Generate a complete 5-step LessonExtension for a given track identifier (id or slug)."""
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
            duration="10–15 Minutes",
            materials=bp["materials"],
            quest_mission=bp["mission"],
            rhythm_ignition=bp["ignition"],
            tactile_ritual=bp["ritual"],
            domain_spider=bp["spider"],
            teacher_whisper=bp["whisper"],
            standards=standards
        )

    def generate_all_lessons(self, age_group: str = "Ages 2–7 (Pre-K to Grade 1)") -> List[LessonExtension]:
        """Generate lessons for all 19 tracks in the album."""
        return [self.generate_lesson(t.slug, age_group) for t in self.data_loader.tracks]

    def generate_land_lessons(self, land_id: str, age_group: str = "Ages 2–7 (Pre-K to Grade 1)") -> List[LessonExtension]:
        """Generate lessons for all tracks in a given Land."""
        tracks = self.data_loader.get_tracks_by_land(land_id)
        if not tracks:
            raise ValueError(f"No tracks found for land '{land_id}'. Available: {list(self.data_loader.lands.keys())}")
        return [self.generate_lesson(t.slug, age_group) for t in tracks]
