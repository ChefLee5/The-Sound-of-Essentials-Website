import{u as b,R as j,j as e,L as w,r as l}from"./index-CeGoSQr5.js";import{u as N}from"./useAnimeReveal-Cfs0Rjts.js";const y=()=>{const s=l.useRef(null);return l.useEffect(()=>{const i=s.current;if(!i)return;const n=new IntersectionObserver(([o])=>{o.isIntersecting&&(i.classList.add("revealed"),n.unobserve(i))},{threshold:.15});return n.observe(i),()=>n.disconnect()},[]),s},a=({children:s,className:i="",delay:n=0})=>{const o=y();return e.jsx("div",{ref:o,className:`reveal-block ${i}`,style:{animationDelay:`${n}s`},children:s})},m=({value:s,suffix:i="",label:n,color:o})=>{const h=l.useRef(null),c=l.useRef(null);l.useEffect(()=>{const r=h.current;if(!r)return;const t=new IntersectionObserver(([d])=>{d.isIntersecting&&(g(),t.unobserve(r))},{threshold:.5});return t.observe(r),()=>t.disconnect()},[]);const g=()=>{const r=parseInt(s),t=2e3,d=performance.now(),u=x=>{const f=x-d,p=Math.min(f/t,1),v=1-Math.pow(1-p,3);c.current&&(c.current.textContent=Math.floor(v*r).toLocaleString()+i),p<1&&requestAnimationFrame(u)};requestAnimationFrame(u)};return e.jsxs("div",{ref:h,className:"mission-stat glass-card",children:[e.jsxs("span",{ref:c,className:"mission-stat__number",style:{color:o},children:["0",i]}),e.jsx("span",{className:"mission-stat__label",children:n})]})},_=[{src:"b-roll-boats.webp",caption:"On the Water",land:"Lexiconia"},{src:"b-roll-flowers.webp",caption:"Through the Fields",land:"Natura"},{src:"climb-numeria.webp",caption:"Climbing Numeria",land:"Numeria"},{src:"donkey.webp",caption:"A Trusty Companion",land:"Animalia"},{src:"drums.webp",caption:"The Beat Goes On",land:"Harmonia"},{src:"seriphia-in-celestia.webp",caption:"Seriphia at the Gate",land:"Celestia"},{src:"touch-your-toes.webp",caption:"Body in Motion",land:"Kinesthia"},{src:"wave.webp",caption:"Riding the Wave",land:"Aquaria"}],k=()=>{const s=N({selector:".mission-scene",staggerMs:85,translateY:[24,0],scale:[.96,1]});return e.jsx("section",{className:"section mission-scene-section",children:e.jsxs("div",{className:"container",children:[e.jsxs(a,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:"🌍 The Seven Lands"}),e.jsxs("h2",{className:"section-title",children:["A World Built for ",e.jsx("span",{className:"text-gold",children:"Every Child"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2.5rem auto"},children:"Each land in the Rhythm Quest universe mirrors a real domain of learning — bringing vocabulary, music, and movement to life through immersive scenes."})]}),e.jsx("div",{className:"mission-scene-mosaic",ref:s,children:_.map(i=>e.jsxs("div",{className:"mission-scene anime-item",children:[e.jsx("img",{src:`/The-Sound-of-Essentials-Eco-System/assets/scenes/${i.src}`,alt:i.caption,loading:"lazy"}),e.jsxs("div",{className:"mission-scene__label",children:[e.jsx("span",{className:"mission-scene__land",children:i.land}),e.jsx("span",{className:"mission-scene__caption",children:i.caption})]})]},i.src))})]})})},E=()=>{const{t:s}=b();return j.useEffect(()=>{document.title="Our Mission — SOE Rhythm Quest"},[]),e.jsxs("div",{className:"mission-page",children:[e.jsx("header",{className:"mission-hero",children:e.jsx("div",{className:"container text-center",children:e.jsxs("div",{className:"animate-fade-up",children:[e.jsx("div",{className:"section-label",children:"Our Mission"}),e.jsxs("h1",{children:["A ",e.jsx("span",{className:"accent-text",children:"State of Emergency"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto"},children:"The world's most vulnerable children are running out of time. SOE exists to change that equation through the universal language of music."})]})})}),e.jsx("section",{className:"section glow-plum",children:e.jsxs("div",{className:"container",children:[e.jsx(a,{children:e.jsxs("div",{className:"manifesto-block text-center",children:[e.jsx("h2",{style:{fontSize:"clamp(1.8rem, 3.5vw, 2.6rem)",maxWidth:"800px",margin:"0 auto 2rem"},children:'"Right now, 300 million children on this planet cannot read at a basic level. 44 million teachers are absent from classrooms that need them most."'}),e.jsx("div",{className:"divider divider-center"}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto"},children:"These are not just statistics. Behind every number is a child whose neurological window of opportunity is closing. The systems designed to help them are overwhelmed, underfunded, and too slow."})]})}),e.jsx(a,{children:e.jsxs("div",{className:"manifesto-stats",children:[e.jsx(m,{value:"300",suffix:"M",label:"Children lack basic literacy worldwide",color:"var(--color-gold)"}),e.jsx(m,{value:"44",suffix:"M",label:"Global teacher deficit — classrooms without educators",color:"var(--color-sage)"}),e.jsx(m,{value:"1000",suffix:"",label:"Critical days of brain development — the biological window",color:"var(--color-plum-light)"})]})})]})}),e.jsx("section",{className:"section glow-sage",children:e.jsx("div",{className:"container",children:e.jsx(a,{children:e.jsxs("div",{className:"bio-window",children:[e.jsxs("div",{className:"bio-window__content",children:[e.jsx("div",{className:"section-label",children:"The Biological Imperative"}),e.jsxs("h2",{children:[e.jsx("span",{className:"text-gold",children:"1 million"})," neural connections."," ",e.jsx("span",{className:"text-sage",children:"Every second."})]}),e.jsx("p",{style:{maxWidth:"600px",margin:"1.5rem 0"},children:"In the first 1,000 days of life, a child's brain forms over one million new neural connections every single second. This is the most explosive period of cognitive development a human being will ever experience."}),e.jsx("p",{style:{maxWidth:"600px"},children:"This window does not wait for policy reforms. It does not wait for funding cycles. It does not wait for teacher training programs to graduate their next cohort. Biology operates on its own timeline—and right now, we are losing the race."})]}),e.jsx("div",{className:"bio-window__visual",children:e.jsxs("div",{className:"neural-viz","aria-hidden":"true",children:[e.jsx("div",{className:"neural-circle neural-circle--1"}),e.jsx("div",{className:"neural-circle neural-circle--2"}),e.jsx("div",{className:"neural-circle neural-circle--3"}),e.jsx("span",{className:"neural-number",children:"1M"}),e.jsx("span",{className:"neural-label",children:"connections / second"})]})})]})})})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(a,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:s("mission.solution_label")}),e.jsxs("h2",{className:"section-title",children:[s("mission.solution_title_1")," ",e.jsx("span",{className:"text-sage",children:s("mission.solution_title_2")})," ",s("mission.solution_title_3")]})]}),e.jsx(a,{children:e.jsxs("div",{className:"solution-grid",children:[e.jsxs("div",{className:"glass-card solution-card",children:[e.jsx("span",{className:"solution-card__icon",children:"🎵"}),e.jsx("h3",{children:s("mission.solutions.music.title")}),e.jsx("p",{children:s("mission.solutions.music.desc")})]}),e.jsxs("div",{className:"glass-card solution-card",children:[e.jsx("span",{className:"solution-card__icon",children:"📦"}),e.jsx("h3",{children:s("mission.solutions.box.title")}),e.jsx("p",{children:s("mission.solutions.box.desc")})]}),e.jsxs("div",{className:"glass-card solution-card",children:[e.jsx("span",{className:"solution-card__icon",children:"🌍"}),e.jsx("h3",{children:s("mission.solutions.scale.title")}),e.jsx("p",{children:s("mission.solutions.scale.desc")})]}),e.jsxs("div",{className:"glass-card solution-card",children:[e.jsx("span",{className:"solution-card__icon",children:"🧠"}),e.jsx("h3",{children:s("mission.solutions.neuro.title")}),e.jsx("p",{children:s("mission.solutions.neuro.desc")})]})]})}),e.jsx(a,{className:"text-center",children:e.jsxs("div",{className:"manifesto-cta",children:[e.jsxs("h3",{style:{marginBottom:"1rem"},children:[s("mission.cta_title_1")," ",e.jsx("span",{className:"accent-text",children:s("mission.cta_title_2")})]}),e.jsx("div",{style:{marginTop:"2rem"},children:e.jsx(w,{to:"/media",className:"page-bottom-link",children:s("home.explore_media")})})]})})]})}),e.jsxs("div",{className:"scene-strip","aria-hidden":"true",children:[e.jsx("img",{src:"/The-Sound-of-Essentials-Eco-System/assets/scenes/wildflower-path.webp",alt:"",className:"scene-strip__img",loading:"lazy"}),e.jsx("div",{className:"scene-strip__overlay"})]}),e.jsx(k,{}),e.jsx("style",{children:`
        .mission-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .mission-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .mission-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Stats ── */
        .manifesto-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .mission-stat {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .mission-stat__number {
          display: block;
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }

        .mission-stat__label {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* ── Biological Window ── */
        .bio-window {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .bio-window__content h2 {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          line-height: 1.3;
        }

        .bio-window__content p {
          color: var(--color-text-secondary);
          line-height: 1.8;
        }

        .neural-viz {
          position: relative;
          width: 280px;
          height: 280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .neural-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid;
          animation: softPulse 4s ease-in-out infinite;
        }

        .neural-circle--1 {
          width: 100%;
          height: 100%;
          border-color: var(--color-sage-glow);
          background: var(--color-sage-glow);
          animation-delay: 0s;
        }

        .neural-circle--2 {
          width: 70%;
          height: 70%;
          border-color: var(--color-plum-glow);
          background: var(--color-plum-glow);
          animation-delay: 1s;
        }

        .neural-circle--3 {
          width: 40%;
          height: 40%;
          border-color: var(--color-gold-glow);
          background: var(--color-gold-glow);
          animation-delay: 2s;
        }

        .neural-number {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-gold);
          position: relative;
          z-index: 1;
        }

        .neural-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 1;
        }

        /* ── Solution Grid ── */
        .solution-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin: 3rem 0;
        }

        .solution-card {
          padding: 2.5rem;
        }

        .solution-card__icon {
          font-size: 2.2rem;
          display: block;
          margin-bottom: 1rem;
        }

        .solution-card h3 {
          font-size: 1.2rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .solution-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        .manifesto-cta {
          margin-top: 3rem;
          padding: 3rem;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
        }

        @media (max-width: 968px) {
          .manifesto-stats {
            grid-template-columns: 1fr;
          }
          .bio-window {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .bio-window__content p {
            margin-left: auto;
            margin-right: auto;
          }
          .solution-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Mission Scene Mosaic ── */
        .mission-scene-mosaic {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 220px;
          gap: 0.75rem;
        }

        /* Make first scene span 2 cols for visual interest */
        .mission-scene:first-child {
          grid-column: span 2;
        }

        .mission-scene {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: default;
          opacity: 0;
          will-change: transform, opacity;
        }

        .mission-scene img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s var(--ease-gentle);
        }

        .mission-scene:hover img {
          transform: scale(1.07);
          animation: kenBurns 10s ease-in-out infinite alternate;
        }

        .mission-scene__label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem 1rem;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%);
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .mission-scene:hover .mission-scene__label {
          opacity: 1;
        }

        .mission-scene__land {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        .mission-scene__caption {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .mission-scene-mosaic { grid-template-columns: repeat(2, 1fr); }
          .mission-scene:first-child { grid-column: span 2; }
        }

        @media (max-width: 540px) {
          .mission-scene-mosaic { grid-template-columns: 1fr; grid-auto-rows: 180px; }
          .mission-scene:first-child { grid-column: span 1; }
          .mission-scene__label { opacity: 1; }
        }
      `})]})};export{E as default};
