import{u as p,r as u,j as e,L as f,R as d}from"./index-ckh4ne8-.js";const b=[{name:"Seriphia",title:"An Eternal Learning Mother",land:"The Celestial",landColor:"#9C27B0",focus:"Guardian & Guide",img:"/assets/characters/ETERNAL LEARNING MOTHER.png",bio:"Seriphia is the radiant guardian who oversees all seven lands. Her calm, nurturing presence anchors every lesson, guiding children through each stage of their developmental journey with warmth and wisdom. She is ever-present, attuned to each child's pace.",traits:["Wisdom","Patience","Nurturing"],featured:!0},{name:"Kenji",title:"The Word Musician",land:"Harmonia",landColor:"#d4a843",focus:"Language & Manners",img:"/assets/characters/KENJI.png",bio:"Kenji discovers that every word carries a melody. Through phonics, vocabulary songs, and the art of respectful communication, he unlocks the musical power hidden within language itself.",traits:["Creative","Curious","Respectful"]},{name:"Aiko",title:"The Harmony Keeper",land:"Harmonia",landColor:"#d4a843",focus:"Language & Manners",img:"/assets/characters/AIKO.png",bio:"Aiko brings harmony to every conversation. She teaches children that communication is a musical exchange—listening is as important as speaking, and kindness gives every word its truest note.",traits:["Empathetic","Articulate","Kind"]},{name:"Kwame",title:"The Rhythm Counter",land:"Numeria",landColor:"#7fb685",focus:"Numbers & Mathematics",img:"/assets/characters/KWAME.png",bio:"Kwame hears numbers in every beat. In Numeria, he transforms counting, patterns, and mathematical foundations into rhythmic adventures that make abstract concepts tangible and fun.",traits:["Analytical","Rhythmic","Patient"]},{name:"Octavia",title:"The Pattern Weaver",land:"Numeria",landColor:"#7fb685",focus:"Numbers & Mathematics",img:"/assets/characters/OCTAVIA.png",bio:"Octavia sees patterns everywhere—in music, in nature, in numbers. She weaves mathematical thinking into every melody, helping children recognize the beautiful order underlying the world.",traits:["Observant","Logical","Playful"]},{name:"Felix",title:"The Movement Master",land:"Vitalis",landColor:"#c4785a",focus:"Physical & Motor Skills",img:"/assets/characters/FELIX.png",bio:"Felix moves through Vitalis with boundless energy. Dance, stretching, and body coordination come alive as he builds strong physical foundations through joyful, musical movement.",traits:["Energetic","Coordinated","Joyful"]},{name:"Amara",title:"The Dance Guide",land:"Vitalis",landColor:"#c4785a",focus:"Physical & Motor Skills",img:"/assets/characters/AMARA.png",bio:"Amara knows that the body is the first instrument. She guides children through rhythmic movement exercises that develop motor skills, spatial awareness, and physical confidence.",traits:["Graceful","Encouraging","Strong"]},{name:"Elias",title:"The Time Keeper",land:"Chronia",landColor:"#9678c4",focus:"Time & Seasons",img:"/assets/characters/ELIAS.png",bio:"Elias understands the rhythm of time itself. Days, months, and seasons become musical compositions in Chronia, making the abstract flow of time something children can feel and understand.",traits:["Thoughtful","Steady","Wise"]},{name:"Selene",title:"The Season Singer",land:"Chronia",landColor:"#9678c4",focus:"Time & Seasons",img:"/assets/characters/SELENE.png",bio:"Selene sings the songs of seasons. Her melodies teach children to recognize the cyclical nature of time—spring's renewal, summer's warmth, autumn's change, and winter's rest.",traits:["Intuitive","Melodic","Reflective"]},{name:"Ronan",title:"The Word Warrior",land:"Lexiconia",landColor:"#d4a843",focus:"Advanced Language",img:"/assets/characters/RONAN.png",bio:"Ronan tackles the hardest words with courage and rhythm. In Lexiconia, phonetic challenges become musical adventures, turning complex sounds into conquerable melodies.",traits:["Brave","Persistent","Articulate"]},{name:"Nerissa",title:"The Sound Sculptor",land:"Lexiconia",landColor:"#d4a843",focus:"Advanced Language",img:"/assets/characters/NERISSA.png",bio:"Nerissa sculpts difficult sounds into beautiful words. She shows children that every challenging phoneme is just a note waiting to be learned, practiced, and mastered.",traits:["Precise","Creative","Determined"]},{name:"Silas",title:"The Shape Finder",land:"Geometria",landColor:"#7fb685",focus:"Shapes & Spatial Reasoning",img:"/assets/characters/SILAS.png",bio:"Silas sees geometry in everything. The landscapes of Geometria come alive as he helps children recognize shapes, spatial relationships, and the mathematical beauty of the world around them.",traits:["Observant","Inventive","Precise"]},{name:"Vesta",title:"The Space Navigator",land:"Geometria",landColor:"#7fb685",focus:"Shapes & Spatial Reasoning",img:"/assets/characters/VESTA.png",bio:"Vesta navigates the geometric landscapes with confidence. She teaches spatial awareness through melody, helping children understand how shapes fit together and relate to one another.",traits:["Confident","Spatial","Methodical"]},{name:"Ezra",title:"The Nature Listener",land:"Natura",landColor:"#5ba4c9",focus:"Science & Nature",img:"/assets/characters/EZRA.png",bio:"Ezra listens to what nature has to teach. The body, the ocean, the rain—every natural phenomenon becomes a musical lesson, illuminating the wonders of science through sound.",traits:["Curious","Gentle","Scientific"]},{name:"Athena",title:"The Discovery Sage",land:"Natura",landColor:"#5ba4c9",focus:"Science & Nature",img:"/assets/characters/ATHENA.png",bio:"Athena brings the wisdom of the natural world to every child. She uses music to illuminate how bodies work, why rain falls, and what makes the ocean sing—science made magical.",traits:["Wise","Adventurous","Nurturing"]}],g=({children:a,className:n="",delay:o=0})=>{const t=d.useRef(null),[s,i]=d.useState(!1);return d.useEffect(()=>{const c=t.current;if(!c)return;const l=new IntersectionObserver(([r])=>{r.isIntersecting&&(i(!0),l.unobserve(c))},{threshold:.15});return l.observe(c),()=>l.disconnect()},[]),e.jsx("div",{ref:t,className:`reveal-block ${s?"revealed":""} ${n}`,style:{transitionDelay:`${o}s`},children:a})},m=b,x=({traitId:a,color:n})=>{const{t:o}=p(),[t,s]=d.useState(!1),i=d.useRef(null),c=o(`heroes.traits.${a}.name`),l=o(`heroes.traits.${a}.desc`);return d.useEffect(()=>{if(!t)return;const r=h=>{i.current&&!i.current.contains(h.target)&&s(!1)};return document.addEventListener("click",r,!0),()=>document.removeEventListener("click",r,!0)},[t]),e.jsxs("span",{ref:i,className:`char-card__trait ${t?"char-card__trait--active":""}`,style:{borderColor:n,color:n},onClick:r=>{r.stopPropagation(),s(!t)},role:"button",tabIndex:0,"aria-label":`${c}: ${l}`,children:[c,t&&l&&e.jsxs("span",{className:"trait-tooltip",style:{borderColor:n},children:[e.jsx("strong",{style:{color:n},children:c}),e.jsx("span",{className:"trait-tooltip__text",children:l})]})]})},v=({char:a,index:n,isExpanded:o,onToggle:t})=>{const{t:s}=p();return e.jsx(g,{delay:n*.08,children:e.jsxs("div",{className:`char-card glass-card ${a.featured?"char-card--featured":""} ${o?"char-card--expanded":""}`,onClick:t,role:"button",tabIndex:0,onKeyDown:i=>i.key==="Enter"&&t(),"aria-expanded":o,children:[e.jsxs("div",{className:"char-card__image-wrap",children:[a.name==="Seriphia"?e.jsx("div",{className:"char-card__img-bg char-card__img-bg--scene",children:e.jsx("img",{src:"/The-Sound-of-Essentials-Eco-System/assets/characters/SERIPHIA_celestia.png",alt:a.name,className:"char-card__image char-card__image--scene"})}):e.jsx("div",{className:"char-card__img-bg",style:{background:"#fff"},children:e.jsx("img",{src:`/The-Sound-of-Essentials-Eco-System/assets/characters/${a.name.toUpperCase()}_crop.png`,alt:a.name,className:"char-card__image",style:{mixBlendMode:"multiply"}})}),e.jsx("div",{className:"char-card__land-badge",style:{background:a.landColor},children:s(`heroes.lands.${a.land}`)})]}),e.jsxs("div",{className:"char-card__info",children:[e.jsx("h3",{className:"char-card__name",style:{color:a.landColor},children:a.name}),e.jsx("p",{className:"char-card__title",children:s(`heroes.data.${a.name}.title`)}),e.jsx("p",{className:"char-card__focus",children:s(`heroes.data.${a.name}.focus`)}),o&&e.jsxs("div",{className:"char-card__details animate-fade-in",children:[e.jsx("p",{className:"char-card__bio",children:s(`heroes.data.${a.name}.bio`)}),e.jsx("div",{className:"char-card__traits",children:a.traits.map(i=>e.jsx(x,{traitId:i,color:a.landColor},i))})]}),e.jsx("span",{className:"char-card__toggle",children:s(o?"heroes.show_less":"heroes.read_more")})]})]})})},y=()=>{const{t:a}=p(),[n,o]=u.useState(null),[t,s]=u.useState("All"),i=[...new Set(m.map(r=>r.land))],c=[{id:"All",label:a("heroes.filter_all")},...i.map(r=>({id:r,label:a(`heroes.lands.${r}`)}))],l=t==="All"?m:m.filter(r=>r.land===t);return e.jsxs("div",{className:"characters-page",children:[e.jsx("header",{className:"char-hero",children:e.jsx("div",{className:"container text-center",children:e.jsxs("div",{className:"animate-fade-up",children:[e.jsx("div",{className:"section-label",children:a("heroes.hero_label")}),e.jsxs("h1",{children:[a("heroes.hero_title_1")," ",e.jsx("span",{className:"text-gold",children:a("heroes.hero_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto"},children:a("heroes.hero_subtitle")})]})})}),e.jsx("section",{className:"section",style:{paddingTop:"2rem",paddingBottom:0},children:e.jsx("div",{className:"container",children:e.jsx(g,{children:e.jsx("div",{className:"char-filters",children:c.map(r=>e.jsx("button",{className:`char-filter-btn ${t===r.id?"char-filter-btn--active":""}`,onClick:()=>s(r.id),children:r.label},r.id))})})})}),e.jsx("section",{className:"section",children:e.jsx("div",{className:"container",children:e.jsx("div",{className:"char-grid",children:l.map((r,h)=>e.jsx(v,{char:r,index:h,isExpanded:n===r.name,onToggle:()=>o(n===r.name?null:r.name)},r.name))})})}),e.jsx("section",{className:"section text-center",children:e.jsx("div",{className:"container",children:e.jsxs(g,{children:[e.jsxs("h2",{className:"section-title",children:[a("heroes.cta_title_1")," ",e.jsx("span",{className:"text-gold",children:a("heroes.cta_title_2")}),"?"]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto 2rem"},children:a("heroes.cta_subtitle")}),e.jsx("div",{style:{marginTop:"2rem"},children:e.jsx(f,{to:"/media",className:"page-bottom-link",children:a("home.explore_media")})})]})})}),e.jsx("style",{children:`
                .characters-page .reveal-block {
                    opacity: 0;
                    transform: translateY(25px);
                    transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
                }
                .characters-page .reveal-block.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }

                .char-hero {
                    padding: 10rem 0 4rem;
                }

                /* ── Filters ── */
                .char-filters {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                }

                .char-filter-btn {
                    background: var(--color-bg-card);
                    border: 2px solid var(--color-border);
                    border-radius: 999px;
                    padding: 0.5rem 1.25rem;
                    font-family: var(--font-heading);
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .char-filter-btn:hover {
                    border-color: var(--color-green);
                    color: var(--color-green);
                }

                .char-filter-btn--active {
                    background: var(--color-green);
                    border-color: var(--color-green);
                    color: #fff;
                }

                /* ── Grid ── */
                .char-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }

                /* ── Card ── */
                .char-card {
                    padding: 0;
                    cursor: pointer;
                    transition: transform 0.35s var(--ease-gentle), box-shadow 0.35s var(--ease-gentle);
                }

                .char-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
                }

                .char-card--featured {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                }

                .char-card--featured .char-card__image-wrap {
                    height: 100%;
                }

                .char-card--featured .char-card__image {
                    height: 100%;
                    min-height: 500px;
                    object-fit: cover;
                    object-position: top center;
                    image-rendering: -webkit-optimize-contrast;
                }

                /* ── Image ── */
                .char-card__image-wrap {
                    position: relative;
                    overflow: hidden;
                }

                .char-card__image-wrap::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 55%;
                    height: 30%;
                    background: linear-gradient(to top left, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0) 70%);
                    pointer-events: none;
                    z-index: 1;
                }

                /* ── Image Container ── */
                .char-card__img-bg {
                    width: 100%;
                    min-height: 220px;
                    background: #fff;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    overflow: hidden;
                    border-bottom: 3px solid rgba(255,255,255,0.5);
                }

                .char-card__image {
                    width: 100%;
                    height: 220px;
                    object-fit: contain;
                    object-position: center bottom;
                    display: block;
                    transition: transform 0.5s var(--ease-gentle);
                }

                .char-card--featured .char-card__img-bg {
                    min-height: 400px;
                }

                .char-card--featured .char-card__image {
                    height: 400px;
                }

                .char-card:hover .char-card__image {
                    transform: scale(1.04);
                }

                /* ── Seriphia scene variant ── */
                .char-card__img-bg--scene {
                    background: linear-gradient(135deg, #1a1060 0%, #4a2080 50%, #c47020 100%);
                }

                .char-card__image--scene {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    object-position: 30% top;
                    display: block;
                    mix-blend-mode: normal;
                    transition: transform 0.5s var(--ease-gentle);
                }

                .char-card--featured .char-card__image--scene {
                    height: 400px;
                    object-position: 30% top;
                }

                .char-card:hover .char-card__image--scene {
                    transform: scale(1.04);
                }

                .char-card__land-badge {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #fff;
                    padding: 0.3rem 0.8rem;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                /* ── Info ── */
                .char-card__info {
                    padding: 1.25rem;
                }

                .char-card__name {
                    font-family: var(--font-heading);
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin: 0 0 0.15rem;
                }

                .char-card__title {
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--color-text-secondary);
                    margin: 0 0 0.25rem;
                }

                .char-card__focus {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0 0 0.75rem;
                }

                .char-card__bio {
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    margin: 0 0 1rem;
                }

                .char-card__traits {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }

                .char-card__trait {
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 0.2rem 0.65rem;
                    border: 1.5px solid;
                    border-radius: 999px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    position: relative;
                    transition: background 0.2s ease, color 0.2s ease;
                }

                .char-card__trait:hover {
                    background: var(--color-bg-card);
                }

                .char-card__trait--active {
                    background: var(--color-bg-card);
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                }

                /* ── Trait Tooltip ── */
                .trait-tooltip {
                    position: absolute;
                    bottom: calc(100% + 10px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: clamp(200px, 80vw, 240px);
                    background: var(--color-bg-card, #fff);
                    border: 1.5px solid;
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                    z-index: 100;
                    text-transform: none;
                    letter-spacing: 0;
                    font-weight: 400;
                    animation: traitTipIn 0.25s ease both;
                    cursor: default;
                    pointer-events: none; /* Prevents sticky hover issues on mobile */
                }

                @media (max-width: 480px) {
                    .trait-tooltip {
                        left: auto;
                        right: 0;
                        transform: none;
                        width: 200px;
                    }
                    .trait-tooltip::after {
                        left: 85%;
                    }
                }

                .trait-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 6px solid transparent;
                    border-top-color: var(--color-bg-card, #fff);
                }

                .trait-tooltip strong {
                    display: block;
                    font-size: 0.85rem;
                    margin-bottom: 0.3rem;
                }

                .trait-tooltip__text {
                    display: block;
                    font-size: 0.8rem;
                    line-height: 1.5;
                    color: var(--color-text-secondary);
                }

                @keyframes traitTipIn {
                    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .char-card__toggle {
                    display: inline-block;
                    margin-top: 0.75rem;
                    font-size: 0.8rem;
                    color: var(--color-text-muted);
                    font-weight: 500;
                }

                .char-card__details.animate-fade-in {
                    animation: charFadeIn 0.4s ease both;
                }

                @keyframes charFadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .char-card--featured {
                        grid-template-columns: 1fr;
                    }
                    .char-card--featured .char-card__image {
                        min-height: 250px;
                    }
                    .char-grid {
                        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                        gap: 1.25rem;
                    }
                }
            `})]})};export{y as default};
