/**
 * ═══════════════════════════════════════════════════════════════
 * SOE DIGITAL PICTURE DICTIONARY — VOCABULARY DATA (ALL 7 LANDS)
 * ═══════════════════════════════════════════════════════════════
 *
 * Complete vocabulary for all 7 Lands of the Rhythm Quest universe.
 * Designed to scale to 4,000+ words by adding entries.
 *
 * Each word entry:
 *   - id:        Unique identifier
 *   - word:      The vocabulary word
 *   - category:  Grouping within the land
 *   - icon:      Emoji placeholder (swap with <img> for production art)
 *   - audioSrc:  Optional MP3 path (falls back to Web Speech API)
 *   - posX/posY: Hotspot position as % of the scene
 * ═══════════════════════════════════════════════════════════════
 */

export const LANDS = [

    /* ═══════════════════════════════════════════════════
     * 1. HARMONIA — Language & Manners
     *    Characters: Kenji & Aiko
     * ═══════════════════════════════════════════════════ */
    {
        id: 'harmonia',
        name: 'Harmonia',
        subtitle: 'Language & Manners',
        characters: ['Kenji', 'Aiko'],
        characterImgs: ['/assets/characters/KENJI.png', '/assets/characters/AIKO.png'],
        color: '#d4a843',
        colorLight: '#FEF3C7',
        bgGradient: 'linear-gradient(180deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)',
        bgDescription: 'A warm golden village where every word carries a melody',
        slowMode: false,
        vocabulary: [
            // ── Greetings & Manners ──
            { id: 'ha-hello', word: 'Hello', category: 'Greetings', icon: '👋', audioSrc: null, posX: 10, posY: 12 },
            { id: 'ha-goodbye', word: 'Goodbye', category: 'Greetings', icon: '🤗', audioSrc: null, posX: 24, posY: 15 },
            { id: 'ha-please', word: 'Please', category: 'Manners', icon: '🙏', audioSrc: null, posX: 38, posY: 10 },
            { id: 'ha-thankyou', word: 'Thank You', category: 'Manners', icon: '💛', audioSrc: null, posX: 52, posY: 14 },
            { id: 'ha-sorry', word: 'Sorry', category: 'Manners', icon: '😔', audioSrc: null, posX: 66, posY: 10 },
            { id: 'ha-excuse', word: 'Excuse Me', category: 'Manners', icon: '🙋', audioSrc: null, posX: 80, posY: 16 },
            // ── Colors ──
            { id: 'ha-red', word: 'Red', category: 'Colors', icon: '🔴', audioSrc: null, posX: 10, posY: 38 },
            { id: 'ha-blue', word: 'Blue', category: 'Colors', icon: '🔵', audioSrc: null, posX: 22, posY: 42 },
            { id: 'ha-green', word: 'Green', category: 'Colors', icon: '🟢', audioSrc: null, posX: 34, posY: 36 },
            { id: 'ha-yellow', word: 'Yellow', category: 'Colors', icon: '🟡', audioSrc: null, posX: 46, posY: 40 },
            { id: 'ha-purple', word: 'Purple', category: 'Colors', icon: '🟣', audioSrc: null, posX: 58, posY: 36 },
            { id: 'ha-orange', word: 'Orange', category: 'Colors', icon: '🟠', audioSrc: null, posX: 70, posY: 42 },
            { id: 'ha-pink', word: 'Pink', category: 'Colors', icon: '💗', audioSrc: null, posX: 82, posY: 38 },
            { id: 'ha-white', word: 'White', category: 'Colors', icon: '⚪', audioSrc: null, posX: 92, posY: 42 },
            // ── Family ──
            { id: 'ha-mother', word: 'Mother', category: 'Family', icon: '👩', audioSrc: null, posX: 12, posY: 65 },
            { id: 'ha-father', word: 'Father', category: 'Family', icon: '👨', audioSrc: null, posX: 26, posY: 68 },
            { id: 'ha-sister', word: 'Sister', category: 'Family', icon: '👧', audioSrc: null, posX: 40, posY: 62 },
            { id: 'ha-brother', word: 'Brother', category: 'Family', icon: '👦', audioSrc: null, posX: 54, posY: 66 },
            { id: 'ha-baby', word: 'Baby', category: 'Family', icon: '👶', audioSrc: null, posX: 68, posY: 62 },
            { id: 'ha-grandma', word: 'Grandmother', category: 'Family', icon: '👵', audioSrc: null, posX: 82, posY: 68 },
            { id: 'ha-grandpa', word: 'Grandfather', category: 'Family', icon: '👴', audioSrc: null, posX: 92, posY: 64 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 2. NUMERIA — Numbers & Mathematics
     *    Characters: Kwame & Octavia
     * ═══════════════════════════════════════════════════ */
    {
        id: 'numeria',
        name: 'Numeria',
        subtitle: 'Numbers & Mathematics',
        characters: ['Kwame', 'Octavia'],
        characterImgs: ['/assets/characters/KWAME.png', '/assets/characters/OCTAVIA.png'],
        color: '#7fb685',
        colorLight: '#D1FAE5',
        bgGradient: 'linear-gradient(180deg, #6EE7B7 0%, #34D399 40%, #059669 100%)',
        bgDescription: 'A lush counting garden with mathematical rhythms',
        slowMode: false,
        vocabulary: [
            // ── Numbers ──
            { id: 'nu-one', word: 'One', category: 'Numbers', icon: '1️⃣', audioSrc: null, posX: 8, posY: 12 },
            { id: 'nu-two', word: 'Two', category: 'Numbers', icon: '2️⃣', audioSrc: null, posX: 18, posY: 15 },
            { id: 'nu-three', word: 'Three', category: 'Numbers', icon: '3️⃣', audioSrc: null, posX: 28, posY: 10 },
            { id: 'nu-four', word: 'Four', category: 'Numbers', icon: '4️⃣', audioSrc: null, posX: 38, posY: 14 },
            { id: 'nu-five', word: 'Five', category: 'Numbers', icon: '5️⃣', audioSrc: null, posX: 48, posY: 10 },
            { id: 'nu-six', word: 'Six', category: 'Numbers', icon: '6️⃣', audioSrc: null, posX: 58, posY: 16 },
            { id: 'nu-seven', word: 'Seven', category: 'Numbers', icon: '7️⃣', audioSrc: null, posX: 68, posY: 12 },
            { id: 'nu-eight', word: 'Eight', category: 'Numbers', icon: '8️⃣', audioSrc: null, posX: 78, posY: 16 },
            { id: 'nu-nine', word: 'Nine', category: 'Numbers', icon: '9️⃣', audioSrc: null, posX: 88, posY: 10 },
            { id: 'nu-ten', word: 'Ten', category: 'Numbers', icon: '🔟', audioSrc: null, posX: 50, posY: 28 },
            // ── Math Concepts ──
            { id: 'nu-add', word: 'Add', category: 'Math', icon: '➕', audioSrc: null, posX: 12, posY: 50 },
            { id: 'nu-subtract', word: 'Subtract', category: 'Math', icon: '➖', audioSrc: null, posX: 28, posY: 54 },
            { id: 'nu-equal', word: 'Equal', category: 'Math', icon: '🟰', audioSrc: null, posX: 44, posY: 48 },
            { id: 'nu-more', word: 'More', category: 'Math', icon: '📈', audioSrc: null, posX: 60, posY: 52 },
            { id: 'nu-less', word: 'Less', category: 'Math', icon: '📉', audioSrc: null, posX: 76, posY: 50 },
            // ── Measurement ──
            { id: 'nu-big', word: 'Big', category: 'Measurement', icon: '🐘', audioSrc: null, posX: 15, posY: 75 },
            { id: 'nu-small', word: 'Small', category: 'Measurement', icon: '🐜', audioSrc: null, posX: 32, posY: 78 },
            { id: 'nu-tall', word: 'Tall', category: 'Measurement', icon: '🦒', audioSrc: null, posX: 50, posY: 72 },
            { id: 'nu-short', word: 'Short', category: 'Measurement', icon: '🐁', audioSrc: null, posX: 68, posY: 76 },
            { id: 'nu-heavy', word: 'Heavy', category: 'Measurement', icon: '🏋️', audioSrc: null, posX: 85, posY: 74 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 3. VITALIS — Physical & Motor Skills
     *    Characters: Felix & Amara
     * ═══════════════════════════════════════════════════ */
    {
        id: 'vitalis',
        name: 'Vitalis',
        subtitle: 'The Mountain of Health',
        characters: ['Felix', 'Amara'],
        characterImgs: ['/assets/characters/FELIX.png', '/assets/characters/AMARA.png'],
        color: '#c4785a',
        colorLight: '#FED7AA',
        bgGradient: 'linear-gradient(180deg, #FBBF24 0%, #F97316 30%, #92400E 70%, #78350F 100%)',
        bgDescription: 'A mountain sunrise with warm golden light',
        slowMode: false,
        vocabulary: [
            // ── Head & Face ──
            { id: 'vt-eyes', word: 'Eyes', category: 'Head & Face', icon: '👀', audioSrc: null, posX: 12, posY: 10 },
            { id: 'vt-nose', word: 'Nose', category: 'Head & Face', icon: '👃', audioSrc: null, posX: 26, posY: 14 },
            { id: 'vt-mouth', word: 'Mouth', category: 'Head & Face', icon: '👄', audioSrc: null, posX: 40, posY: 10 },
            { id: 'vt-chin', word: 'Chin', category: 'Head & Face', icon: '🫦', audioSrc: null, posX: 54, posY: 16 },
            { id: 'vt-forehead', word: 'Forehead', category: 'Head & Face', icon: '🧠', audioSrc: null, posX: 68, posY: 10 },
            { id: 'vt-cheeks', word: 'Cheeks', category: 'Head & Face', icon: '😊', audioSrc: null, posX: 82, posY: 14 },
            { id: 'vt-ears', word: 'Ears', category: 'Head & Face', icon: '👂', audioSrc: null, posX: 92, posY: 10 },
            // ── Upper Body ──
            { id: 'vt-neck', word: 'Neck', category: 'Upper Body', icon: '🦒', audioSrc: null, posX: 10, posY: 35 },
            { id: 'vt-shoulders', word: 'Shoulders', category: 'Upper Body', icon: '🤷', audioSrc: null, posX: 24, posY: 38 },
            { id: 'vt-back', word: 'Back', category: 'Upper Body', icon: '🔙', audioSrc: null, posX: 38, posY: 32 },
            { id: 'vt-arms', word: 'Arms', category: 'Upper Body', icon: '💪', audioSrc: null, posX: 52, posY: 36 },
            { id: 'vt-hands', word: 'Hands', category: 'Upper Body', icon: '🤲', audioSrc: null, posX: 66, posY: 32 },
            { id: 'vt-fingers', word: 'Fingers', category: 'Upper Body', icon: '🖐️', audioSrc: null, posX: 80, posY: 38 },
            // ── Lower Body ──
            { id: 'vt-hip', word: 'Hip', category: 'Lower Body', icon: '🦴', audioSrc: null, posX: 10, posY: 60 },
            { id: 'vt-thighs', word: 'Thighs', category: 'Lower Body', icon: '🦵', audioSrc: null, posX: 24, posY: 65 },
            { id: 'vt-knees', word: 'Knees', category: 'Lower Body', icon: '🦿', audioSrc: null, posX: 38, posY: 58 },
            { id: 'vt-legs', word: 'Legs', category: 'Lower Body', icon: '🦶', audioSrc: null, posX: 52, posY: 62 },
            { id: 'vt-ankles', word: 'Ankles', category: 'Lower Body', icon: '⚓', audioSrc: null, posX: 66, posY: 58 },
            { id: 'vt-feet', word: 'Feet', category: 'Lower Body', icon: '👟', audioSrc: null, posX: 80, posY: 64 },
            { id: 'vt-toes', word: 'Toes', category: 'Lower Body', icon: '🦶', audioSrc: null, posX: 92, posY: 60 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 4. CHRONIA — Time & Seasons
     *    Characters: Elias & Selene
     * ═══════════════════════════════════════════════════ */
    {
        id: 'chronia',
        name: 'Chronia',
        subtitle: 'Time & Seasons',
        characters: ['Elias', 'Selene'],
        characterImgs: ['/assets/characters/ELIAS.png', '/assets/characters/SELENE.png'],
        color: '#9678c4',
        colorLight: '#EDE9FE',
        bgGradient: 'linear-gradient(180deg, #A78BFA 0%, #8B5CF6 40%, #6D28D9 100%)',
        bgDescription: 'A mystical twilight sky where time flows like music',
        slowMode: false,
        vocabulary: [
            // ── Days of the Week ──
            { id: 'ch-monday', word: 'Monday', category: 'Days', icon: '1️⃣', audioSrc: null, posX: 8, posY: 12 },
            { id: 'ch-tuesday', word: 'Tuesday', category: 'Days', icon: '2️⃣', audioSrc: null, posX: 22, posY: 15 },
            { id: 'ch-wednesday', word: 'Wednesday', category: 'Days', icon: '3️⃣', audioSrc: null, posX: 36, posY: 10 },
            { id: 'ch-thursday', word: 'Thursday', category: 'Days', icon: '4️⃣', audioSrc: null, posX: 50, posY: 14 },
            { id: 'ch-friday', word: 'Friday', category: 'Days', icon: '5️⃣', audioSrc: null, posX: 64, posY: 10 },
            { id: 'ch-saturday', word: 'Saturday', category: 'Days', icon: '6️⃣', audioSrc: null, posX: 78, posY: 16 },
            { id: 'ch-sunday', word: 'Sunday', category: 'Days', icon: '7️⃣', audioSrc: null, posX: 90, posY: 12 },
            // ── Seasons ──
            { id: 'ch-spring', word: 'Spring', category: 'Seasons', icon: '🌸', audioSrc: null, posX: 15, posY: 40 },
            { id: 'ch-summer', word: 'Summer', category: 'Seasons', icon: '☀️', audioSrc: null, posX: 38, posY: 44 },
            { id: 'ch-autumn', word: 'Autumn', category: 'Seasons', icon: '🍂', audioSrc: null, posX: 62, posY: 38 },
            { id: 'ch-winter', word: 'Winter', category: 'Seasons', icon: '❄️', audioSrc: null, posX: 85, posY: 42 },
            // ── Time Concepts ──
            { id: 'ch-morning', word: 'Morning', category: 'Time', icon: '🌅', audioSrc: null, posX: 12, posY: 65 },
            { id: 'ch-afternoon', word: 'Afternoon', category: 'Time', icon: '🌤️', audioSrc: null, posX: 30, posY: 68 },
            { id: 'ch-evening', word: 'Evening', category: 'Time', icon: '🌇', audioSrc: null, posX: 48, posY: 62 },
            { id: 'ch-night', word: 'Night', category: 'Time', icon: '🌙', audioSrc: null, posX: 66, posY: 66 },
            { id: 'ch-today', word: 'Today', category: 'Time', icon: '📅', audioSrc: null, posX: 82, posY: 64 },
            { id: 'ch-yesterday', word: 'Yesterday', category: 'Time', icon: '⏮️', audioSrc: null, posX: 20, posY: 82 },
            { id: 'ch-tomorrow', word: 'Tomorrow', category: 'Time', icon: '⏭️', audioSrc: null, posX: 50, posY: 85 },
            // ── Months ──
            { id: 'ch-january', word: 'January', category: 'Months', icon: '🧊', audioSrc: null, posX: 8, posY: 95 },
            { id: 'ch-february', word: 'February', category: 'Months', icon: '❤️', audioSrc: null, posX: 18, posY: 95 },
            { id: 'ch-march', word: 'March', category: 'Months', icon: '🌬️', audioSrc: null, posX: 28, posY: 95 },
            { id: 'ch-april', word: 'April', category: 'Months', icon: '🌧️', audioSrc: null, posX: 38, posY: 95 },
            { id: 'ch-may', word: 'May', category: 'Months', icon: '🌷', audioSrc: null, posX: 48, posY: 95 },
            { id: 'ch-june', word: 'June', category: 'Months', icon: '🌞', audioSrc: null, posX: 58, posY: 95 },
            { id: 'ch-july', word: 'July', category: 'Months', icon: '🎆', audioSrc: null, posX: 68, posY: 95 },
            { id: 'ch-august', word: 'August', category: 'Months', icon: '🌻', audioSrc: null, posX: 78, posY: 95 },
            { id: 'ch-september', word: 'September', category: 'Months', icon: '🍁', audioSrc: null, posX: 88, posY: 95 },
            { id: 'ch-october', word: 'October', category: 'Months', icon: '🎃', audioSrc: null, posX: 30, posY: 95 },
            { id: 'ch-november', word: 'November', category: 'Months', icon: '🦃', audioSrc: null, posX: 50, posY: 95 },
            { id: 'ch-december', word: 'December', category: 'Months', icon: '🎄', audioSrc: null, posX: 70, posY: 95 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 5. LEXICONIA — Advanced Language ("Hard Words")
     *    Characters: Ronan & Nerissa
     *    NOTE: slowMode = true for deliberate pronunciation
     * ═══════════════════════════════════════════════════ */
    {
        id: 'lexiconia',
        name: 'Lexiconia',
        subtitle: 'The Misty Shores — Hard Words',
        characters: ['Ronan', 'Nerissa'],
        characterImgs: ['/assets/characters/RONAN.png', '/assets/characters/NERISSA.png'],
        color: '#2563EB',
        colorLight: '#DBEAFE',
        bgGradient: 'linear-gradient(180deg, #94A3B8 0%, #64748B 30%, #2563EB 70%, #1E40AF 100%)',
        bgDescription: 'A misty ocean shore with gentle waves',
        slowMode: true,
        vocabulary: [
            { id: 'lx-balloon', word: 'Balloon', category: 'Multi-Syllable', icon: '🎈', audioSrc: null, posX: 12, posY: 15 },
            { id: 'lx-hawaii', word: 'Hawaii', category: 'Multi-Syllable', icon: '🌺', audioSrc: null, posX: 28, posY: 22 },
            { id: 'lx-oklahoma', word: 'Oklahoma', category: 'Multi-Syllable', icon: '🏜️', audioSrc: null, posX: 44, posY: 18 },
            { id: 'lx-louisiana', word: 'Louisiana', category: 'Multi-Syllable', icon: '🎷', audioSrc: null, posX: 60, posY: 25 },
            { id: 'lx-octopus', word: 'Octopus', category: 'Multi-Syllable', icon: '🐙', audioSrc: null, posX: 76, posY: 20 },
            { id: 'lx-vegetables', word: 'Vegetables', category: 'Multi-Syllable', icon: '🥦', audioSrc: null, posX: 88, posY: 15 },
            { id: 'lx-spaghetti', word: 'Spaghetti', category: 'Multi-Syllable', icon: '🍝', audioSrc: null, posX: 15, posY: 50 },
            { id: 'lx-macaroni', word: 'Macaroni', category: 'Multi-Syllable', icon: '🧀', audioSrc: null, posX: 35, posY: 55 },
            { id: 'lx-alaska', word: 'Alaska', category: 'Multi-Syllable', icon: '🏔️', audioSrc: null, posX: 55, posY: 48 },
            { id: 'lx-nevada', word: 'Nevada', category: 'Multi-Syllable', icon: '🌵', audioSrc: null, posX: 72, posY: 52 },
            { id: 'lx-colorado', word: 'Colorado', category: 'Multi-Syllable', icon: '⛰️', audioSrc: null, posX: 88, posY: 50 },
            { id: 'lx-butterfly', word: 'Butterfly', category: 'Multi-Syllable', icon: '🦋', audioSrc: null, posX: 12, posY: 75 },
            { id: 'lx-dinosaur', word: 'Dinosaur', category: 'Multi-Syllable', icon: '🦕', audioSrc: null, posX: 32, posY: 78 },
            { id: 'lx-caterpillar', word: 'Caterpillar', category: 'Multi-Syllable', icon: '🐛', audioSrc: null, posX: 52, posY: 72 },
            { id: 'lx-umbrella', word: 'Umbrella', category: 'Multi-Syllable', icon: '☂️', audioSrc: null, posX: 72, posY: 76 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 6. GEOMETRIA — Shapes & Spatial Reasoning
     *    Characters: Silas & Vesta
     * ═══════════════════════════════════════════════════ */
    {
        id: 'geometria',
        name: 'Geometria',
        subtitle: 'Nature & Shapes',
        characters: ['Silas', 'Vesta'],
        characterImgs: ['/assets/characters/SILAS.png', '/assets/characters/VESTA.png'],
        color: '#10B981',
        colorLight: '#D1FAE5',
        bgGradient: 'linear-gradient(180deg, #87CEEB 0%, #98D8A0 40%, #6BBF7A 100%)',
        bgDescription: 'Rolling green fields under a gentle sky',
        slowMode: false,
        vocabulary: [
            // ── Animals ──
            { id: 'gm-horse', word: 'Horse', category: 'Animals', icon: '🐴', audioSrc: null, posX: 8, posY: 20 },
            { id: 'gm-pig', word: 'Pig', category: 'Animals', icon: '🐷', audioSrc: null, posX: 22, posY: 25 },
            { id: 'gm-donkey', word: 'Donkey', category: 'Animals', icon: '🫏', audioSrc: null, posX: 36, posY: 18 },
            { id: 'gm-sheep', word: 'Sheep', category: 'Animals', icon: '🐑', audioSrc: null, posX: 50, posY: 22 },
            { id: 'gm-cat', word: 'Cat', category: 'Animals', icon: '🐱', audioSrc: null, posX: 64, posY: 28 },
            { id: 'gm-elephant', word: 'Elephant', category: 'Animals', icon: '🐘', audioSrc: null, posX: 78, posY: 15 },
            { id: 'gm-chicken', word: 'Chicken', category: 'Animals', icon: '🐔', audioSrc: null, posX: 90, posY: 26 },
            // ── Shapes ──
            { id: 'gm-circle', word: 'Circle', category: 'Shapes', icon: '⭕', audioSrc: null, posX: 10, posY: 55 },
            { id: 'gm-square', word: 'Square', category: 'Shapes', icon: '🟧', audioSrc: null, posX: 22, posY: 60 },
            { id: 'gm-triangle', word: 'Triangle', category: 'Shapes', icon: '🔺', audioSrc: null, posX: 34, posY: 52 },
            { id: 'gm-star', word: 'Star', category: 'Shapes', icon: '⭐', audioSrc: null, posX: 46, posY: 58 },
            { id: 'gm-rectangle', word: 'Rectangle', category: 'Shapes', icon: '🟩', audioSrc: null, posX: 58, posY: 54 },
            { id: 'gm-trapezoid', word: 'Trapezoid', category: 'Shapes', icon: '🔶', audioSrc: null, posX: 70, posY: 60 },
            { id: 'gm-pentagon', word: 'Pentagon', category: 'Shapes', icon: '⬠', audioSrc: null, posX: 82, posY: 52 },
            { id: 'gm-hexagon', word: 'Hexagon', category: 'Shapes', icon: '⬡', audioSrc: null, posX: 92, posY: 58 },
            { id: 'gm-octagon', word: 'Octagon', category: 'Shapes', icon: '🛑', audioSrc: null, posX: 50, posY: 75 },
            // ── Spatial ──
            { id: 'gm-up', word: 'Up', category: 'Spatial', icon: '⬆️', audioSrc: null, posX: 12, posY: 82 },
            { id: 'gm-down', word: 'Down', category: 'Spatial', icon: '⬇️', audioSrc: null, posX: 28, posY: 85 },
            { id: 'gm-left', word: 'Left', category: 'Spatial', icon: '⬅️', audioSrc: null, posX: 44, posY: 80 },
            { id: 'gm-right', word: 'Right', category: 'Spatial', icon: '➡️', audioSrc: null, posX: 60, posY: 84 },
            { id: 'gm-inside', word: 'Inside', category: 'Spatial', icon: '📦', audioSrc: null, posX: 76, posY: 80 },
            { id: 'gm-outside', word: 'Outside', category: 'Spatial', icon: '🏞️', audioSrc: null, posX: 90, posY: 84 },
        ],
    },

    /* ═══════════════════════════════════════════════════
     * 7. NATURA — Science & Nature
     *    Characters: Ezra & Athena
     * ═══════════════════════════════════════════════════ */
    {
        id: 'natura',
        name: 'Natura',
        subtitle: 'Science & Nature',
        characters: ['Ezra', 'Athena'],
        characterImgs: ['/assets/characters/EZRA.png', '/assets/characters/ATHENA.png'],
        color: '#5ba4c9',
        colorLight: '#DBEAFE',
        bgGradient: 'linear-gradient(180deg, #7DD3FC 0%, #38BDF8 40%, #0284C7 100%)',
        bgDescription: 'A serene ocean cove where nature speaks through sound',
        slowMode: false,
        vocabulary: [
            // ── Weather ──
            { id: 'na-sun', word: 'Sun', category: 'Weather', icon: '☀️', audioSrc: null, posX: 10, posY: 10 },
            { id: 'na-rain', word: 'Rain', category: 'Weather', icon: '🌧️', audioSrc: null, posX: 24, posY: 14 },
            { id: 'na-cloud', word: 'Cloud', category: 'Weather', icon: '☁️', audioSrc: null, posX: 38, posY: 10 },
            { id: 'na-wind', word: 'Wind', category: 'Weather', icon: '💨', audioSrc: null, posX: 52, posY: 16 },
            { id: 'na-snow', word: 'Snow', category: 'Weather', icon: '🌨️', audioSrc: null, posX: 66, posY: 10 },
            { id: 'na-rainbow', word: 'Rainbow', category: 'Weather', icon: '🌈', audioSrc: null, posX: 80, posY: 14 },
            { id: 'na-thunder', word: 'Thunder', category: 'Weather', icon: '⛈️', audioSrc: null, posX: 92, posY: 10 },
            // ── Plants ──
            { id: 'na-tree', word: 'Tree', category: 'Plants', icon: '🌳', audioSrc: null, posX: 10, posY: 38 },
            { id: 'na-flower', word: 'Flower', category: 'Plants', icon: '🌸', audioSrc: null, posX: 26, posY: 42 },
            { id: 'na-leaf', word: 'Leaf', category: 'Plants', icon: '🍃', audioSrc: null, posX: 42, posY: 36 },
            { id: 'na-grass', word: 'Grass', category: 'Plants', icon: '🌿', audioSrc: null, posX: 58, posY: 40 },
            { id: 'na-seed', word: 'Seed', category: 'Plants', icon: '🌱', audioSrc: null, posX: 74, posY: 38 },
            // ── Water ──
            { id: 'na-ocean', word: 'Ocean', category: 'Water', icon: '🌊', audioSrc: null, posX: 12, posY: 62 },
            { id: 'na-river', word: 'River', category: 'Water', icon: '🏞️', audioSrc: null, posX: 30, posY: 66 },
            { id: 'na-lake', word: 'Lake', category: 'Water', icon: '🏖️', audioSrc: null, posX: 48, posY: 60 },
            { id: 'na-waterfall', word: 'Waterfall', category: 'Water', icon: '💧', audioSrc: null, posX: 66, posY: 64 },
            // ── Earth Science ──
            { id: 'na-mountain', word: 'Mountain', category: 'Earth', icon: '⛰️', audioSrc: null, posX: 15, posY: 82 },
            { id: 'na-volcano', word: 'Volcano', category: 'Earth', icon: '🌋', audioSrc: null, posX: 35, posY: 86 },
            { id: 'na-rock', word: 'Rock', category: 'Earth', icon: '🪨', audioSrc: null, posX: 55, posY: 80 },
            { id: 'na-island', word: 'Island', category: 'Earth', icon: '🏝️', audioSrc: null, posX: 75, posY: 84 },
            { id: 'na-earth', word: 'Earth', category: 'Earth', icon: '🌍', audioSrc: null, posX: 90, posY: 82 },
        ],
    },
];

/**
 * Helper: Get all unique categories for a given land.
 */
export function getCategoriesForLand(landId) {
    const land = LANDS.find(l => l.id === landId);
    if (!land) return [];
    return [...new Set(land.vocabulary.map(v => v.category))];
}

/**
 * Helper: Get total word count across all lands.
 */
export function getTotalWordCount() {
    return LANDS.reduce((sum, land) => sum + land.vocabulary.length, 0);
}
