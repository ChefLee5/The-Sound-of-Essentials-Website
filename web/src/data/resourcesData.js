/**
 * ============================================================================
 * THE SOUND OF ESSENTIALS — 4-PART "START HERE." RESOURCES HUB DATA ENGINE
 * ============================================================================
 * Architecture modeled on a 4-stage lifecycle curriculum + weekly notes archive:
 *   Part 1: Sound Foundations (/resources/foundations)  — 5 flagship guides
 *   Part 2: Play & Daily Practice (/resources/play)     — 5 flagship guides
 *   Part 3: Kindergarten Readiness (/resources/readiness) — 5 flagship guides
 *   Part 4: Home & Classroom Systems (/resources/classrooms) — 5 flagship guides
 *   Archive: The SOE Sound Notes (/resources/notes)     — Weekly dual-published notes
 *
 * Canon Guardrails:
 *   - Strictly Ages 2–7 (Toddler, Pre-K to Grade 2)
 *   - Public guide voice: Seriphia & The Sound of Essentials Early Learning Team
 *   - Zero fabricated statistics, zero banned entities, zero money-back claims
 * ============================================================================
 */

export const RESOURCE_AUTHOR = {
  name: 'Seriphia',
  role: 'Sovereign Guide · The Sound of Essentials',
  team: 'The Sound of Essentials Early Learning Collective',
};

export const RESOURCE_PILLARS = [
  {
    id: 'foundations',
    partNumber: 1,
    partLabel: 'Part 1 — Sound Foundations',
    shortTitle: 'Sound Foundations',
    cardKicker: 'PART 1 · FOUNDATIONS',
    cardSubtitle: 'Ear-first rhythm routines for ages 2–7',
    path: '/resources/foundations',
    description:
      'New to screen-free rhythm learning? Start with five short guides that show how ages 2–7 absorb letter sounds, calm focus, and daily structure through music.',
    coverImg: '/assets/lands/harmonia-panorama.webp',
    coverAlt: 'Harmonia panoramic musical landscape for Sound Foundations',
    accentColor: '#d4a843',
    landId: 'harmonia',
    offerBridge: {
      badge: 'OPEN LISTENING INVITATION',
      title: 'Experience the 19-Track Rhythm Quest Album',
      body: 'Receive all 19 studio-recorded acoustic tracks (60–80 BPM) and the printable First 10 Minutes Tactile Ritual Card as our founding gift.',
      ctaLabel: 'Enter the Listening Room →',
      ctaUrl: '/listen',
    },
  },
  {
    id: 'play',
    partNumber: 2,
    partLabel: 'Part 2 — Play & Daily Practice',
    shortTitle: 'Play & Daily Practice',
    cardKicker: 'PART 2 · DAILY HABITS',
    cardSubtitle: 'Tactile sound games, car rides, and calm transitions',
    path: '/resources/play',
    description:
      'Turn everyday car rides, morning transitions, and bedtime routines into joyful, hands-on sound play that toddlers and preschoolers ask for again.',
    coverImg: '/assets/marketing/quest-collage.webp',
    coverAlt: 'Children and Rhythm Quest characters in tactile daily sound play',
    accentColor: '#c4785a',
    landId: 'vitalis',
    offerBridge: {
      badge: 'TACTILE HOME RITUALS',
      title: 'Pair the Music with Tactile Coloring & Printables',
      body: 'Begin with the gifted 19-track album and add the 40-page Quest Starter Coloring Pack ($7) or illustrated Rhythm Quest companion book ($19).',
      ctaLabel: 'Explore the Album & Starter Kit →',
      ctaUrl: '/listen',
    },
  },
  {
    id: 'readiness',
    partNumber: 3,
    partLabel: 'Part 3 — Kindergarten Readiness',
    shortTitle: 'Kindergarten Readiness',
    cardKicker: 'PART 3 · AGES 4–7',
    cardSubtitle: 'Phonemic awareness, counting, and 8-week prep',
    path: '/resources/readiness',
    description:
      'Build real reading readiness, rhythmic counting, and pencil-on-paper stamina for ages 4–7 without tablet battles or passive tap-and-guess apps.',
    coverImg: '/assets/lands/celestia-panorama.webp',
    coverAlt: 'Celestia panoramic landscape for Kindergarten Readiness (Ages 4 to 7)',
    accentColor: '#7fb685',
    landId: 'numeria',
    offerBridge: {
      badge: '8-WEEK TACTILE QUEST',
      title: 'Explore the 40-Day Rhythm Ready Workbook',
      body: 'Combine 400 hands-on workbook activities with the 4,000+ word Essential Picture Dictionary ($55) for screen-free mastery across all 7 Lands.',
      ctaLabel: 'View Workbook & Dictionary →',
      ctaUrl: '/rhythm-ready',
    },
  },
  {
    id: 'classrooms',
    partNumber: 4,
    partLabel: 'Part 4 — Home & Classroom Systems',
    shortTitle: 'Home & Classroom Systems',
    cardKicker: 'PART 4 · EDUCATORS & COMPARE',
    cardSubtitle: 'Screen-free comparisons, Pre-K blocks, and Head Start alignment',
    path: '/resources/classrooms',
    description:
      'Honest comparisons of early-literacy systems, Head Start ELOF and NAEYC alignment guides, and turnkey 10-minute circle-time blueprints for schools and families.',
    coverImg: '/assets/gallery/03-teacher-in-a-box.webp',
    coverAlt: 'Teacher-in-a-Box classroom rhythm system for early childhood programs',
    accentColor: '#5ba4c9',
    landId: 'luminosity',
    offerBridge: {
      badge: 'SCHOOLS & HEAD START',
      title: 'Bring Teacher-in-a-Box Rhythm to Your Program',
      body: 'Zero music specialist required. Equip classrooms for ages 2–7 with structured 10–15 minute blocks aligned to NAEYC and Head Start ELOF.',
      ctaLabel: 'Explore Institutional Licensing →',
      ctaUrl: '/institutions',
    },
  },
];

export const SOUND_NOTES_PILLAR = {
  id: 'notes',
  partNumber: 5,
  partLabel: 'The SOE Sound Notes Archive',
  shortTitle: 'SOE Sound Notes',
  cardKicker: 'WEEKLY ARCHIVE · SERIPHIA',
  cardSubtitle: 'Weekly 5-minute sound-play notes for homes & classrooms',
  path: '/resources/notes',
  description:
    'Every weekly parent and educator email note from Seriphia, dual-published as a permanent, searchable web guide for ages 2–7.',
  coverImg: '/assets/gallery/01-seriphia-empyrea.webp',
  coverAlt: 'Seriphia, Sovereign Guide of The Sound of Essentials',
  accentColor: '#FF6F00',
  landId: 'harmonia',
  offerBridge: {
    badge: 'WEEKLY SOUND NOTES',
    title: 'Receive the 19-Track Album & Weekly Sound Notes',
    body: 'Join parents and early educators receiving calm weekly sound-play ideas from Seriphia—opening with our gifted 19-track Rhythm Quest album.',
    ctaLabel: 'Enter the Listening Room →',
    ctaUrl: '/listen',
  },
};

export const ALL_RESOURCE_PILLARS = [...RESOURCE_PILLARS, SOUND_NOTES_PILLAR];

export const RESOURCE_ARTICLES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PART 1 — SOUND FOUNDATIONS (5 Flagship Guides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'sound-before-symbol-guide-ages-2-7',
    pillarId: 'foundations',
    order: 1,
    featuredOnHub: true,
    title: 'Sound Before Symbol: How Ages 2–7 Learn to Read Through Rhythm',
    metaTitle: 'Sound Before Symbol: How Ages 2–7 Learn Through Rhythm | SOE Resources',
    description:
      'Learn why children ages 2–7 must hear and clap spoken rhythm before decoding printed letters—and how 10 minutes of acoustic music builds reading readiness.',
    readTimeMinutes: 4,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'first-10-minutes-screen-free-music-routine',
    relatedRoute: { label: 'Explore the Science of Sound', url: '/science' },
    directAnswer:
      'Sound Before Symbol means training a child’s ear to hear syllables, beats, and phonemes through rhythm before asking them to decode printed letters. For ages 2–7, consistent musical beat perception strengthens the auditory timing networks that phonemic awareness depends on.',
    sections: [
      {
        id: 'why-ears-lead-eyes',
        heading: 'Why the ear must lead the eye',
        paragraphs: [
          'Printed letters are visual symbols for spoken sounds. When a 3-year-old or 5-year-old stares at flashcards before their ear can separate syllables, reading feels like guessing.',
          'Acoustic rhythm solves that bottleneck. A steady beat slows speech down so a young brain can hear where one syllable ends and the next begins.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🎵',
          title: 'The Core Rule of Sound Before Symbol',
          text: 'Hear the beat first. Speak the word second. Clap the syllables third. Trace the printed letter fourth.',
        },
      },
      {
        id: 'three-proven-pedagogies',
        heading: 'Three classical pillars behind Rhythm Quest',
        paragraphs: [
          'The Sound of Essentials builds on three time-tested early childhood traditions rather than fast-cut screen cartoons:',
        ],
        bullets: [
          'Dalcroze Eurhythmics: Children feel rhythm through full-body movement, clapping, and stepping.',
          'Orff Schulwerk: Speech chants and call-and-response phrases turn everyday vocabulary into musical patterns.',
          'Kodály Method: Sequential ear training starts with the human singing voice and simple rhythmic motifs.',
        ],
      },
      {
        id: 'how-to-start-today',
        heading: 'How to start in 10 minutes today',
        paragraphs: [
          'You do not need a musical background or a tablet app. Press play on Track 03 (Alphabet Song Remix) during breakfast or circle time and tap the table together on every steady beat.',
          'Repeat the same three songs for a full week. Repetition builds calm predictability and deep auditory memory for ages 2–7.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What age is best to start Sound Before Symbol learning?',
        a: 'Start as early as age 2 with simple clapping and humming, then layer in syllable play and tactile workbook tracing between ages 4 and 7.',
      },
      {
        q: 'Do parents or teachers need musical training?',
        a: 'No. The 19 studio-recorded tracks carry the tempo (60–80 BPM) and melody so any adult can lead clapping, movement, and call-and-response.',
      },
    ],
  },
  {
    slug: 'first-10-minutes-screen-free-music-routine',
    pillarId: 'foundations',
    order: 2,
    featuredOnHub: true,
    title: 'Your First 10 Minutes: Setting Up a Daily Screen-Free Rhythm Ritual',
    metaTitle: 'First 10 Minutes: Daily Screen-Free Music Routine (Ages 2–7) | SOE',
    description:
      'A simple 3-step morning or afternoon rhythm ritual for toddlers and early learners ages 2–7 using acoustic songs instead of glowing screens.',
    readTimeMinutes: 3,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'meet-the-7-learning-lands-and-15-heroes',
    relatedRoute: { label: 'Experience the 19-Track Album', url: '/listen' },
    directAnswer:
      'A sustainable screen-free routine takes 10 minutes at the same anchor point each day: 3 minutes of calm listening (60–80 BPM), 4 minutes of guided movement or clapping, and 3 minutes of a single spoken recall prompt.',
    sections: [
      {
        id: 'pick-one-anchor',
        heading: 'Pick one daily anchor instead of a complicated schedule',
        paragraphs: [
          'Busy homes and classrooms stick to routines that attach to moments that already exist. Pick one anchor: morning breakfast, after-nap transition, or post-dinner wind-down.',
          'Keep the speaker visible and the phone screen face-down. When children hear music without flashing animations, their eyes relax and their attention locks onto the lyrics.',
        ],
      },
      {
        id: 'the-3-4-3-sequence',
        heading: 'The 3–4–3 ten-minute sequence',
        bullets: [
          'Minutes 1–3 (Arrive): Play one calm track such as Let’s Stretch or Sunny Day while your child sits, stretches, or holds a crayon.',
          'Minutes 4–7 (Move & Echo): Clap the beat or echo two chorus lines aloud together.',
          'Minutes 8–10 (Anchor One Word): Ask your child to name one word, number, or character from the song.',
        ],
        callout: {
          tone: 'sage',
          emoji: '⏱️',
          title: 'Why 10 minutes beats 45 minutes',
          text: 'Short, joyful rituals end while your child still wants more. Ten consistent minutes every day builds stronger neural pathways than occasional marathon sessions.',
        },
      },
      {
        id: 'print-the-ritual-card',
        heading: 'Keep the First 10 Minutes card on your fridge',
        paragraphs: [
          'When you receive our gifted 19-track Rhythm Quest album, download the printable First 10 Minutes Tactile Ritual Card. Tape it inside a cabinet or on the classroom wall so any caregiver can lead the session effortlessly.',
        ],
      },
    ],
    faqs: [
      {
        q: 'What if my 2-year-old wanders around during the song?',
        a: 'Wandering is normal and helpful. Under Dalcroze principles, toddlers absorb rhythm through gross-motor movement—keep the song playing and invite them to march or sway.',
      },
      {
        q: 'How loud should the audio be?',
        a: 'Keep playback at conversational room volume so your child can hear their own voice echoing the lyrics.',
      },
    ],
  },
  {
    slug: 'meet-the-7-learning-lands-and-15-heroes',
    pillarId: 'foundations',
    order: 3,
    featuredOnHub: true,
    title: 'Inside the 7 Learning Lands & 15 Hero Mentors (Ages 2–7 Map)',
    metaTitle: 'The 7 Learning Lands & 15 Hero Mentors Map (Ages 2–7) | SOE',
    description:
      'Tour all 7 Rhythm Quest Learning Lands—Harmonia, Numeria, Vitalis, Celestia, Luminosity, Aquaria, and Terrasol—and meet Seriphia and the 14 developmental mentors.',
    readTimeMinutes: 4,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'why-60-to-80-bpm-calms-early-learners',
    relatedRoute: { label: 'Meet the 15 Hero Mentors', url: '/heroes' },
    directAnswer:
      'Rhythm Quest organizes early childhood development for ages 2–7 into 7 thematic Learning Lands—Harmonia (language), Numeria (math), Vitalis (movement), Celestia (time), Luminosity (civics), Aquaria (emotional calm), and Terrasol (nature)—guided by Seriphia and 14 Hero Mentors.',
    sections: [
      {
        id: 'why-story-worlds-work',
        heading: 'Why children remember story worlds faster than worksheets',
        paragraphs: [
          'Abstract skills like counting, days of the week, and manners stick when each domain belongs to a vivid place and two memorable mentors.',
          'Seriphia serves as the sovereign guide who welcomes families and connects all seven lands, while 14 paired Hero Mentors model each core skill directly to the child.',
        ],
      },
      {
        id: 'the-seven-lands-map',
        heading: 'Complete map of the 7 Lands and mentor pairs',
        bullets: [
          'Harmonia (Language & Phonemic Awareness) — Mentors: Kenji & Aiko.',
          'Numeria (Numbers, Counting & Shapes) — Mentors: Kwame & Octavia.',
          'Vitalis (Body Awareness & Movement) — Mentors: Felix & Amara.',
          'Celestia (Time, Days & Seasons) — Mentors: Elias & Selene.',
          'Luminosity (Manners, Empathy & Civics) — Mentors: Athena & Ezra.',
          'Aquaria (Emotional Regulation & Calm) — Mentors: Nerissa & Ronan.',
          'Terrasol (Nature, Weather & Science) — Mentors: Vesta & Silas.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🗺️',
          title: 'How to use the map this week',
          text: 'Focus on one Land per week. Play its matching tracks from the 19-track album, talk about its two Hero Mentors at dinner, and trace matching scenes on paper.',
        },
      },
    ],
    faqs: [
      {
        q: 'Who is Seriphia in The Sound of Essentials?',
        a: 'Seriphia is the sovereign guide and eternal learning mother who welcomes families and educators into the 7 Learning Lands.',
      },
      {
        q: 'Do the 19 album tracks map directly to the 7 Lands?',
        a: 'Yes. Every one of the 19 Rhythm Quest tracks belongs to one of the 7 canonical Lands so audio listening reinforces workbook and dictionary lessons.',
      },
    ],
  },
  {
    slug: 'why-60-to-80-bpm-calms-early-learners',
    pillarId: 'foundations',
    order: 4,
    featuredOnHub: true,
    title: 'Why 60–80 BPM Acoustic Warmth Beats Overstimulating Kids Videos',
    metaTitle: 'Why 60–80 BPM Acoustic Music Calms Ages 2–7 | SOE Resources',
    description:
      'Discover how tempo, acoustic arrangement, and zero flashing cuts protect nervous-system regulation and lengthen focus for toddlers and early learners.',
    readTimeMinutes: 3,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'screen-free-listening-setup-car-bedtime',
    relatedRoute: { label: 'Read the Sing-Along Time Reset Guide', url: '/sing-along-time' },
    directAnswer:
      'Many mainstream children’s videos pair 120+ BPM synthetic tracks with rapid 2-second scene cuts that spike arousal and shorten attention spans. Studio-recorded acoustic tracks paced near 60–80 BPM match resting heart rates, helping ages 2–7 stay regulated while absorbing vocabulary.',
    sections: [
      {
        id: 'tempo-and-regulation',
        heading: 'Tempo sets the emotional temperature of the room',
        paragraphs: [
          'Watch what happens five minutes after a fast-cut cartoon ends: children often melt down because their nervous system is dropping off a high-stimulation cliff.',
          'When you replace frantic screen loops with warm acoustic arrangements paced around 60–80 BPM, children hum along without getting wired. Transitions to meals, naps, and bedtime become calmer.',
        ],
      },
      {
        id: 'three-signs-of-healthy-audio',
        heading: 'Three signs of sensory-safe children’s audio',
        bullets: [
          'Clear vocal articulation: Children can hear distinct consonant endings and vowel shapes.',
          'Steady acoustic groove: Predictable rhythm lets young bodies anticipate the next beat.',
          'Zero harsh synth spikes: Parents and teachers enjoy hearing the tracks on repeat too.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🌿',
          title: 'The Parent Ear Test',
          text: 'If a song makes adults tense after two plays, it is overstimulating your child too. Choose music built with acoustic warmth that calms the whole household.',
        },
      },
    ],
    faqs: [
      {
        q: 'Can calm 60–80 BPM songs still teach active topics like counting and shapes?',
        a: 'Yes. Songs like Numbers, Shapes, and Drill Time pair clear rhythmic energy with clean vocal pacing so children move with control instead of chaos.',
      },
    ],
  },
  {
    slug: 'screen-free-listening-setup-car-bedtime',
    pillarId: 'foundations',
    order: 5,
    featuredOnHub: true,
    title: 'The Screen-Free Audio Sanctuary: Car Rides, Quiet Time & Bedtime',
    metaTitle: 'Screen-Free Audio Setup for Car Rides & Bedtime (Ages 2–7) | SOE',
    description:
      'Practical tips for building a screen-free listening zone at home and on the road using safe-volume headphones, Bluetooth speakers, and offline playlists.',
    readTimeMinutes: 3,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'five-minute-phonics-games-for-toddlers',
    relatedRoute: { label: 'Explore Safe-Volume Sensory Headphones', url: '/headphones' },
    directAnswer:
      'Build a screen-free audio sanctuary in three places: a locked car playlist for errands, a tabletop Bluetooth speaker for playroom coloring, and safe-volume sensory headphones for quiet afternoon resets and travel.',
    sections: [
      {
        id: 'three-listening-zones',
        heading: 'Three zero-screen listening zones every family can set up',
        bullets: [
          'The Car-Ride Classroom: Queue the 19-track album before pulling out of the driveway so every 12-minute errand becomes effortless vocabulary practice.',
          'The Coloring Table: Pair a small tabletop speaker with crayons and coloring pages so hands stay busy while ears absorb story lyrics.',
          'The Calm-Down Corner: Keep volume-limited sensory headphones beside a soft pillow and picture book for solo resets.',
        ],
      },
      {
        id: 'protecting-young-ears',
        heading: 'Simple volume habits for ages 2–7',
        paragraphs: [
          'Young ears are sensitive. Keep speaker playback low enough that you can speak at a normal voice over the music, and always choose volume-limited headphones during travel or quiet time.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🎧',
          title: 'Offline beats algorithmic autoplay',
          text: 'Download your tracks or use the direct SOE player so your child never drifts into random video recommendations.',
        },
      },
    ],
    faqs: [
      {
        q: 'Can we stream the 19-track album without installing an app?',
        a: 'Yes. Stream directly from thesoundofessentials.com/listen on any phone, tablet, or laptop with zero app-store lock-in.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 2 — PLAY & DAILY PRACTICE (5 Flagship Guides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'five-minute-phonics-games-for-toddlers',
    pillarId: 'play',
    order: 1,
    featuredOnHub: true,
    title: '7 Screen-Free Five-Minute Sound Games for Toddlers & Preschoolers',
    metaTitle: '7 Five-Minute Sound & Phonics Games for Ages 2–5 | SOE Resources',
    description:
      'Play seven zero-prep auditory games using clapping, household objects, and Rhythm Quest tracks to spark phonemic curiosity in ages 2–5.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'transition-songs-end-morning-bedtime-battles',
    relatedRoute: { label: 'Preview All 19 Rhythm Quest Tracks', url: '/listen' },
    directAnswer:
      'Toddlers and preschoolers build pre-reading skills fastest through short, physical sound games: syllable clapping, freeze-on-the-rhyme, sound treasure hunts, echo whispers, animal tempo walks, kitchen percussion, and mystery first-sound bags.',
    sections: [
      {
        id: 'why-short-games-win',
        heading: 'Play beats drills every time for ages 2–5',
        paragraphs: [
          'A 3-year-old learns more about starting sounds from laughing through a 3-minute treasure hunt than from sitting through a 20-minute worksheet.',
          'Pick one game below and play it once a day while a Rhythm Quest track runs softly in the background.',
        ],
      },
      {
        id: 'seven-zero-prep-games',
        heading: 'Seven zero-prep sound games to rotate all week',
        bullets: [
          '1. Clap Your Dinner: Clap every syllable on the plate ("ba-na-na" = 3 claps, "toast" = 1 clap).',
          '2. Freeze on the Beat: Play Alphabet Song Remix and freeze like a statue whenever the pause hits.',
          '3. Whisper Echo: Whisper a two-syllable word and ask your child to echo it at matching volume.',
          '4. First-Sound Basket: Pull three household toys from a basket and listen for the two that share a starting sound.',
          '5. Slow-Turtle / Fast-Horse: Move slowly to Aquaria tracks and trot carefully to Le Cheval.',
          '6. Rhyme Swap: Change the ending word of a favorite line and let your child giggle at the silly rhyme.',
          '7. Drum the Doorframe: Tap a 3-beat rhythm on the table and invite your child to copy your exact pattern.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🥁',
          title: 'Keep the smile rule',
          text: 'Stop the game while your child is still smiling. Leaving one round unplayed builds excitement for tomorrow.',
        },
      },
    ],
    faqs: [
      {
        q: 'What if my toddler cannot hear rhymes yet?',
        a: 'Start with syllable clapping and beat marching first. Rhyme detection usually clicks naturally between ages 3.5 and 5 after steady rhythm exposure.',
      },
    ],
  },
  {
    slug: 'transition-songs-end-morning-bedtime-battles',
    pillarId: 'play',
    order: 2,
    featuredOnHub: true,
    title: 'How Transition Songs End Morning, Cleanup & Bedtime Battles',
    metaTitle: 'How Transition Songs End Morning & Bedtime Battles (Ages 2–7) | SOE',
    description:
      'Replace repeated verbal reminders with predictable musical cues that help ages 2–7 switch activities calmly at home and in Pre-K.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'tactile-coloring-and-audio-focus-habit',
    relatedRoute: { label: 'Read the Dad Reading Apps Review', url: '/dad-reading-apps-review' },
    directAnswer:
      'Young children resist abrupt verbal commands because they have weak internal time sense. Assigning one consistent song to morning stretch, one to tidy-up, and one to bedtime lets the music act as a gentle, non-negotiable timer.',
    sections: [
      {
        id: 'why-transitions-trigger-tears',
        heading: 'Why transitions trigger power struggles',
        paragraphs: [
          'When you say "put your shoes on in two minutes," a 4-year-old cannot feel how long two minutes lasts. Suddenly stopping play feels like an ambush.',
          'A 2-to-3 minute acoustic song gives the child a clear beginning, middle, and musical ending. The song becomes the boss, removing friction between parent and child.',
        ],
      },
      {
        id: 'three-song-transition-map',
        heading: 'Map three daily transitions to three SOE songs',
        bullets: [
          'Morning Wake-Up: Play Let’s Stretch or Sunny Day to shift sleepy bodies into cheerful motion.',
          'Midday Tidy & Reset: Play Drill Time or Manners while toys return to their bins before the final chorus.',
          'Bedtime Sanctuary: Play After the Storm or Rain at soft volume while brushing teeth and opening a picture book.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🌙',
          title: 'Never lecture over the cue',
          text: 'Press play, hum the first line, and start the action yourself. Young learners copy calm movement faster than verbal speeches.',
        },
      },
    ],
    faqs: [
      {
        q: 'How many days does a transition song take to click?',
        a: 'Most families see calmer shifts within 4 to 7 days of using the exact same track at the exact same transition point.',
      },
    ],
  },
  {
    slug: 'tactile-coloring-and-audio-focus-habit',
    pillarId: 'play',
    order: 3,
    featuredOnHub: true,
    title: 'Coloring + Music: The Hands-Busy Habit That Doubles Listening Focus',
    metaTitle: 'Coloring + Music: Build Tactile Listening Focus (Ages 2–7) | SOE',
    description:
      'Learn why pairing crayons and storybook coloring pages with acoustic tracks builds fine-motor grip and deeper vocabulary retention without screens.',
    readTimeMinutes: 4,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'picture-books-without-quizzing-vocabulary',
    relatedRoute: { label: 'Explore the Storybook Gallery', url: '/gallery' },
    directAnswer:
      'Pairing tactile coloring with calm acoustic songs occupies the hands while keeping auditory pathways open. For ages 2–7, this hands-busy pairing strengthens pencil grip, lengthens seated attention, and connects visual scenes to spoken lyrics.',
    sections: [
      {
        id: 'motor-meets-auditory',
        heading: 'Why busy hands unlock quiet ears',
        paragraphs: [
          'Asking a 4-year-old to sit completely still and listen often backfires. Give their fingers thick crayons and a scene featuring Kenji, Aiko, or Felix, and their focus stretches naturally.',
          'Every stroke on paper trains the exact small hand muscles required later for letter formation in Kindergarten and Grade 1.',
        ],
      },
      {
        id: 'three-step-coloring-ritual',
        heading: 'The 15-minute coloring-and-audio ritual',
        bullets: [
          'Set out 1 printed scene and 4 chunky crayons—fewer choices prevent overwhelm.',
          'Queue 2 matching Land tracks from the 19-track album.',
          'Point to one illustrated detail after the song finishes and say its name aloud together.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🖍️',
          title: 'Pair with the Quest Starter & Coloring Pack ($7)',
          text: 'Receive our gifted 19-track album first, then pair it with the 40-page Rhythm Quest Storybook Coloring Book + Daily Rhythm Dial for instant print-and-play afternoons.',
        },
      },
    ],
    faqs: [
      {
        q: 'Should I correct my 3-year-old for coloring outside the lines?',
        a: 'No. At ages 2–4, building comfortable crayon grip and joyful endurance matters far more than staying inside boundaries.',
      },
    ],
  },
  {
    slug: 'picture-books-without-quizzing-vocabulary',
    pillarId: 'play',
    order: 4,
    featuredOnHub: true,
    title: 'How to Read Picture Dictionaries & Storybooks Without Quizzing',
    metaTitle: 'How to Read Picture Books for Vocabulary Growth (Ages 2–7) | SOE',
    description:
      'Use dialogic reading, musical pointing, and open wonder prompts to grow a rich spoken vocabulary across 4,000+ everyday words for ages 2–7.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'bilingual-rhythm-exposure-english-french-spanish',
    relatedRoute: { label: 'Explore The Essential Picture Dictionary', url: '/workbook' },
    directAnswer:
      'Skip rapid-fire "What is this?" quizzing. Instead, narrate one rich illustrated scene together, pause for five full seconds so your child can point first, and echo their words back with one vivid describing word.',
    sections: [
      {
        id: 'why-quizzing-shuts-down-talk',
        heading: 'Why constant quizzing makes kids go quiet',
        paragraphs: [
          'When storytime turns into a pop quiz ("What color is the boat? What letter starts apple?"), children stop exploring and start worrying about wrong answers.',
          'Warm conversation builds ten times more vocabulary. Treat every illustrated scene like a treasure map you are exploring side by side.',
        ],
      },
      {
        id: 'the-notice-name-expand-loop',
        heading: 'Use the Notice → Name → Expand loop',
        bullets: [
          'Notice: Wait silently for 5 seconds and watch what your child points to first.',
          'Name: Say the word clearly with natural rhythm ("Yes, that is a lighthouse!").',
          'Expand: Add one sensory detail or song connection ("The bright lighthouse shines beside the ocean waves.").',
        ],
        callout: {
          tone: 'sage',
          emoji: '📖',
          title: 'Inside The Essential Picture Dictionary',
          text: 'Across 125 illustrated scenes and 4,000+ words in 7 Learning Lands, families can open any two-page spread for a fresh 5-minute conversation every night.',
        },
      },
    ],
    faqs: [
      {
        q: 'How many pages should we cover in one sitting?',
        a: 'One single rich scene is plenty. Deep conversation around 6 to 8 words on one page beats flipping hastily through 30 pages.',
      },
    ],
  },
  {
    slug: 'bilingual-rhythm-exposure-english-french-spanish',
    pillarId: 'play',
    order: 5,
    featuredOnHub: true,
    title: 'Bilingual Ear Training: Using Song Rhythm for Early Language Fluency',
    metaTitle: 'Bilingual Ear Training Through Song Rhythm (Ages 2–7) | SOE',
    description:
      'How musical phrasing helps ages 2–7 absorb English, French, and Spanish pronunciation naturally through tracks like Le Cheval and multilingual vocabulary cues.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'phonemic-awareness-milestones-ages-2-to-7',
    relatedRoute: { label: 'Read Global Learn English Through Sound', url: '/global-learn-english' },
    directAnswer:
      'Children ages 2–7 possess peak auditory plasticity for distinguishing foreign speech sounds. Singing rhythmic phrases in a second language—such as SOE’s French track Le Cheval—anchors authentic pronunciation and cadence without rote memorization.',
    sections: [
      {
        id: 'melody-carries-pronunciation',
        heading: 'Why melody unlocks accent and cadence',
        paragraphs: [
          'Every language carries its own rhythmic signature. When children sing a French or English chorus repeatedly, their mouths practice vowel shapes and word boundaries effortlessly.',
          'Even monolingual parents can introduce playful second-language songs by letting the studio recording model native pronunciation.',
        ],
      },
      {
        id: 'three-playful-bilingual-habits',
        heading: 'Three easy ways to weave bilingual sound into the week',
        bullets: [
          'Play Le Cheval during movement time and pair the French chorus with playful horse-gallop rhythms.',
          'Switch the SOE website language toggle (EN / ES / FR) when reviewing Hero Mentor names and Lands together.',
          'Celebrate sound curiosity rather than demanding instant translation.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🌍',
          title: 'Sound works across borders',
          text: 'Whether your household speaks English, Spanish, French, or a blend of languages, rhythmic ear training gives ages 2–7 a welcoming bridge into confident speech.',
        },
      },
    ],
    faqs: [
      {
        q: 'Will bilingual songs confuse a toddler who is still learning to talk?',
        a: 'No. Research consistently shows young children sort multiple sound systems naturally when exposed through warm, consistent human speech and song.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 3 — KINDERGARTEN READINESS (5 Flagship Guides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'phonemic-awareness-milestones-ages-2-to-7',
    pillarId: 'readiness',
    order: 1,
    featuredOnHub: true,
    title: 'Phonemic Awareness Milestones from Age 2 to Age 7 (Parent Checklist)',
    metaTitle: 'Phonemic Awareness Milestones Ages 2–7 Checklist | SOE Resources',
    description:
      'A clear, pressure-free progression showing how listening, rhyming, syllable clapping, blending, and decoding unfold from toddlerhood to Grade 2.',
    readTimeMinutes: 7,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'blending-and-segmenting-sounds-through-music',
    relatedRoute: { label: 'Explore the 8-Week Rhythm Ready Workbook', url: '/rhythm-ready' },
    directAnswer:
      'Phonemic awareness unfolds in five clear stages across ages 2–7: steady beat & listening (ages 2–3), rhyming & syllable clapping (ages 3–4), initial sound matching (ages 4–5), phoneme blending & segmenting (ages 5–6), and fluent decoding with expression (ages 6–7).',
    sections: [
      {
        id: 'stage-by-stage-map',
        heading: 'The 5-stage sound progression (ages 2–7)',
        bullets: [
          'Ages 2–3 (Listening & Beat): Enjoys steady clapping, mimics animal and environmental sounds, chimes in on repeated chorus words.',
          'Ages 3–4 (Rhymes & Syllables): Spots simple rhyming pairs ("cat / hat") and claps 2- and 3-syllable words.',
          'Ages 4–5 (Starting Sounds): Hears that "sun" and "sock" start with the same /s/ sound; traces letter shapes on paper.',
          'Ages 5–6 (Blending & Segmenting): Blends spoken sounds (/m/ - /a/ - /p/ → "map") and breaks short words into 3 distinct sounds.',
          'Ages 6–7 (Fluent Decoding): Connects auditory sound patterns to independent reading, writing, and rich multi-syllable vocabulary.',
        ],
      },
      {
        id: 'how-to-spot-gaps-calmly',
        heading: 'What to do if a stage feels wobbly',
        paragraphs: [
          'If a 5-year-old struggles to sound out words on a page, step back one stage to pure listening games. Strengthen syllable clapping and oral blending with songs for two weeks before pushing printed drills.',
        ],
        callout: {
          tone: 'sage',
          emoji: '✅',
          title: 'Auditory foundations fix reading friction',
          text: 'Most early reading frustration is an ear-timing bottleneck, never a lack of intelligence. Return to rhythm, slow down, and rebuild confidence.',
        },
      },
    ],
    faqs: [
      {
        q: 'What is the difference between phonemic awareness and phonics?',
        a: 'Phonemic awareness is 100% auditory—hearing and manipulating spoken sounds with eyes closed. Phonics connects those spoken sounds to printed letters.',
      },
    ],
  },
  {
    slug: 'blending-and-segmenting-sounds-through-music',
    pillarId: 'readiness',
    order: 2,
    featuredOnHub: true,
    title: 'Blending & Segmenting Through Music: From Spoken Beat to First Words',
    metaTitle: 'Blending & Segmenting Sounds Through Music (Ages 4–7) | SOE',
    description:
      'Step-by-step rhythmic tapping techniques that teach ages 4–7 how to stretch, separate, and blend word sounds smoothly without screen flashcards.',
    readTimeMinutes: 6,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'screen-free-kindergarten-readiness-checklist',
    relatedRoute: { label: 'View the Rhythm Ready Workbook', url: '/rhythm-ready' },
    directAnswer:
      'Teach blending and segmenting by tapping one beat per phoneme on the arm—shoulder (/c/), elbow (/a/), wrist (/t/)—then sliding down the arm in one smooth musical sweep ("cat").',
    sections: [
      {
        id: 'the-arm-tap-sweep',
        heading: 'The 3-beat Arm-Tap Sweep',
        paragraphs: [
          'Children ages 4–6 often say three disconnected sounds ("cuh... ah... tuh") and forget the first sound before reaching the third. Steady musical rhythm bridges that working-memory gap.',
        ],
        bullets: [
          'Step 1 (Tap 3 Beats): Tap shoulder (/s/), elbow (/u/), wrist (/n/) in steady 70 BPM rhythm.',
          'Step 2 (Sweep Together): Slide your hand smoothly from shoulder to wrist while singing "suuun!"',
          'Step 3 (Reverse It): Say "map" and invite your child to tap the three beats down their own arm.',
        ],
        callout: {
          tone: 'warm',
          emoji: '✨',
          title: 'Start with stretchy sounds first',
          text: 'Words starting with continuous sounds (/m/, /s/, /f/, /l/, /n/) are much easier for 4- and 5-year-olds to blend smoothly than hard stop sounds (/b/, /p/, /t/).',
        },
      },
      {
        id: 'bridge-to-paper',
        heading: 'Bridge straight from arm-taps to tactile paper',
        paragraphs: [
          'Once your child blends 5 words smoothly by ear, open the Rhythm Ready Workbook and trace those exact words with a pencil while humming the beat. Ear, hand, and eye lock together.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many words should we practice per day?',
        a: 'Practice just 5 to 6 words per day during a 5-minute rhythmic warm-up. Short daily wins outperform long drills.',
      },
    ],
  },
  {
    slug: 'screen-free-kindergarten-readiness-checklist',
    pillarId: 'readiness',
    order: 3,
    featuredOnHub: true,
    title: 'The Screen-Free Kindergarten Readiness Checklist (5 Core Domains)',
    metaTitle: 'Screen-Free Kindergarten Readiness Checklist (Ages 4–6) | SOE',
    description:
      'Evaluate language, math, motor, science, and social-emotional readiness for kindergarten using practical, screen-free everyday observations.',
    readTimeMinutes: 7,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'eight-week-summer-bridge-plan-ages-4-7',
    relatedRoute: { label: 'Explore the 40-Day Readiness Workbook', url: '/rhythm-ready' },
    directAnswer:
      'True kindergarten readiness spans five balanced domains—not just reciting letters on a tablet: spoken language & listening, rhythmic counting & shapes, fine-motor pencil/scissor stamina, curiosity about time & nature, and emotional self-regulation.',
    sections: [
      {
        id: 'five-readiness-domains',
        heading: 'The 5 core domains mapped to the 7 Learning Lands',
        bullets: [
          '1. Language & Listening (Harmonia): Follows 2-step spoken directions, claps syllables, enjoys stories without screen visuals.',
          '2. Early Math & Shapes (Numeria & Celestia): Counts objects 1-to-1 up to 20, names basic shapes, recognizes days of the week.',
          '3. Physical & Fine Motor (Vitalis): Holds a pencil comfortably, traces lines, moves with bilateral coordination.',
          '4. Curiosity & Nature (Terrasol): Observes weather, seasons, plants, and animals and asks "why" questions.',
          '5. Social-Emotional Calm (Luminosity & Aquaria): Practices turn-taking, uses manners words, and recovers calmly from frustration.',
        ],
        callout: {
          tone: 'sage',
          emoji: '📋',
          title: 'Teachers prioritize regulation over early reading',
          text: 'Kindergarten teachers consistently note that a calm child who can listen, hold a pencil, and take turns thrives far faster than a rushed child who only taps tablet quizzes.',
        },
      },
    ],
    faqs: [
      {
        q: 'Does my child need to read chapter books before kindergarten?',
        a: 'No. Focus on joyful listening, phonemic play, comfortable pencil grip, counting with real objects, and calm emotional transitions.',
      },
    ],
  },
  {
    slug: 'eight-week-summer-bridge-plan-ages-4-7',
    pillarId: 'readiness',
    order: 4,
    featuredOnHub: true,
    title: 'The 8-Week Tactile Readiness Plan: 40 Days Without Summer Slide',
    metaTitle: '8-Week Screen-Free Summer Readiness Plan (Ages 4–7) | SOE',
    description:
      'Follow the 8-week, 5-day-per-week Rhythm Ready structure (15 minutes a day) to keep Pre-K through Grade 2 learners sharp and screen-free all summer.',
    readTimeMinutes: 6,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'rhythmic-counting-shapes-time-numeria',
    relatedRoute: { label: 'View the 8-Week Rhythm Ready Workbook', url: '/rhythm-ready' },
    directAnswer:
      'Prevent summer learning loss in 15 minutes a day with a 40-day tactile plan: 5 days a week across 8 weeks, pairing one daily Rhythm Quest track with structured paper blocks covering rhythm, phonics, counting, tracing, and calm reflection.',
    sections: [
      {
        id: 'weekly-cadence',
        heading: 'How the 8-week cadence works',
        paragraphs: [
          'Long unstructured weeks make families drift toward tablets by mid-July. A light 15-minute morning quest right after breakfast preserves summer freedom while keeping skills sharp.',
        ],
        bullets: [
          'Weeks 1–2 (Harmonia & Vitalis): Sound foundations, alphabet rhythm, body awareness, and warm-up tracing.',
          'Weeks 3–4 (Numeria & Celestia): Counting to 100, shapes, days of the week, months, and clock time.',
          'Weeks 5–6 (Terrasol & Aquaria): Weather, ocean vocabulary, science observation, and calm emotional habits.',
          'Weeks 7–8 (Luminosity & Integration): Manners, hard words, full-quest review, and celebration.',
        ],
        callout: {
          tone: 'warm',
          emoji: '☀️',
          title: 'Zero recurring subscriptions',
          text: 'Print workbooks and digital PDFs belong to your family for good—no monthly app fees, logins, or Wi-Fi required on road trips.',
        },
      },
    ],
    faqs: [
      {
        q: 'What if we miss a few days on family vacation?',
        a: 'Just keep playing the 19-track album in the car and pick up on the next workbook day when you return. The 40-day sequence is self-paced.',
      },
    ],
  },
  {
    slug: 'rhythmic-counting-shapes-time-numeria',
    pillarId: 'readiness',
    order: 5,
    featuredOnHub: true,
    title: 'Rhythmic Math for Ages 2–7: Teaching Counting, Shapes & Time by Ear',
    metaTitle: 'Rhythmic Math: Counting, Shapes & Time by Ear (Ages 2–7) | SOE',
    description:
      'Use rhythmic skip-counting, shape movement games, and calendar songs from Numeria and Celestia to turn early math into effortless muscle memory.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'screen-free-alternatives-to-tablet-reading-apps',
    relatedRoute: { label: 'Meet Kwame & Octavia of Numeria', url: '/heroes' },
    directAnswer:
      'Music is structured math in motion. Pairing steady musical beats with physical counting objects, drawn shapes, and calendar songs (Numbers, One Hundred, Shapes, Days of the Week, Months of the Year, Time) locks number sense into long-term memory for ages 2–7.',
    sections: [
      {
        id: 'beat-equals-one-to-one',
        heading: 'How steady beats teach 1-to-1 correspondence',
        paragraphs: [
          'Early learners often recite "1-2-3-4-5" faster than their finger touches objects. Marching or placing one wooden block per musical beat synchronizes voice, hand, and number value.',
        ],
        bullets: [
          'Ages 2–4: Count real snacks or blocks to Track 05 (Numbers) and walk big shapes taped on the floor during Shapes.',
          'Ages 5–7: Sing One Hundred while grouping coins or beans in tens, and trace clock hours alongside Time.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🔢',
          title: 'Calendar mastery in 3 minutes a day',
          text: 'Playing Days of the Week and Months of the Year during morning circle gives Kindergarteners effortless mastery of calendar sequencing.',
        },
      },
    ],
    faqs: [
      {
        q: 'Does SOE cover math as well as reading readiness?',
        a: 'Yes. Numeria (Kwame & Octavia) and Celestia (Elias & Selene) cover counting to 100, shapes, days, months, and telling time for ages 2–7.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PART 4 — HOME & CLASSROOM SYSTEMS (5 Flagship Guides)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'screen-free-alternatives-to-tablet-reading-apps',
    pillarId: 'classrooms',
    order: 1,
    featuredOnHub: true,
    title: 'Screen-Free Alternatives to Tablet Reading Apps (Honest 2026 Comparison)',
    metaTitle: 'Screen-Free Alternatives to Tablet Reading Apps (Ages 2–7) | SOE',
    description:
      'Compare tablet phonics apps against screen-free acoustic and tactile curricula across attention health, handwriting readiness, cost, and parent sanity.',
    readTimeMinutes: 8,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'preschool-circle-time-blueprint-no-music-specialist',
    relatedRoute: { label: 'Compare ABCmouse Alternatives', url: '/alternatives/abcmouse' },
    directAnswer:
      'Tablet reading apps rely on animated coin rewards, screen taps, and recurring monthly subscriptions. Screen-free acoustic systems like The Sound of Essentials build stronger phonemic timing, real pencil grip on paper, and calmer behavior with a $0 19-track album entry and zero monthly lock-in.',
    sections: [
      {
        id: 'four-evaluation-criteria',
        heading: 'Four criteria that actually matter for ages 2–7',
        bullets: [
          '1. Nervous-system impact: Does the child leave the lesson calm and regulated, or begging for more screen minutes?',
          '2. Transfer to real paper: Does the child practice actual pencil grip and page focus, or only finger-tapping?',
          '3. Auditory clarity: Does the child train their ear to hear syllables and phonemes without cartoon visual crutches?',
          '4. Ownership vs. rent: Do you own the books and audio permanently, or lose access when a monthly subscription ends?',
        ],
      },
      {
        id: 'deep-dive-comparisons',
        heading: 'Read our side-by-side platform breakdowns',
        paragraphs: [
          'If your family or school is evaluating specific reading apps right now, inspect our detailed, fair comparisons of the three largest tablet programs:',
        ],
        bullets: [
          'ABCmouse Alternatives (/alternatives/abcmouse): Moving from virtual ticket economies to calm tactile quests.',
          'Reading Eggs Alternatives (/alternatives/reading-eggs): Replacing screen minigames with acoustic phonemic timing.',
          'Hooked on Phonics Alternatives (/alternatives/hooked-on-phonics): Pairing studio-recorded song rhythm with 8-week workbooks.',
        ],
        callout: {
          tone: 'warm',
          emoji: '⚖️',
          title: 'Test with living proof first ($0)',
          text: 'Before buying any curriculum, stream all 19 Rhythm Quest tracks free at /listen and watch how your child responds in the first 10 minutes.',
        },
      },
    ],
    faqs: [
      {
        q: 'Can we use SOE alongside our school’s existing phonics program?',
        a: 'Yes. Rhythm Quest complements any classroom literacy curriculum by adding a 10-minute screen-free auditory and movement warm-up.',
      },
    ],
  },
  {
    slug: 'preschool-circle-time-blueprint-no-music-specialist',
    pillarId: 'classrooms',
    order: 2,
    featuredOnHub: true,
    title: 'The 12-Minute Preschool Circle-Time Blueprint (No Music Specialist Needed)',
    metaTitle: '12-Minute Preschool Circle-Time Music Blueprint (Ages 2–5) | SOE',
    description:
      'A turnkey Teacher-in-a-Box circle-time structure any lead teacher or classroom aide can run in 12 minutes with zero prep burnout.',
    readTimeMinutes: 6,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'head-start-elof-naeyc-alignment-guide',
    relatedRoute: { label: 'Explore Institutional Classroom Licensing', url: '/institutions' },
    directAnswer:
      'Any preschool educator can run high-impact music and literacy circle time in 12 minutes without specialist training: 2 minutes of rhythmic arrival, 4 minutes of guided track movement, 3 minutes of picture-card call-and-response, and 3 minutes of calm transition.',
    sections: [
      {
        id: 'eliminating-prep-burnout',
        heading: 'Built for real teachers, zero extra Sunday prep',
        paragraphs: [
          'Early childhood teachers carry heavy daily loads. Hunting for safe YouTube videos, dodging mid-roll ads, and inventing music lessons from scratch wastes precious energy.',
          'Rhythm Quest acts as a Teacher-in-a-Box: press play on one Land track, hold up the matching illustrated scene, and guide simple clapping or echoing.',
        ],
      },
      {
        id: 'minute-by-minute-block',
        heading: 'Minute-by-minute classroom block (12 minutes)',
        bullets: [
          'Minutes 0–2 (Gather): Play Sunny Day or Let’s Stretch to signal circle time without raising your voice.',
          'Minutes 2–6 (Rhythm & Movement): Lead bilateral clapping, marching, or seated tapping to the weekly Land track.',
          'Minutes 6–9 (Vocabulary Call & Response): Hold up 3 target words from The Essential Picture Dictionary and chant syllables together.',
          'Minutes 9–12 (Calm Bridge): Play a soft 60–70 BPM track to guide students smoothly to table centers.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🏫',
          title: 'Consistent for every aide and substitute',
          text: 'Because the tracks carry the tempo and vocal cues, assistant teachers and substitutes deliver the exact same calm quality on day one.',
        },
      },
    ],
    faqs: [
      {
        q: 'What classroom equipment do we need?',
        a: 'Only a standard classroom Bluetooth speaker and printable or bound workbook/dictionary copies. Zero classroom tablets or smartboards required.',
      },
    ],
  },
  {
    slug: 'head-start-elof-naeyc-alignment-guide',
    pillarId: 'classrooms',
    order: 3,
    featuredOnHub: true,
    title: 'Head Start ELOF & NAEYC Alignment: Mapping Rhythm Quest to Standards',
    metaTitle: 'Head Start ELOF & NAEYC Alignment Guide (Ages 2–7) | SOE',
    description:
      'See how The Sound of Essentials maps across Head Start Early Learning Outcomes Framework domains and NAEYC developmentally appropriate practices.',
    readTimeMinutes: 7,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'home-classroom-continuity-qr-parent-bridge',
    relatedRoute: { label: 'View Solutions for Early Years Directors', url: '/for/early-years-directors' },
    directAnswer:
      'Rhythm Quest aligns directly with all five core domains of the Head Start Early Learning Outcomes Framework (ELOF) and NAEYC standards for ages 2–7: Approaches to Learning, Social & Emotional Development, Language & Literacy, Cognition (Math & Science), and Perceptual, Motor & Physical Development.',
    sections: [
      {
        id: 'elof-domain-crosswalk',
        heading: 'Head Start ELOF domain crosswalk',
        bullets: [
          'Language & Communication / Literacy → Harmonia (Kenji & Aiko): Phonological awareness, print concepts, and 4,000+ illustrated vocabulary words.',
          'Cognition (Mathematics & Scientific Reasoning) → Numeria, Celestia & Terrasol: Counting, geometry, temporal sequencing, weather, and nature observation.',
          'Social & Emotional Development → Luminosity & Aquaria: Manners, empathy, emotional vocabulary, and self-regulation through calm acoustic pacing.',
          'Perceptual, Motor & Physical Development → Vitalis (Felix & Amara): Gross-motor rhythm coordination and fine-motor workbook tracing.',
          'Approaches to Learning → Full 40-day Rhythm Ready sequence: Sustained 10–15 minute task persistence without digital overstimulation.',
        ],
      },
      {
        id: 'procurement-and-pilots',
        heading: 'Simple pilot onboarding for districts and centers',
        paragraphs: [
          'Directors and grant coordinators can test all 19 studio-recorded tracks immediately at zero cost before scaling physical print workbooks, picture dictionaries, and sensory headphones across sites.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🏛️',
          title: 'Request an institutional sample kit',
          text: 'Visit /institutions or email info@soelearn.com for classroom bundle quotes, W-9 documentation, and multi-site Head Start licensing.',
        },
      },
    ],
    faqs: [
      {
        q: 'Is SOE suitable for Title I and Head Start classroom pilots?',
        a: 'Yes. The low-friction audio + print format requires zero student laptops or home Wi-Fi, making it equitable across all family households.',
      },
    ],
  },
  {
    slug: 'home-classroom-continuity-qr-parent-bridge',
    pillarId: 'classrooms',
    order: 4,
    featuredOnHub: true,
    title: 'Home–Classroom Continuity: Bridging School Songs to Family Kitchens',
    metaTitle: 'Home-Classroom Continuity Through Shared Songs (Ages 2–7) | SOE',
    description:
      'How preschools and elementary classrooms use simple weekly song links on soelearn.com so families reinforce the exact same vocabulary at home.',
    readTimeMinutes: 5,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'education-sovereignty-owning-your-childs-attention',
    relatedRoute: { label: 'Explore Parent & Educator Solutions', url: '/solutions' },
    directAnswer:
      'When a preschool sends home a single weekly song link (routed cleanly through soelearn.com) instead of a thick homework packet, families play the track in the car and reinforce classroom vocabulary effortlessly.',
    sections: [
      {
        id: 'closing-the-pickup-gap',
        heading: 'Closing the 3:00 PM pickup gap',
        paragraphs: [
          'Ask a 4-year-old "What did you learn today?" and they usually answer "Nothing." Play the exact chorus they sang during circle time, and the whole lesson pours out in the backseat.',
          'Sharing one weekly Rhythm Quest track gives parents an instant, joyful window into classroom growth without adding evening homework battles.',
        ],
      },
      {
        id: 'three-step-parent-bridge',
        heading: 'Three-step weekly bridge for teachers',
        bullets: [
          'Monday: Introduce one Land track and 3 Picture Dictionary words during circle time.',
          'Wednesday: Send one short note home with the direct track name and a 1-sentence car-ride prompt.',
          'Friday: Let children sing the chorus together and celebrate one new word they used at home.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🏡',
          title: 'Zero login friction for families',
          text: 'Parents never have to remember passwords or download ad-heavy apps. One direct SOE link opens clean audio on any phone.',
        },
      },
    ],
    faqs: [
      {
        q: 'Does home sharing work for multilingual families?',
        a: 'Yes. Musical rhythm and illustrated picture scenes welcome every family regardless of English fluency at home.',
      },
    ],
  },
  {
    slug: 'education-sovereignty-owning-your-childs-attention',
    pillarId: 'classrooms',
    order: 5,
    featuredOnHub: true,
    title: 'Education Sovereignty: Protecting Early Attention from Algorithmic Feeds',
    metaTitle: 'Education Sovereignty: Screen-Free Early Childhood (Ages 2–7) | SOE',
    description:
      'Why sovereign families and independent schools choose owned physical books and ad-free acoustic audio over rented, algorithm-driven edtech platforms.',
    readTimeMinutes: 6,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'note-01-ten-calm-minutes-before-screens',
    relatedRoute: { label: 'Read the Education Sovereignty Manifesto', url: '/education-sovereignty' },
    directAnswer:
      'Education sovereignty means families and educators—not engagement algorithms—control what enters a child’s eyes and ears during the formative ages of 2 to 7. Owned print books and offline acoustic audio preserve deep attention, privacy, and permanent access.',
    sections: [
      {
        id: 'attention-is-the-first-asset',
        heading: 'Attention is the foundation of every future skill',
        paragraphs: [
          'Between ages 2 and 7, a child’s brain wires its baseline expectations for pace, patience, and focus. Algorithmic video feeds train children to crave constant novelty every three seconds.',
          'Acoustic songs, paper pages, and real adult voices train the opposite: calm curiosity, listening stamina, and genuine pride in finishing a task.',
        ],
      },
      {
        id: 'three-pillars-of-sovereign-learning',
        heading: 'Three pillars of a sovereign learning home',
        bullets: [
          'Owned Artifacts: Heirloom picture dictionaries, physical workbooks, and downloadable audio stay on your shelf forever.',
          'Zero Child Data Harvesting: No gamified child profiles, behavioral ad pixels, or manipulative loot boxes.',
          'Human-Led Warmth: Music supports the bond between parent, teacher, and child—it never replaces it.',
        ],
        callout: {
          tone: 'warm',
          emoji: '🛡️',
          title: 'Staying on the path, always learning.',
          text: 'Crafted by a father’s heart and a mother’s love—SOE gives families and classrooms living proof that screen-free learning works.',
        },
      },
    ],
    faqs: [
      {
        q: 'Are SOE digital downloads usable offline once downloaded?',
        a: 'Yes. Once you download the digital audio, PDF workbooks, or EPUB picture dictionary, your family owns lifetime offline access across devices.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ARCHIVE — THE SOE SOUND NOTES (Dual-Published Weekly Newsletter Issues)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'note-01-ten-calm-minutes-before-screens',
    pillarId: 'notes',
    order: 1,
    featuredOnHub: false,
    title: '🎵 Sound Note #01: The 10-Minute Morning Reset Before Screens Ever Turn On',
    metaTitle: 'SOE Sound Note #01: 10-Minute Morning Reset (Ages 2–7) | SOE',
    description:
      'Seriphia’s weekly Sound Note: how replacing morning cartoons with one 60–80 BPM acoustic track and a 3-word rhythm prompt changes the whole day.',
    readTimeMinutes: 4,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'note-02-clapping-syllables-at-the-dinner-table',
    relatedRoute: { label: 'Read Part 1: Your First 10 Minutes', url: '/resources/first-10-minutes-screen-free-music-routine' },
    directAnswer:
      'In Sound Note #01, Seriphia shares a 3-part morning habit for ages 2–7: play Let’s Stretch while breakfast cools, clap three food words together, and name one Hero Mentor to cheer on during the day.',
    sections: [
      {
        id: 'in-this-weeks-note',
        heading: 'In this week’s Sound Note 📨',
        bullets: [
          'Why the first 10 minutes after waking shape focus for the next 6 hours.',
          'One zero-prep breakfast syllable game using Track 01 (Let’s Stretch).',
          'How to start Part 1 of the new SOE Resources roadmap.',
        ],
      },
      {
        id: 'morning-rhythm-shift',
        heading: 'Start with warmth, not a glowing screen',
        paragraphs: [
          'Welcome to The SOE Sound Notes! Every week we share one small, realistic 5-to-10 minute rhythm habit you can try immediately with children ages 2–7.',
          'This week, try keeping screens off for the first 30 minutes of the morning. Press play on Let’s Stretch while pouring cereal, stretch arms high on the chorus, and clap the syllables of two items on the table.',
        ],
        callout: {
          tone: 'warm',
          emoji: '✉️',
          title: 'Was this note shared with you?',
          text: 'Use the invitation form below to receive our gifted 19-track Rhythm Quest album and Seriphia’s weekly 5-minute Sound Notes directly in your inbox.',
        },
      },
    ],
    faqs: [
      {
        q: 'How often do SOE Sound Notes arrive?',
        a: 'Once a week—short, practical, and zero fluff. Every issue is also archived here under /resources/notes.',
      },
    ],
  },
  {
    slug: 'note-02-clapping-syllables-at-the-dinner-table',
    pillarId: 'notes',
    order: 2,
    featuredOnHub: false,
    title: '🥁 Sound Note #02: Clapping Syllables at the Dinner Table (Zero Worksheets)',
    metaTitle: 'SOE Sound Note #02: Clapping Syllables at Dinner (Ages 2–7) | SOE',
    description:
      'Turn dinner chatter into joyful pre-reading practice for ages 2–7 with a 3-minute syllable-clapping ritual anyone at the table can join.',
    readTimeMinutes: 4,
    publishedAt: '2026-11-21',
    updatedAt: '2026-11-21',
    nextSlug: 'sound-before-symbol-guide-ages-2-7',
    relatedRoute: { label: 'Read Part 2: 7 Five-Minute Sound Games', url: '/resources/five-minute-phonics-games-for-toddlers' },
    directAnswer:
      'Syllable clapping is the simplest bridge into phonemic awareness for ages 2–7. Play "Clap the Plate" for three minutes at dinner by clapping every food word aloud together and guessing which word had the most beats.',
    sections: [
      {
        id: 'in-this-weeks-note',
        heading: 'In this week’s Sound Note 📨',
        bullets: [
          'The 3-minute "Clap the Plate" dinner game for ages 2–7.',
          'Why hearing word beats comes before sounding out letters.',
          'A calm post-dinner pairing with Track 11 (Manners) and Track 17 (After the Storm).',
        ],
      },
      {
        id: 'clap-the-plate',
        heading: 'How to play Clap the Plate tonight',
        paragraphs: [
          'Pick three foods on the table—for example: rice (1 clap), car-rot (2 claps), broc-co-li (3 claps). Say each word slowly while everyone claps the beats together.',
          'Let your child pick the next word from anywhere in the kitchen. When siblings or grandparents join in, laughter cements the phonemic skill automatically.',
        ],
        callout: {
          tone: 'sage',
          emoji: '🍲',
          title: 'Want the full 4-Part Roadmap?',
          text: 'Explore Parts 1–4 below to move smoothly from 5-minute listening games to 8-week Kindergarten readiness.',
        },
      },
    ],
    faqs: [
      {
        q: 'Can 2-year-olds play Clap the Plate?',
        a: 'Yes! Even if a 2-year-old claps off-beat at first, hearing you model steady 1-, 2-, and 3-beat words trains their auditory rhythm.',
      },
    ],
  },
];

// ── Lookup & Search Helpers ─────────────────────────────────────────────────

export function getPillarById(pillarId) {
  return ALL_RESOURCE_PILLARS.find((p) => p.id === pillarId) || null;
}

export function getArticlesByPillar(pillarId) {
  return RESOURCE_ARTICLES
    .filter((a) => a.pillarId === pillarId)
    .sort((a, b) => a.order - b.order);
}

export function getArticleBySlug(slug) {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug) || null;
}

export function getNextArticle(article) {
  if (!article?.nextSlug) return null;
  return getArticleBySlug(article.nextSlug);
}

export function searchResources(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return RESOURCE_ARTICLES.filter((article) => {
    const pillar = getPillarById(article.pillarId);
    const haystack = [
      article.title,
      article.description,
      article.directAnswer,
      pillar?.partLabel || '',
      pillar?.shortTitle || '',
      ...(article.sections || []).map((s) => `${s.heading} ${(s.paragraphs || []).join(' ')} ${(s.bullets || []).join(' ')}`),
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}
