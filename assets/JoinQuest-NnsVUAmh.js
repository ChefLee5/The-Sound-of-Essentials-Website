import{u as _,r as n,j as e,L as N}from"./index-ckh4ne8-.js";import{R as t}from"./useReveal-4RVRn3f9.js";const y=()=>{const{t:a}=_();n.useEffect(()=>{document.title="Join the Quest — SOE Rhythm Quest"},[]);const[l,m]=n.useState({email:"",submitted:!1}),[c,h]=n.useState(!1),[x,u]=n.useState(""),[r,o]=n.useState({name:"",org:"",email:"",message:"",submitted:!1}),[i,j]=n.useState(!1),[p,g]=n.useState(""),f=async s=>{if(s.preventDefault(),u(""),!l.email.includes("@")){u(a("join.email_error"));return}h(!0),await new Promise(d=>setTimeout(d,1500)),h(!1),m({...l,submitted:!0})},b=async s=>{if(s.preventDefault(),g(""),!r.email.includes("@")){g(a("join.org_email_error"));return}j(!0),await new Promise(d=>setTimeout(d,2e3)),j(!1),o({...r,submitted:!0})};return e.jsxs("div",{className:"join-page",children:[e.jsx("header",{className:"join-hero",children:e.jsx("div",{className:"container text-center",children:e.jsxs("div",{className:"animate-fade-up",children:[e.jsx("div",{className:"section-label",children:a("join.hero_label")}),e.jsxs("h1",{children:[a("join.hero_title_1"),e.jsx("span",{className:"text-gold",children:a("join.hero_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto"},children:a("join.hero_subtitle")})]})})}),e.jsx("section",{className:"section glow-sage",children:e.jsx("div",{className:"container",children:e.jsx(t,{children:e.jsxs("div",{className:"newsletter-block glass-card",children:[e.jsxs("div",{className:"newsletter-block__content",children:[e.jsx("span",{className:"newsletter-block__icon",children:"📬"}),e.jsx("h2",{children:a("join.stay_connected")}),e.jsx("p",{children:a("join.newsletter_desc")})]}),l.submitted?e.jsxs("div",{className:"newsletter-success",children:[e.jsx("span",{style:{fontSize:"2rem"},children:"✨"}),e.jsx("h3",{className:"text-sage",children:a("join.welcome_quest")}),e.jsx("p",{children:a("join.welcome_desc")})]}):e.jsxs("form",{className:"newsletter-form",onSubmit:f,children:[e.jsxs("div",{className:"newsletter-form__row",children:[e.jsx("input",{type:"email",required:!0,disabled:c,placeholder:a("join.email_placeholder"),value:l.email,onChange:s=>m({...l,email:s.target.value}),className:"form-input","aria-label":"Email address for newsletter"}),e.jsx("button",{type:"submit",className:"btn btn-gold",disabled:c,children:c?e.jsx("span",{className:"btn-loader"}):a("join.subscribe")})]}),x&&e.jsx("p",{className:"form-error-msg animate-fade-in",children:x}),e.jsx("p",{className:"form-note",children:a("join.no_spam")})]})]})})})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(t,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:a("join.who_we_serve")}),e.jsxs("h2",{className:"section-title",children:[a("join.find_your_role_1"),e.jsx("span",{className:"text-sage",children:a("join.find_your_role_2")}),a("join.find_your_role_3")]})]}),e.jsxs("div",{className:"audience-grid",children:[e.jsx(t,{delay:0,children:e.jsxs("div",{className:"glass-card audience-card",children:[e.jsx("span",{className:"audience-card__icon",children:"👪"}),e.jsx("h3",{children:a("join.audience_1_title")}),e.jsx("p",{children:a("join.audience_1_desc")})]})}),e.jsx(t,{delay:.15,children:e.jsxs("div",{className:"glass-card audience-card",children:[e.jsx("span",{className:"audience-card__icon",children:"🏫"}),e.jsx("h3",{children:a("join.audience_2_title")}),e.jsx("p",{children:a("join.audience_2_desc")})]})}),e.jsx(t,{delay:.3,children:e.jsxs("div",{className:"glass-card audience-card",children:[e.jsx("span",{className:"audience-card__icon",children:"💼"}),e.jsx("h3",{children:a("join.audience_3_title")}),e.jsx("p",{children:a("join.audience_3_desc")})]})})]})]})}),e.jsx("section",{className:"section glow-plum",children:e.jsxs("div",{className:"container",children:[e.jsxs(t,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:a("join.partnerships_label")}),e.jsxs("h2",{className:"section-title",children:[a("join.build_together_1"),e.jsx("span",{className:"text-plum",children:a("join.build_together_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:a("join.partnerships_subtitle")})]}),e.jsx(t,{children:e.jsx("div",{className:"contact-form-card glass-card",children:r.submitted?e.jsxs("div",{className:"contact-success text-center",children:[e.jsx("span",{style:{fontSize:"3rem"},children:"🤝"}),e.jsx("h3",{className:"text-sage",style:{marginTop:"1rem"},children:a("join.message_received")}),e.jsx("p",{style:{margin:"1rem auto",maxWidth:"400px"},children:a("join.partnership_thank_you")})]}):e.jsxs("form",{className:"contact-form",onSubmit:b,children:[e.jsxs("div",{className:"form-grid",children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"contact-name",className:"form-label",children:a("join.label_name")}),e.jsx("input",{id:"contact-name",type:"text",required:!0,disabled:i,className:"form-input",placeholder:a("join.placeholder_name"),value:r.name,onChange:s=>o({...r,name:s.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"contact-org",className:"form-label",children:a("join.label_org")}),e.jsx("input",{id:"contact-org",type:"text",disabled:i,className:"form-input",placeholder:a("join.placeholder_org"),value:r.org,onChange:s=>o({...r,org:s.target.value})})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"contact-email",className:"form-label",children:a("join.label_email")}),e.jsx("input",{id:"contact-email",type:"email",required:!0,disabled:i,className:"form-input",placeholder:a("join.placeholder_email"),value:r.email,onChange:s=>o({...r,email:s.target.value})})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"contact-message",className:"form-label",children:a("join.label_partner")}),e.jsx("textarea",{id:"contact-message",required:!0,disabled:i,className:"form-input form-textarea",placeholder:a("join.placeholder_message"),rows:"5",value:r.message,onChange:s=>o({...r,message:s.target.value})})]}),p&&e.jsx("p",{className:"form-error-msg animate-fade-in",style:{marginBottom:"1rem"},children:p}),e.jsx("button",{type:"submit",className:"btn btn-gold",disabled:i,style:{width:"100%",marginTop:"0.5rem"},children:i?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"btn-loader"}),e.jsx("span",{style:{marginLeft:"0.8rem"},children:a("join.sending")})]}):a("join.send_btn")})]})})})]})}),e.jsx("section",{className:"section text-center",children:e.jsx("div",{className:"container",children:e.jsxs(t,{children:[e.jsxs("h2",{children:[a("join.mission_title_1"),e.jsx("span",{className:"text-gold",children:a("join.mission_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{marginTop:"1rem"},children:a("join.mission_subtitle")}),e.jsx("div",{style:{marginTop:"3rem"},children:e.jsx(N,{to:"/media",className:"page-bottom-link",children:a("join.explore_media")})})]})})}),e.jsx("style",{children:`
        .join-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .join-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .join-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Newsletter ── */
        .newsletter-block {
          max-width: 700px;
          margin: 0 auto;
          padding: 3rem;
          text-align: center;
        }

        .newsletter-block__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .newsletter-block h2 {
          margin-bottom: 0.5rem;
        }

        .newsletter-block p {
          color: var(--color-text-secondary);
          margin: 0 auto;
          max-width: 500px;
          margin-bottom: 2rem;
        }

        .newsletter-form__row {
          display: flex;
          gap: 0.8rem;
          max-width: 480px;
          margin: 0 auto;
        }

        .newsletter-form__row .form-input {
          flex: 1;
        }

        .newsletter-success {
          padding: 2rem;
        }

        .newsletter-success h3 {
          margin: 0.5rem 0;
        }

        .newsletter-success p {
          color: var(--color-text-secondary);
          margin: 0 auto;
        }

        .form-note {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.8rem;
          text-align: center;
        }

        /* ── Audience Cards ── */
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .audience-card {
          text-align: center;
          padding: 2.5rem 2rem;
        }

        .audience-card__icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .audience-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.8rem;
          color: var(--color-text-primary);
        }

        .audience-card p {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          max-width: 100%;
        }

        /* ── Contact Form ── */
        .contact-form-card {
          max-width: 650px;
          margin: 0 auto;
          padding: 3rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-label {
          display: block;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-primary);
          margin-bottom: 0.4rem;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-sm);
          background: #f8f9fa;
          color: var(--color-text-primary);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color var(--transition-med);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-sage);
          box-shadow: 0 0 0 3px var(--color-sage-glow);
        }

        .form-input::placeholder {
          color: var(--color-text-muted);
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-success {
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .audience-grid {
            grid-template-columns: 1fr;
          }
          .newsletter-form__row {
            flex-direction: column;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Loading & Errors ── */
        .btn-loader {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-error-msg {
          color: #e53935;
          font-size: 0.8rem;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `})]})};export{y as default};
