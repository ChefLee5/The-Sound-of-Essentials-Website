import{u as v,R as _,r as l,j as e,L as f}from"./index-ckh4ne8-.js";import{P as b}from"./ParallaxHero-DmULO8f4.js";import{u as m}from"./useAnimeReveal-DDKKoqQK.js";const j=()=>{const s=l.useRef(null);return l.useEffect(()=>{const i=s.current;if(!i)return;const n=new IntersectionObserver(([o])=>{o.isIntersecting&&(i.classList.add("revealed"),n.unobserve(i))},{threshold:.15});return n.observe(i),()=>n.disconnect()},[]),s},t=({children:s,className:i="",delay:n=0})=>{const o=j();return e.jsx("div",{ref:o,className:`reveal-block ${i}`,style:{animationDelay:`${n}s`},children:s})},S=()=>{const{t:s}=v();_.useEffect(()=>{document.title="The Universe — SOE Rhythm Quest"},[]);const i=[{land:"Harmonia",landIcon:"🎵",landColor:"#d4a843",duo:["Kenji","Aiko"],chars:["KENJI","AIKO"],focus:s("universe.lands.Harmonia.focus"),desc:s("universe.lands.Harmonia.desc")},{land:"Numeria",landIcon:"🔢",landColor:"#7fb685",duo:["Kwame","Octavia"],chars:["KWAME","OCTAVIA"],focus:s("universe.lands.Numeria.focus"),desc:s("universe.lands.Numeria.desc")},{land:"Vitalis",landIcon:"🤸",landColor:"#c4785a",duo:["Felix","Amara"],chars:["FELIX","AMARA"],focus:s("universe.lands.Vitalis.focus"),desc:s("universe.lands.Vitalis.desc")},{land:"Chronia",landIcon:"⏰",landColor:"#9678c4",duo:["Elias","Selene"],chars:["ELIAS","SELENE"],groupShot:"/The-Sound-of-Essentials-Eco-System/assets/duos/Celestia_Elias_Selene.webp",sceneBg:"/The-Sound-of-Essentials-Eco-System/assets/scenes/seriphia-in-celestia.webp",focus:s("universe.lands.Chronia.focus"),desc:s("universe.lands.Chronia.desc")},{land:"Lexiconia",landIcon:"📖",landColor:"#d4a843",duo:["Ronan","Nerissa"],chars:["RONAN","NERISSA"],groupShot:"/The-Sound-of-Essentials-Eco-System/assets/duos/Aquaria_Ronan_Nerissa.webp",sceneBg:"/The-Sound-of-Essentials-Eco-System/assets/scenes/b-roll-boats.webp",focus:s("universe.lands.Lexiconia.focus"),desc:s("universe.lands.Lexiconia.desc")},{land:"Geometria",landIcon:"📐",landColor:"#7fb685",duo:["Silas","Vesta"],chars:["SILAS","VESTA"],sceneBg:"/The-Sound-of-Essentials-Eco-System/assets/scenes/wildflower-path.webp",focus:s("universe.lands.Geometria.focus"),desc:s("universe.lands.Geometria.desc")},{land:"Natura",landIcon:"🌊",landColor:"#5ba4c9",duo:["Ezra","Athena"],chars:["EZRA","ATHENA"],groupShot:"/The-Sound-of-Essentials-Eco-System/assets/duos/Luminosity_Athena_Ezra.webp",sceneBg:"/The-Sound-of-Essentials-Eco-System/assets/scenes/b-roll-flowers.webp",focus:s("universe.lands.Natura.focus"),desc:s("universe.lands.Natura.desc")}],n=[{name:s("universe.pedagogy.Dalcroze.name"),desc:s("universe.pedagogy.Dalcroze.desc"),icon:"💃"},{name:s("universe.pedagogy.Orff.name"),desc:s("universe.pedagogy.Orff.desc"),icon:"🥁"},{name:s("universe.pedagogy.Kodaly.name"),desc:s("universe.pedagogy.Kodaly.desc"),icon:"🎶"}],[o,c]=l.useState(null),u=l.useRef(null),p=m({selector:".land-tile",staggerMs:70}),h=m({selector:".duo-card",staggerMs:90,translateY:[30,0]}),g=m({selector:".duo-spotlight-card",staggerMs:120,scale:[.94,1]}),x=a=>{const r=i.findIndex(d=>d.land===a);r!==-1&&(c(r),setTimeout(()=>{u.current?.scrollIntoView({behavior:"smooth",block:"center"})},100))};return e.jsxs("div",{className:"universe-page",children:[e.jsxs("header",{className:"universe-hero",style:{position:"relative",overflow:"hidden"},children:[e.jsx(b,{variant:"universe"}),e.jsx("div",{className:"container",children:e.jsxs("div",{className:"universe-hero__content animate-fade-up text-center",style:{position:"relative",zIndex:2},children:[e.jsx("div",{style:{position:"absolute",inset:"-2rem -3rem",background:"radial-gradient(ellipse 90% 90% at 50% 50%, rgba(250,248,243,0.72) 0%, transparent 100%)",borderRadius:"2rem",zIndex:-1,pointerEvents:"none"},"aria-hidden":"true"}),e.jsx("div",{className:"section-label",children:s("universe.hero_label")}),e.jsxs("h1",{children:[s("universe.hero_title_1")," ",e.jsx("span",{className:"text-gold",children:s("universe.hero_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto",position:"relative",zIndex:2},children:s("universe.hero_subtitle")})]})})]}),e.jsx("section",{className:"section glow-plum",children:e.jsx("div",{className:"container",children:e.jsx(t,{children:e.jsxs("div",{className:"seriphia-block",children:[e.jsx("div",{className:"seriphia-block__image",children:e.jsx("img",{src:"/The-Sound-of-Essentials-Eco-System/assets/characters/SERIPHIA_celestia.png",alt:"Seriphia — the guardian of the Seven Lands",className:"seriphia-portrait"})}),e.jsxs("div",{className:"seriphia-block__text",children:[e.jsx("span",{className:"section-label",children:s("universe.seriphia_label")}),e.jsx("h2",{children:s("universe.seriphia_title")}),e.jsx("p",{className:"accent-text",style:{fontSize:"1.1rem",marginBottom:"1rem"},children:s("universe.seriphia_subtitle")}),e.jsx("p",{children:s("universe.seriphia_desc_1")}),e.jsx("p",{style:{marginTop:"1rem"},children:s("universe.seriphia_desc_2")})]})]})})})}),e.jsx("section",{className:"section",children:e.jsx("div",{className:"container text-center",children:e.jsxs(t,{children:[e.jsx("div",{className:"section-label",children:s("universe.map_label")}),e.jsx("h2",{className:"section-title",children:s("universe.map_title")}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:s("universe.map_subtitle")}),e.jsx("div",{className:"lands-map-grid",ref:p,children:[{land:"Harmonia",icon:"🎵",color:"#d4a843",duo:"Kenji & Aiko",focus:"Music & Rhythm"},{land:"Numeria",icon:"🔢",color:"#7fb685",duo:"Kwame & Octavia",focus:"Numbers & Counting"},{land:"Vitalis",icon:"🤸",color:"#c4785a",duo:"Felix & Amara",focus:"Movement & Wellness"},{land:"Chronia",icon:"⏰",color:"#9678c4",duo:"Elias & Selene",focus:"Time & Seasons"},{land:"Lexiconia",icon:"📖",color:"#d4897a",duo:"Ronan & Nerissa",focus:"Language & Stories"},{land:"Geometria",icon:"📐",color:"#5fb685",duo:"Silas & Vesta",focus:"Shapes & Space"},{land:"Natura",icon:"🌊",color:"#5ba4c9",duo:"Ezra & Athena",focus:"Nature & Science"}].map(a=>e.jsxs("div",{className:"land-tile",style:{"--land-color":a.color},onClick:()=>x(a.land),role:"button",tabIndex:0,title:`Explore ${a.land}`,children:[e.jsx("span",{className:"land-tile__icon",children:a.icon}),e.jsx("h3",{className:"land-tile__name",style:{color:a.color},children:a.land}),e.jsx("p",{className:"land-tile__duo",children:a.duo}),e.jsx("p",{className:"land-tile__focus",children:a.focus}),e.jsx("div",{className:"land-tile__glow","aria-hidden":"true"})]},a.land))})]})})}),e.jsx("section",{className:"section glow-plum",children:e.jsxs("div",{className:"container",children:[e.jsxs(t,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:"✨ Featured Duos"}),e.jsxs("h2",{className:"section-title",children:["Together They ",e.jsx("span",{className:"text-plum",children:"Learn"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 3rem auto"},children:"Three iconic duos, three legendary lands — each pair bringing their unique gifts to the Quest."})]}),e.jsx("div",{className:"duo-spotlight-grid",ref:g,children:i.filter(a=>a.groupShot).map((a,r)=>e.jsxs("div",{className:"duo-spotlight-card glass-card anime-item",style:{"--spotlight-color":a.landColor},children:[e.jsxs("div",{className:"duo-spotlight-card__img-wrap",children:[e.jsx("img",{src:a.groupShot,alt:`${a.duo[0]} and ${a.duo[1]} from ${a.land}`,className:"duo-spotlight-card__img"}),e.jsxs("div",{className:"duo-spotlight-card__overlay",children:[e.jsx("span",{className:"duo-spotlight-card__land-icon",children:a.landIcon}),e.jsx("span",{className:"duo-spotlight-card__land",style:{color:a.landColor},children:a.land})]})]}),e.jsxs("div",{className:"duo-spotlight-card__body",children:[e.jsxs("h3",{className:"duo-spotlight-card__names",style:{color:a.landColor},children:[a.duo[0]," & ",a.duo[1]]}),e.jsx("p",{className:"duo-spotlight-card__focus",children:a.focus})]})]},a.land))})]})}),e.jsx("section",{className:"section glow-sage",children:e.jsxs("div",{className:"container",children:[e.jsxs(t,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:s("universe.lands_label")}),e.jsxs("h2",{className:"section-title",children:[s("universe.lands_title_1")," ",e.jsx("span",{className:"text-sage",children:s("universe.lands_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 3rem auto"},children:s("universe.lands_subtitle")})]}),e.jsx("div",{className:"duos-grid",ref:a=>{u.current=a,h.current=a},children:i.map((a,r)=>e.jsxs("div",{className:`duo-card glass-card anime-item ${o===r?"duo-card--active":""}`,onClick:()=>c(o===r?null:r),role:"button",tabIndex:0,"aria-expanded":o===r,onKeyDown:d=>d.key==="Enter"&&c(o===r?null:r),style:a.sceneBg?{"--scene-bg":`url(${a.sceneBg})`}:{},children:[a.sceneBg&&e.jsx("div",{className:"duo-card__scene-bg","aria-hidden":"true"}),e.jsxs("div",{className:"duo-card__header",children:[e.jsx("span",{className:"duo-card__land-icon",children:a.landIcon}),e.jsxs("div",{children:[e.jsx("h3",{style:{color:a.landColor},children:a.land}),e.jsx("span",{className:"duo-card__focus",children:a.focus})]})]}),e.jsx("div",{className:"duo-card__image-wrap",children:e.jsxs("div",{className:"duo-card__char-pair",children:[e.jsx("img",{src:`/The-Sound-of-Essentials-Eco-System/assets/characters/${a.chars[0]}_crop.png`,alt:a.duo[0],className:"duo-card__char-img"}),e.jsx("img",{src:`/The-Sound-of-Essentials-Eco-System/assets/characters/${a.chars[1]}_crop.png`,alt:a.duo[1],className:"duo-card__char-img"})]})}),e.jsx("p",{className:"duo-card__names",children:a.duo.join(" & ")}),o===r&&e.jsx("p",{className:"duo-card__desc animate-fade-in",children:a.desc})]},a.land))})]})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(t,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:s("universe.science_label")}),e.jsxs("h2",{className:"section-title",children:[s("universe.science_title_1")," ",e.jsx("span",{className:"text-plum",children:s("universe.science_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 3rem auto"},children:s("universe.science_subtitle")})]}),e.jsx("div",{className:"pedagogy-grid",children:n.map((a,r)=>e.jsx(t,{delay:r*.15,children:e.jsxs("div",{className:"glass-card pedagogy-card",children:[e.jsx("span",{className:"pedagogy-card__icon",children:a.icon}),e.jsx("h3",{children:a.name}),e.jsx("p",{children:a.desc})]})},a.name))}),e.jsx(t,{className:"text-center",delay:.4,children:e.jsx("div",{style:{marginTop:"3rem"},children:e.jsx(f,{to:"/media",className:"page-bottom-link",children:s("home.explore_media")})})})]})}),e.jsx("style",{children:`
        .universe-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .universe-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .universe-hero {
          padding: 10rem 0 4rem;
          position: relative;
        }

        /* ── Seriphia ── */
        .seriphia-block {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 4rem;
          align-items: center;
        }

        .seriphia-block__image img {
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border: 2px solid var(--color-border);
          max-height: 500px;
          object-fit: cover;
          width: 100%;
        }

        .seriphia-portrait {
          width: 100%;
          max-height: 520px;
          object-fit: cover;
          object-position: top center;
          border-radius: var(--radius-lg);
          box-shadow: 0 20px 60px rgba(0,0,0,0.14);
          border: 2px solid var(--color-border);
          display: block;
        }

        .seriphia-block__text h2 {
          font-size: 2.2rem;
          margin-bottom: 0.3rem;
        }

        .seriphia-block__text p {
          color: var(--color-text-secondary);
          line-height: 1.8;
        }

        /* ── Lands Map Grid ── */
        .lands-map-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .land-tile {
          position: relative;
          background: #fff;
          border: 2px solid var(--land-color);
          border-radius: var(--radius-lg);
          padding: 1.5rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: transform 0.3s var(--ease-gentle), box-shadow 0.3s var(--ease-gentle);
          overflow: hidden;
        }

        .land-tile:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10), 0 0 0 1px var(--land-color);
        }

        .land-tile__glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--land-color);
          opacity: 0.06;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .land-tile:hover .land-tile__glow {
          opacity: 0.12;
        }

        .land-tile__icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 0.3rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__duo {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          font-weight: 600;
          margin: 0 0 0.15rem;
          position: relative;
          z-index: 1;
        }

        .land-tile__focus {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .lands-map-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .lands-map-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
        }

        /* ── Duo Spotlight Grid ── */
        .duo-spotlight-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 0;
        }

        .duo-spotlight-card {
          padding: 0;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.05);
          transition: all var(--transition-med);
          cursor: default;
        }

        .duo-spotlight-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.14), 0 0 30px rgba(from var(--spotlight-color) r g b / 0.08);
          border-color: var(--spotlight-color);
        }

        .duo-spotlight-card__img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
        }

        .duo-spotlight-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.6s var(--ease-gentle);
        }

        .duo-spotlight-card:hover .duo-spotlight-card__img {
          transform: scale(1.05);
        }

        .duo-spotlight-card__overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem 1.5rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .duo-spotlight-card__land-icon {
          font-size: 1.3rem;
        }

        .duo-spotlight-card__land {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .duo-spotlight-card__body {
          padding: 1.25rem 1.5rem;
        }

        .duo-spotlight-card__names {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }

        .duo-spotlight-card__focus {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
        }

        @media (max-width: 900px) {
          .duo-spotlight-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Duos Grid ── */
        .duos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .duo-card {
          cursor: pointer;
          text-align: center;
          padding: 2rem;
          transition: all var(--transition-med);
        }

        @media (max-width: 480px) {
          .duo-card {
            padding: 1.5rem 1rem;
          }
        }

        .duo-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }

        .duo-card__land-icon {
          font-size: 2rem;
        }

        .duo-card__header h3 {
          font-size: 1.2rem;
          margin-bottom: 0.1rem;
        }

        .duo-card__focus {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .duo-card__image-wrap {
          margin-bottom: 1rem;
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        /* ── Scene backdrop on duo cards ── */
        .duo-card {
          position: relative;
          overflow: hidden;
        }

        .duo-card__scene-bg {
          position: absolute;
          inset: 0;
          background-image: var(--scene-bg);
          background-size: cover;
          background-position: center;
          opacity: 0.08;
          transition: opacity 0.5s ease;
          animation: kenBurns 14s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 0;
        }

        .duo-card:hover .duo-card__scene-bg {
          opacity: 0.15;
        }

        .duo-card__header,
        .duo-card__image-wrap,
        .duo-card__names,
        .duo-card__desc {
          position: relative;
          z-index: 1;
        }

        /* ── Character pair inside duo card ── */
        .duo-card__char-pair {
          display: flex;
          gap: 4px;
          height: 200px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: transparent;
        }

        .duo-card__char-img {
          flex: 1;
          width: 50%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          transition: transform 0.45s var(--ease-gentle);
        }

        .duo-card:hover .duo-card__char-img {
          transform: scale(1.06);
        }

        .duo-card__names {
          font-family: var(--font-heading);
          font-weight: 600;
          color: var(--color-text-primary);
          font-size: 1rem;
        }

        .duo-card__desc {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        /* ── Pedagogy ── */
        .pedagogy-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .pedagogy-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .pedagogy-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .pedagogy-card h3 {
          font-size: 1.15rem;
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .pedagogy-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        @media (max-width: 968px) {
          .seriphia-block {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .seriphia-block__image img {
            max-height: 350px;
            margin: 0 auto;
          }
          .pedagogy-grid {
            grid-template-columns: 1fr;
          }
        }
      `})]})};export{S as default};
