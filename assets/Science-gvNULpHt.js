import{u as h,r as a,j as e,A as j,m as o,L as m}from"./index-CeGoSQr5.js";import{R as i}from"./useReveal-KE0qlIB9.js";const b=()=>{const{t:s}=h(),[c,x]=a.useState(""),[l,y]=a.useState([]),[r,f]=a.useState(!1),[d,p]=a.useState(null),t=a.useRef(null);a.useEffect(()=>{t.current&&(t.current.scrollTop=t.current.scrollHeight)},[l,r]);const g=async n=>{if(n.preventDefault(),!!c.trim()){p(s("assistant.error_key"));return}};return e.jsxs("div",{className:"research-assistant glass-card",children:[e.jsxs("div",{className:"assistant-header",children:[e.jsx("div",{className:"assistant-badge",children:s("assistant.badge")}),e.jsx("h3",{children:s("assistant.title")}),e.jsx("p",{children:s("assistant.subtitle")})]}),e.jsxs("div",{className:"chat-window",ref:t,children:[e.jsxs(j,{children:[l.length===0&&e.jsx(o.div,{initial:{opacity:0},animate:{opacity:1},className:"empty-state",children:e.jsx("p",{children:s("assistant.empty_state")})}),l.map((n,u)=>e.jsx(o.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`message-bubble ${n.role}`,children:e.jsx("div",{className:"bubble-content",children:n.content})},u)),r&&e.jsx(o.div,{className:"message-bubble assistant loading",initial:{opacity:0},animate:{opacity:1},children:e.jsxs("div",{className:"loading-dots",children:[e.jsx("span",{children:"."}),e.jsx("span",{children:"."}),e.jsx("span",{children:"."})]})})]}),d&&e.jsx("div",{className:"error-notice",children:d})]}),e.jsxs("form",{onSubmit:g,className:"chat-input-area",children:[e.jsx("input",{type:"text",value:c,onChange:n=>x(n.target.value),placeholder:s("assistant.placeholder"),disabled:r}),e.jsx("button",{type:"submit",className:"btn btn-plum",disabled:r||!c.trim(),children:r?"...":s("assistant.ask_btn")})]}),e.jsx("style",{children:`
                .research-assistant {
                    display: flex;
                    flex-direction: column;
                    height: 500px;
                    overflow: hidden;
                    border: 1px solid rgba(150, 120, 196, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                }

                .assistant-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    text-align: center;
                }

                .assistant-badge {
                    display: inline-block;
                    padding: 0.2rem 0.8rem;
                    background: linear-gradient(135deg, var(--color-purple), var(--color-plum));
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    border-radius: 100px;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .assistant-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--color-text-primary);
                }

                .assistant-header p {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin: 0.25rem 0 0 0;
                }

                .chat-window {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: rgba(0,0,0,0.02);
                }

                .empty-state {
                    margin: auto;
                    text-align: center;
                    color: var(--color-text-muted);
                    font-style: italic;
                    font-size: 0.9rem;
                    max-width: 250px;
                }

                .message-bubble {
                    max-width: 85%;
                    padding: 0.8rem 1.2rem;
                    border-radius: 1.2rem;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .message-bubble.user {
                    align-self: flex-end;
                    background: var(--color-plum);
                    color: white;
                    border-bottom-right-radius: 0.2rem;
                }

                .message-bubble.assistant {
                    align-self: flex-start;
                    background: rgba(255,255,255,0.1);
                    color: var(--color-text-primary);
                    border-bottom-left-radius: 0.2rem;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .chat-input-area {
                    padding: 1.2rem;
                    display: flex;
                    gap: 0.8rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .chat-input-area input {
                    flex: 1;
                    background: rgba(0,0,0,0.1);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.8rem;
                    padding: 0.8rem 1.2rem;
                    color: white;
                    font-family: inherit;
                }

                .chat-input-area input:focus {
                    outline: none;
                    border-color: var(--color-plum);
                }

                .error-notice {
                    font-size: 0.8rem;
                    color: #ff6b6b;
                    text-align: center;
                    padding: 0.5rem;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 0.5rem;
                }

                .loading-dots span {
                    display: inline-block;
                    animation: dash 1.4s infinite;
                    font-size: 1.5rem;
                    line-height: 0;
                }

                @keyframes dash {
                    0% { opacity: 0.2; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-5px); }
                    100% { opacity: 0.2; transform: translateY(0); }
                }

                .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
            `})]})},w=()=>{const{t:s}=h();return a.useEffect(()=>{document.title="Science of the Sound — SOE Rhythm Quest"},[]),e.jsxs("div",{className:"science-page",children:[e.jsx("header",{className:"science-hero",children:e.jsx("div",{className:"container text-center",children:e.jsxs("div",{className:"animate-fade-up",children:[e.jsx("div",{className:"section-label",children:"Pedagogy & Science"}),e.jsxs("h1",{children:["Science of the ",e.jsx("span",{className:"text-gold",children:"Sound"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto"},children:"Chronicles of the Clock: Understanding the neurological architecture behind every rhythm."})]})})}),e.jsx("section",{className:"section glow-sage",children:e.jsx("div",{className:"container",children:e.jsxs("div",{className:"grid-2 align-center",children:[e.jsx(i,{children:e.jsxs("div",{className:"lyrics-card glass-card",children:[e.jsx("span",{className:"section-label",style:{background:"var(--color-orange)"},children:"The Track"}),e.jsx("h2",{style:{marginBottom:"1.5rem"},children:"Do You Know What Time It Is?"}),e.jsxs("div",{className:"lyrics-content",style:{maxHeight:"400px",overflowY:"auto",paddingRight:"1rem"},children:[e.jsx("p",{children:"Do you know? Do you know? Do you know what time it is?"}),e.jsx("p",{children:"Is it 1:00, 2:00, 3:00, 4:00, 5:00, 6:00, 7:00, 8:00, 9:00, 10:00, 11:00, 12:00?"}),e.jsx("p",{children:"Do you know? Do you know? Do you know what time it is?"}),e.jsx("p",{children:"Is it 1:30, 2:30, 3:30, 4:30, 5:30, 6:30, 7:30, 8:30, 9:30, 10:30, 11:30, 12:30?"}),e.jsx("p",{children:"Do you know? Do you know? Do you know what time it is?"}),e.jsx("p",{children:"Is it in the morning when you just wake up?"}),e.jsx("p",{children:"Is it in the afternoon and you're eating some lunch?"}),e.jsx("p",{children:"Is it in the evening and you're getting ready for bed?"}),e.jsx("p",{children:"Do you know what time it is?"}),e.jsx("p",{children:"Is it 1:00? Is it 1:30?"}),e.jsx("p",{children:"Is it in the morning when you just wake up?"}),e.jsx("p",{children:"Is it in the afternoon and you're eating some lunch?"}),e.jsx("p",{children:"Is it in the evening and you're getting ready for bed?"}),e.jsx("p",{children:"Do you know? Do you know? Do you know what time it is?"})]}),e.jsx("div",{style:{marginTop:"2rem"},children:e.jsx(m,{to:"/media",className:"btn btn-outline",children:"Listen to the Tracks →"})})]})}),e.jsx(i,{delay:.2,children:e.jsxs("div",{className:"science-intro",children:[e.jsxs("h2",{className:"section-title",children:["Beyond the ",e.jsx("span",{className:"text-sage",children:"Melody"})]}),e.jsxs("p",{children:["It may seem just like lyrics to a catchy song, but dive deeper and you'll see a brilliantly disguised lesson in ",e.jsx("strong",{children:"Temporal Scaffolding and Numeracy"}),"."]}),e.jsxs("p",{style:{marginTop:"1rem"},children:["This track is a vital addition to ",e.jsx("em",{children:"Celestia: The Garden of Time"}),", where our heroes ",e.jsx("strong",{children:"Elias & Selene"})," guide children through abstract concepts using rhythmic sequencing and emotional anchors."]}),e.jsx("div",{style:{marginTop:"3rem"},children:e.jsx(b,{})})]})})]})})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(i,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:s("science.breakdown_label")}),e.jsxs("h2",{className:"section-title",children:[s("science.breakdown_title_1")," ",e.jsx("span",{className:"text-plum",children:s("science.breakdown_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 4rem auto"},children:s("science.breakdown_subtitle")})]}),e.jsxs("div",{className:"grid-3",children:[e.jsx(i,{delay:.1,children:e.jsxs("div",{className:"glass-card science-card",children:[e.jsx("div",{className:"science-card__icon",children:"🔢"}),e.jsx("h3",{children:s("science.cards.sequencing.title")}),e.jsx("p",{children:s("science.cards.sequencing.desc")})]})}),e.jsx(i,{delay:.2,children:e.jsxs("div",{className:"glass-card science-card",children:[e.jsx("div",{className:"science-card__icon",children:"⚓"}),e.jsx("h3",{children:s("science.cards.anchoring.title")}),e.jsx("p",{children:s("science.cards.anchoring.desc")})]})}),e.jsx(i,{delay:.3,children:e.jsxs("div",{className:"glass-card science-card",children:[e.jsx("div",{className:"science-card__icon",children:"🧠"}),e.jsx("h3",{children:s("science.cards.regulation.title")}),e.jsx("p",{children:s("science.cards.regulation.desc")})]})})]})]})}),e.jsx("section",{className:"section glow-plum",children:e.jsx("div",{className:"container",children:e.jsx(i,{children:e.jsx("div",{className:"implementation-block glass-card",children:e.jsxs("div",{className:"grid-2 align-center",children:[e.jsxs("div",{children:[e.jsx("div",{className:"section-label",style:{background:"var(--color-purple)"},children:s("science.implementation_label")}),e.jsxs("h2",{children:[s("science.implementation_title_1")," ",e.jsx("span",{className:"text-plum",children:s("science.implementation_title_2")})]}),e.jsx("p",{children:s("science.implementation_desc_1")}),e.jsx("p",{style:{marginTop:"1rem"},children:s("science.implementation_desc_2")})]}),e.jsx("div",{className:"science-image-wrap animate-float",children:e.jsx("div",{className:"science-image-placeholder",children:"⏰"})})]})})})})}),e.jsx("section",{className:"section text-center",children:e.jsx("div",{className:"container",children:e.jsxs(i,{children:[e.jsxs("h2",{children:[s("science.cta_title_1")," ",e.jsx("span",{className:"text-gold",children:s("science.cta_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{marginTop:"1rem"},children:s("science.cta_subtitle")}),e.jsx("div",{style:{marginTop:"3rem"},children:e.jsx(m,{to:"/media",className:"page-bottom-link",children:s("home.explore_media")})})]})})}),e.jsx("style",{children:`
                .science-page .reveal-block {
                    opacity: 0;
                    transform: translateY(25px);
                    transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
                }
                .science-page .reveal-block.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }

                .science-hero {
                    padding: 10rem 0 4rem;
                }

                .lyrics-card {
                    padding: 2.5rem;
                }

                .lyrics-content p {
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                    color: var(--color-text-primary);
                }

                .science-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .science-card__icon {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                .science-card h3 {
                    font-size: 1.3rem;
                    color: var(--color-text-primary);
                }

                .science-card p {
                    font-size: 0.95rem;
                    line-height: 1.7;
                }

                .implementation-block {
                    padding: 4rem;
                }

                .align-center {
                    align-items: center;
                }

                .science-image-wrap {
                    position: relative;
                    max-width: 400px;
                    margin: 0 auto;
                }

                .science-image {
                    width: 100%;
                    border-radius: var(--radius-lg);
                    border: 2px solid var(--color-border);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
                }

                .science-image-placeholder {
                    width: 100%;
                    min-height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 6rem;
                    background: rgba(0,0,0,0.03);
                    border-radius: var(--radius-lg);
                    border: 2px dashed var(--color-border);
                }

                @media (max-width: 768px) {
                    .implementation-block {
                        padding: 2rem;
                    }
                    .grid-2 {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                    }
                    .science-hero {
                        padding: 7rem 0 3rem;
                    }
                }
            `})]})};export{w as default};
