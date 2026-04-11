import{r as d,j as e,u as L,L as F,m as z,A as D}from"./index-CeGoSQr5.js";import{R as b}from"./useReveal-KE0qlIB9.js";import{u as M}from"./useAnimeReveal-Cfs0Rjts.js";const B=({analyser:a,isPlaying:s,color:n="#FF6B6B"})=>{const i=d.useRef(null),t=d.useRef(null);d.useEffect(()=>(s&&a?c():t.current&&cancelAnimationFrame(t.current),()=>{t.current&&cancelAnimationFrame(t.current)}),[s,a]);const c=()=>{const m=i.current;if(!m||!a)return;const x=m.getContext("2d"),g=a.frequencyBinCount,w=new Uint8Array(g),f=()=>{t.current=requestAnimationFrame(f),a.getByteFrequencyData(w);const j=m.width,v=m.height;x.clearRect(0,0,j,v);const N=j/g*1.5;let u,y=0;for(let k=0;k<g;k++){u=w[k]/255*v,x.fillStyle=n;const h=3,S=y,A=v-u;u>2&&(x.beginPath(),x.roundRect(S,A,N-2,u,h),x.fill()),y+=N}};f()};return e.jsx("canvas",{ref:i,className:"audio-visualizer",width:120,height:40,style:{width:"120px",height:"40px",opacity:s?.8:.3,transition:"opacity 0.3s ease"}})},O="/The-Sound-of-Essentials-Eco-System/".replace(/\/$/,""),r=a=>`${O}${a.startsWith("/")?a:"/"+a}`,C=["/assets/coloring-book/Coloring book cover.png","/assets/coloring-book/Coloring page 1.png","/assets/coloring-book/Coloring page 2.png","/assets/coloring-book/Coloring page 3.png","/assets/coloring-book/Coloring page 4.png","/assets/coloring-book/Coloring page 5.png","/assets/coloring-book/Coloring page 6.png","/assets/coloring-book/Coloring page 7.png"].map(r),I=Array.from({length:14},(a,s)=>r(`/assets/pages/page-${String(s+1).padStart(2,"0")}.webp`)),P=Array.from({length:11},(a,s)=>r(`/assets/media/shot-${String(s+1).padStart(2,"0")}.webp`)),W=({shots:a})=>{const[s,n]=d.useState(null),i=M({selector:".gallery-shot",staggerMs:60,translateY:[20,0],scale:[.95,1]});return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"gallery-grid",ref:i,children:a.map((t,c)=>e.jsxs("button",{className:"gallery-shot",onClick:()=>n(c),"aria-label":`View photo ${c+1}`,children:[e.jsx("img",{src:t,alt:`SOE scene ${c+1}`,loading:"lazy"}),e.jsx("div",{className:"gallery-shot__overlay",children:e.jsx("span",{className:"gallery-shot__zoom",children:"⊕"})})]},c))}),s!==null&&e.jsxs("div",{className:"gallery-lightbox",onClick:()=>n(null),role:"dialog","aria-modal":"true",children:[e.jsx("button",{className:"gallery-lightbox__close",onClick:()=>n(null),"aria-label":"Close",children:"✕"}),e.jsx("button",{className:"gallery-lightbox__nav gallery-lightbox__nav--prev",onClick:t=>{t.stopPropagation(),n((s-1+a.length)%a.length)},"aria-label":"Previous",children:"‹"}),e.jsx("img",{src:a[s],alt:`SOE scene ${s+1}`,className:"gallery-lightbox__img",onClick:t=>t.stopPropagation()}),e.jsx("button",{className:"gallery-lightbox__nav gallery-lightbox__nav--next",onClick:t=>{t.stopPropagation(),n((s+1)%a.length)},"aria-label":"Next",children:"›"}),e.jsxs("span",{className:"gallery-lightbox__counter",children:[s+1," / ",a.length]})]})]})},H=({tracks:a,currentTrack:s,onSelect:n})=>e.jsx("div",{className:"album-carousel",children:e.jsx("div",{className:"album-carousel__track",children:a.map((i,t)=>{const c=t-s,m=t===s;return e.jsxs(z.div,{className:`album-slide ${m?"active":""}`,initial:!1,animate:{x:c*140,scale:m?1.15:.8,opacity:Math.abs(c)>2?0:1-Math.abs(c)*.4,zIndex:m?10:5-Math.abs(c),filter:m?"none":"grayscale(0.6) blur(2px)"},transition:{type:"spring",stiffness:260,damping:20},onClick:()=>n(t),children:[i.cover?e.jsx("img",{src:i.cover,alt:i.title,className:"album-cover",style:{objectFit:"cover"}}):e.jsx("div",{className:"album-cover album-cover--placeholder",style:{background:`${i.color}22`,borderColor:`${i.color}44`},"aria-hidden":"true",children:e.jsx("span",{style:{fontSize:"2.5rem"},children:i.domainIcon})}),e.jsx(D,{children:m&&e.jsx(z.div,{className:"album-label",initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:10},children:e.jsx("span",{className:"album-label__title",children:i.title})})})]},i.id)})})}),$=({tracks:a})=>{const{t:s}=L(),[n,i]=d.useState(0),[t,c]=d.useState(!1),[m,x]=d.useState(0),[g,w]=d.useState(0),[f,j]=d.useState(!1),[v,N]=d.useState(null),u=d.useRef(null),y=d.useRef(null),k=()=>{if(!y.current)try{const o=window.AudioContext||window.webkitAudioContext,l=new o,p=l.createAnalyser();p.fftSize=64,l.createMediaElementSource(u.current).connect(p),p.connect(l.destination),y.current=l,N(p)}catch(o){console.error("AudioPlayer: Failed to init audio graph",o)}},h=a[n];d.useEffect(()=>{const o=u.current;if(!o)return;const l=()=>{x(o.currentTime)},p=()=>{w(o.duration)},_=()=>{c(!1),n<a.length-1&&i(n+1)};return o.addEventListener("timeupdate",l),o.addEventListener("loadedmetadata",p),o.addEventListener("ended",_),()=>{o.removeEventListener("timeupdate",l),o.removeEventListener("loadedmetadata",p),o.removeEventListener("ended",_)}},[n,a.length]),d.useEffect(()=>{const o=u.current;o&&(o.load(),t&&o.play().catch(()=>{}))},[n]);const S=()=>{k(),y.current?.state==="suspended"&&y.current.resume();const o=u.current;t?o.pause():o.play().catch(()=>{}),c(!t)},A=o=>{const l=o.currentTarget.getBoundingClientRect(),_=(o.clientX-l.left)/l.width,R=u.current;R.currentTime=_*g,x(_*g)},T=o=>{if(k(),y.current?.state==="suspended"&&y.current.resume(),o===n&&t){S();return}i(o),c(!0)},E=o=>{if(!o||isNaN(o))return"0:00";const l=Math.floor(o/60),p=Math.floor(o%60);return`${l}:${p.toString().padStart(2,"0")}`};return e.jsxs("div",{className:"audio-player glass-card",children:[e.jsx("audio",{ref:u,src:h.src,preload:"metadata"}),e.jsx(H,{tracks:a,currentTrack:n,onSelect:T}),e.jsxs("div",{className:"audio-player__now",children:[e.jsx("div",{className:"audio-player__icon-wrap",style:{background:`${h.color}22`,borderColor:`${h.color}44`},children:e.jsx("span",{className:"audio-player__domain-icon",children:h.domainIcon})}),e.jsxs("div",{className:"audio-player__info",children:[e.jsx("h4",{className:"audio-player__title",style:{color:h.color},children:h.title}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[e.jsx("span",{className:"audio-player__domain",children:h.domain}),e.jsx(B,{analyser:v,isPlaying:t,color:h.color})]})]})]}),e.jsxs("div",{className:"audio-player__controls",children:[e.jsx("button",{className:"audio-player__play-btn",onClick:S,"aria-label":t?"Pause":"Play",children:t?e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:[e.jsx("rect",{x:"6",y:"4",width:"4",height:"16",rx:"1"}),e.jsx("rect",{x:"14",y:"4",width:"4",height:"16",rx:"1"})]}):e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("polygon",{points:"5,3 19,12 5,21"})})}),e.jsx("div",{className:"audio-player__progress-wrap",onClick:A,role:"slider","aria-label":"Track progress","aria-valuenow":m,"aria-valuemax":g,children:e.jsx("div",{className:"audio-player__progress-bar",children:e.jsx("div",{className:"audio-player__progress-fill",style:{width:`${g?m/g*100:0}%`,background:h.color}})})}),e.jsxs("span",{className:"audio-player__time",children:[E(m)," / ",E(g)]}),h.lyrics&&e.jsx("button",{className:`audio-player__lyrics-btn ${f?"active":""}`,onClick:()=>j(!f),"aria-label":"Toggle lyrics",children:s("media.lyrics_btn")})]}),f&&h.lyrics&&e.jsx("div",{className:"audio-player__lyrics animate-fade-in",children:e.jsx("div",{className:"audio-player__lyrics-content",children:h.lyrics.split(`
`).map((o,l)=>e.jsx("p",{className:o.startsWith("(")?"lyrics-label":"",children:o},l))})}),e.jsx("div",{className:"audio-player__tracks",children:a.map((o,l)=>e.jsxs("button",{className:`audio-player__track ${l===n?"audio-player__track--active":""}`,onClick:()=>T(l),"aria-label":`Play ${o.title}`,children:[e.jsx("span",{className:"audio-player__track-icon",style:{color:o.color},children:o.domainIcon}),e.jsxs("div",{className:"audio-player__track-info",children:[e.jsx("span",{className:"audio-player__track-title",children:o.title}),e.jsx("span",{className:"audio-player__track-domain",children:o.domain})]}),l===n&&t&&e.jsx(B,{analyser:v,isPlaying:t,color:o.color})]},o.id))})]})},J=()=>{const{t:a}=L();d.useEffect(()=>{document.title="Media Room — SOE Rhythm Quest"},[]);const[s,n]=d.useState(0),[i,t]=d.useState(0),c=[{id:1,title:a("media.tracks.1.title"),domain:a("media.tracks.1.domain"),domainIcon:"☀️",desc:a("media.tracks.1.desc"),src:r("/audio/01. Sunny Day (intro).mp3"),color:"#FF6F00",lyrics:null,cover:r("/assets/soe-logo.jpg")},{id:2,title:a("media.tracks.2.title"),domain:a("media.tracks.2.domain"),domainIcon:"📅",desc:a("media.tracks.2.desc"),src:r("/audio/02. Days of the Week.mp3"),color:"#1E88E5",cover:r("/assets/characters/ELIAS.png"),lyrics:`(Verse)
Seven days of a week I'll sing my song.
Creation speaks to me all day long.
How I enjoy looking at those big white fluffy clouds.
In the daytime at night, I always look forward
to the bright stars sparkling in the sky.

(Chorus)
Sunday, Monday, Tuesday, Wednesday,
Thursday, Friday, Saturday.
Sunday, Monday, Tuesday, Wednesday,
Thursday, Friday, Saturday.`},{id:3,title:a("media.tracks.3.title"),domain:a("media.tracks.3.domain"),domainIcon:"🗣️",desc:a("media.tracks.3.desc"),src:r("/audio/03. Alphabet Song Remix.mp3"),color:"#FF6F00",cover:r("/assets/characters/KENJI.png"),lyrics:`(Verse)
A B C D E F G H I J K L M N O P
Q R S T U V W X Y and Z.
Now I know my ABC.
Next time, won't you sing with me?

(Remix / Breakdown)
Now I know my ABCs remix.
A A A B B B... C C C... D...
E E F F... G G... H H I I I...
J J... K K K... L L M M...
N O O O... P P P... Q...
R S S T T T... U V W X Y Z`},{id:4,title:a("media.tracks.4.title"),domain:a("media.tracks.4.domain"),domainIcon:"🎨",desc:a("media.tracks.4.desc"),src:r("/audio/04. Horses Interlude.mp3"),color:"#9C27B0",cover:r("/assets/track-art/Donkey.jpg"),lyrics:`(Spoken / Dialogue)
Horses. Horses.
That's not a horse. That's a donkey.
Horses. Horses.
Wait a minute. That's not a horse. That's a pig.
Horses. Horses.
Guys, did someone let the dogs out? That's a sheep.
That's not a horse.

Oh, can someone please get that cat out of here?
We're looking for a horse.
An elephant is certainly not a horse.
Love those chickens, but I still need a horse.
Monkeys. We need a horse.
Horses. Now that's a horse.`},{id:5,title:a("media.tracks.5.title"),domain:a("media.tracks.5.domain"),domainIcon:"🇫🇷",desc:a("media.tracks.5.desc"),src:r("/audio/05. Le Cheval.mp3"),color:"#1E88E5",cover:r("/assets/characters/RONAN.png"),lyrics:`(Verse — Sung in French)
Deux accrets le cheval, fort et puissant
Deux accrets le cheval, fort et puissant
Deux accrets le cheval, fort et puissant

Oh, I can almost see the horses now grazing,
Eating up grass and apples, which they love so much.
The horse has strength and power,
able to see almost all the way around its body.
Afraid of nothing in the time of war,
The horse walks, trots, canter, and gallops.
What an amazing creation.`},{id:6,title:a("media.tracks.6.title"),domain:a("media.tracks.6.domain"),domainIcon:"🤸",desc:a("media.tracks.6.desc"),src:r("/audio/06. Lets Stretch.mp3"),color:"#4CAF50",cover:r("/assets/track-art/Touch your toes.png"),lyrics:"(Breathing Exercise)\\nBreathe in through your nose.\\nBreathe out through your mouth.\\n(Repeat)\\n\\n(Stretching Movements)\\nLet's stretch.\\nBring your arms up. Reach to the sky.\\nStretch real high.\\nBring your arms down.\\nDon't bend your knees.\\nTouch your toes.\\n(Repeat)"},{id:7,title:a("media.tracks.7.title"),domain:a("media.tracks.7.domain"),domainIcon:"💪",desc:a("media.tracks.7.desc"),src:r("/audio/07. Drill Time.mp3"),color:"#4CAF50",cover:r("/assets/track-art/Drums.jpg"),lyrics:"(Intro)\\nOn your mark, get set, ready, go.\\nStay on the path. Always learning.\\n\\n(The March)\\nForward march.\\nLeft, left, left, right, left.\\nLeft, left, left, right, left.\\n\\n(Chant)\\nAll I know is all I know.\\nWisdom is more precious than gold.\\nSound off! 1, 2, 3, 4.\\n\\n(The Shake)\\nWe're so excited about learning, we want to shake. Woohoo!\\nShake, shake, shake your left arm.\\nShake, shake, shake your right arm.\\nShake, shake, shake your left leg.\\nShake, shake, shake your right leg.\\n\\n(Outro)\\nChildren, please remember\\nalways stay on the right path and keep on learning."},{id:8,title:a("media.tracks.8.title"),domain:a("media.tracks.8.domain"),domainIcon:"🔢",desc:a("media.tracks.8.desc"),src:r("/audio/08. Numbers.mp3"),color:"#FF6F00",cover:r("/assets/characters/KWAME.png"),lyrics:"(Intro)\\nI like the numbers.\\nIt is so much fun to count.\\n\\n(Call and Response)\\nNow let's count to 10 while we clap.\\nOne clap. Follow me. One.\\nTwo claps. Follow me. One. Two.\\nThree claps. Follow me. One. Two. Three.\\n...\\nTen claps. Follow me.\\n1 2 3 4 5 6 7 8 9 10.\\n\\n(Outro)\\nHooray. You did it.\\nGive yourself a great big hand clap."},{id:9,title:a("media.tracks.9.title"),domain:a("media.tracks.9.domain"),domainIcon:"🔬",desc:a("media.tracks.9.desc"),src:r("/audio/09. My Body.mp3"),color:"#9C27B0",cover:r("/assets/characters/ATHENA.png"),lyrics:"(Verse 1: Face)\\nWhat's on your face?\\nEyes, nose, mouth, chin.\\nDon't forget about your forehead, cheeks, and two ears.\\n\\n(Verse 2: Upper Body)\\nMy body is strong.\\nNeck, shoulders, back, arms.\\nDon't forget about your hands and tip fingers.\\n\\n(Verse 3: Lower Body)\\nMy body is strong.\\nHip, thighs, knees, legs.\\nDon't forget about your ankles, feet, and ten toes.\\n\\n(Bridge)\\nWe are going to keep our body strong\\nby eating right and staying healthy.\\nConsuming living foods, stretching,\\nand keeping our hearts right."},{id:10,title:a("media.tracks.10.title"),domain:a("media.tracks.10.domain"),domainIcon:"🤝",desc:a("media.tracks.10.desc"),src:r("/audio/10. Manners.mp3"),color:"#1E88E5",cover:r("/assets/characters/AIKO.png"),lyrics:"(Verse)\\nWhen you receive, say Thank You.\\nThen I'll say You're Welcome.\\nYes, Please.\\nExcuse Me.\\nNo, Thank You.\\nI'm Sorry."},{id:11,title:a("media.tracks.11.title"),domain:a("media.tracks.11.domain"),domainIcon:"⏰",desc:a("media.tracks.11.desc"),src:r("/audio/11. Time.mp3"),color:"#FF6F00",cover:r("/assets/characters/SELENE.png"),lyrics:"Do you know? Do you know? Do you know what time it is?\\nIs it 1:00, 2:00, 3:00, 4:00, 5:00, 6:00, 7:00, 8:00, 9:00, 10:00, 11:00, 12:00?\\nDo you know? Do you know? Do you know what time it is?\\nIs it 1:30, 2:30, 3:30, 4:30, 5:30, 6:30, 7:30, 8:30, 9:30, 10:30, 11:30, 12:30?\\nDo you know? Do you know? Do you know what time it is?\\nIs it in the morning when you just wake up?\\nIs it in the afternoon and you're eating some lunch?\\nIs it in the evening and you're getting ready for bed?\\nDo you know what time it is?\\nIs it 1:00? Is it 1:30?\\nIs it in the morning when you just wake up?\\nIs it in the afternoon and you're eating some lunch?\\nIs it in the evening and you're getting ready for bed?\\nDo you know? Do you know? Do you know what time it is?"},{id:12,title:a("media.tracks.12.title"),domain:a("media.tracks.12.domain"),domainIcon:"🦋",desc:a("media.tracks.12.desc"),src:r("/audio/12. Changes.mp3"),color:"#4CAF50",cover:r("/assets/characters/NERISSA.png"),lyrics:"(Verse)\\nIt's sunny outside. Yesterday it rained.\\nOh! Somewhere it might snow tomorrow.\\nThat's the weather, it changes.\\nBut not love from above.\\nTrue love is unchanging, always the same.\\nYesteray, today, and forever."},{id:13,title:a("media.tracks.13.title"),domain:a("media.tracks.13.domain"),domainIcon:"💯",desc:a("media.tracks.13.desc"),src:r("/audio/13. One hundred.mp3"),color:"#9C27B0",cover:r("/assets/characters/OCTAVIA.png"),lyrics:null},{id:14,title:a("media.tracks.14.title"),domain:a("media.tracks.14.domain"),domainIcon:"🌊",desc:a("media.tracks.14.desc"),src:r("/audio/14. The Ocean.mp3"),color:"#1E88E5",cover:r("/assets/track-art/Wave.jpg"),lyrics:null},{id:15,title:a("media.tracks.15.title"),domain:a("media.tracks.15.domain"),domainIcon:"📖",desc:a("media.tracks.15.desc"),src:r("/audio/15. Hard Words.mp3"),color:"#FF6F00",cover:r("/assets/characters/RONAN.png"),lyrics:"(Intro)\\nSometimes you may hear a word that's hard to say,\\nbut don't worry. Slow down and say...\\n\\n(Word Drill)\\nBalloon. Hawaii. Oklahoma.\\nLouisiana. Octopus. Vegetables.\\nSpaghetti. Macaroni.\\nAlaska. Nevada. Colorado."},{id:16,title:a("media.tracks.16.title"),domain:a("media.tracks.16.domain"),domainIcon:"🔷",desc:a("media.tracks.16.desc"),src:r("/audio/16. Shapes.mp3"),color:"#4CAF50",cover:r("/assets/characters/SILAS.png"),lyrics:"(Chorus)\\nI see shapes all around me.\\nDo you see shapes all around you?\\n\\n(Verse)\\nThere goes a Circle.\\nThat's a Square. (Yes, four equal sides).\\nTriangle. Stars. Rectangle.\\nTrapezoids. Pentagons. Hexagon.\\nHeptagon. Octagon. Cube. Spheres."},{id:17,title:a("media.tracks.17.title"),domain:a("media.tracks.17.domain"),domainIcon:"🗓️",desc:a("media.tracks.17.desc"),src:r("/audio/17. Months of the Year.mp3"),color:"#9C27B0",cover:r("/assets/characters/ELIAS.png"),lyrics:"(Intro)\\nTime. Seconds, minutes, hours, days, weeks, months.\\nIt's time for the months of the year song.\\n\\n(Chorus)\\nJanuary, February, March,\\nApril, May, June,\\nJuly, August, September,\\nOctober, November, December."},{id:18,title:a("media.tracks.18.title"),domain:a("media.tracks.18.domain"),domainIcon:"🌧️",desc:a("media.tracks.18.desc"),src:r("/audio/18. Rain.mp3"),color:"#1E88E5",cover:r("/assets/characters/ATHENA.png"),lyrics:"(Chant)\\nWatching raindrops falling down,\\ncleaning the atmosphere.\\nWatching raindrops falling down,\\ncleaning the atmosphere."},{id:19,title:a("media.tracks.19.title"),domain:a("media.tracks.19.domain"),domainIcon:"🌈",desc:a("media.tracks.19.desc"),src:r("/audio/20. After the Storm (outro).mp3"),color:"#4CAF50",cover:r("/assets/soe-logo.jpg"),lyrics:null}];return e.jsxs("div",{className:"media-page",children:[e.jsx("header",{className:"media-hero",children:e.jsx("div",{className:"container text-center",children:e.jsxs("div",{className:"animate-fade-up",children:[e.jsx("div",{className:"section-label",children:a("media.hero_label")}),e.jsxs("h1",{children:[a("media.hero_title_1")," ",e.jsx("span",{className:"text-gold",children:a("media.hero_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"1rem auto"},children:a("media.hero_subtitle")})]})})}),e.jsx("section",{className:"section glow-sage",children:e.jsxs("div",{className:"container",children:[e.jsxs(b,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:a("media.audio_label")}),e.jsxs("h2",{className:"section-title",children:[a("media.audio_title_1")," ",e.jsx("span",{className:"text-sage",children:a("media.audio_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:a("media.audio_subtitle")})]}),e.jsx(b,{children:e.jsx($,{tracks:c})})]})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(b,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:"🎬 Music Video"}),e.jsxs("h2",{className:"section-title",children:["Le ",e.jsx("span",{className:"text-gold",children:"Cheval"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:"A bilingual musical journey celebrating the majesty of the horse — sung in French and English."})]}),e.jsx(b,{children:e.jsxs("div",{className:"video-feature glass-card",children:[e.jsx("video",{className:"video-feature__player",src:r("/videos/Le Cheval Video.mp4"),poster:r("/assets/characters/RONAN.png"),controls:!0,preload:"metadata",playsInline:!0,"aria-label":"Le Cheval music video"}),e.jsxs("div",{className:"video-feature__meta",children:[e.jsx("span",{className:"video-feature__badge",style:{background:"#1E88E5"},children:"🇫🇷 Bilingual"}),e.jsx("h3",{className:"video-feature__title",children:"Le Cheval — Track 5"}),e.jsx("p",{className:"video-feature__desc",children:"Ronan & Nerissa guide learners through the world of horses with rich French vocabulary, movement, and cross-cultural storytelling from the land of Lexiconia."})]})]})})]})}),e.jsx("section",{className:"section glow-plum",children:e.jsxs("div",{className:"container",children:[e.jsxs(b,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:a("media.coloring_label")}),e.jsxs("h2",{className:"section-title",children:[a("media.coloring_title_1")," ",e.jsx("span",{className:"text-plum",children:a("media.coloring_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:a("media.coloring_subtitle")})]}),e.jsx(b,{children:e.jsxs("div",{className:"book-viewer glass-card",children:[e.jsx("div",{className:"book-viewer__display",children:e.jsx("img",{src:C[s],alt:`Coloring book page ${s+1}`,className:"book-viewer__page",style:{width:"100%",display:"block",borderRadius:"var(--radius-md)"}})}),e.jsxs("div",{className:"book-viewer__controls",children:[e.jsx("button",{className:"btn btn-outline",onClick:()=>n(Math.max(0,s-1)),disabled:s===0,"aria-label":"Previous page",children:a("media.prev")}),e.jsxs("span",{className:"book-viewer__counter",children:[s+1," / ",C.length]}),e.jsx("button",{className:"btn btn-outline",onClick:()=>n(Math.min(C.length-1,s+1)),disabled:s===C.length-1,"aria-label":"Next page",children:a("media.next")})]}),e.jsx("div",{className:"text-center",style:{marginTop:"1.5rem"},children:e.jsx(F,{to:"/join",className:"btn btn-gold",children:a("media.pre_order_coloring")})})]})})]})}),e.jsx("section",{className:"section",children:e.jsxs("div",{className:"container",children:[e.jsxs(b,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:a("media.read_label")}),e.jsxs("h2",{className:"section-title",children:[a("media.read_title_1")," ",e.jsx("span",{className:"text-gold",children:a("media.read_title_2")})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2rem auto"},children:a("media.read_subtitle")})]}),e.jsx(b,{children:e.jsxs("div",{className:"book-viewer glass-card",children:[e.jsx("div",{className:"book-viewer__display",children:e.jsx("img",{src:I[i],alt:`SOE Storybook page ${i+1}`,className:"book-viewer__page",style:{width:"100%",display:"block",borderRadius:"var(--radius-md)"}})}),e.jsxs("div",{className:"book-viewer__controls",children:[e.jsx("button",{className:"btn btn-outline",onClick:()=>t(Math.max(0,i-1)),disabled:i===0,"aria-label":"Previous page",children:a("media.prev")}),e.jsxs("span",{className:"book-viewer__counter",children:[i+1," / ",I.length]}),e.jsx("button",{className:"btn btn-outline",onClick:()=>t(Math.min(I.length-1,i+1)),disabled:i===I.length-1,"aria-label":"Next page",children:a("media.next")})]}),e.jsx("div",{className:"text-center",style:{marginTop:"1.5rem"},children:e.jsx(F,{to:"/join",className:"btn btn-gold",children:a("media.pre_order_book")})})]})})]})}),e.jsx("section",{className:"section glow-sage",children:e.jsxs("div",{className:"container",children:[e.jsxs(b,{className:"text-center",children:[e.jsx("div",{className:"section-label",children:"📸 Behind the Quest"}),e.jsxs("h2",{className:"section-title",children:["A World ",e.jsx("span",{className:"text-sage",children:"Brought to Life"})]}),e.jsx("p",{className:"section-subtitle",style:{margin:"0 auto 2.5rem auto"},children:"Glimpses from the world of SOE — characters, scenes, and moments from the Seven Lands."})]}),e.jsx(W,{shots:P})]})}),e.jsx("style",{children:`
        .media-page .reveal-block {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.8s var(--ease-gentle), transform 0.8s var(--ease-gentle);
        }
        .media-page .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .media-hero {
          padding: 10rem 0 4rem;
        }

        /* ── Video ── */
        .video-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .video-embed {
          padding: 0;
          overflow: hidden;
        }

        .video-embed__title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-text-primary);
          padding: 1rem 1.25rem 0.75rem;
          margin: 0;
        }

        .music-videos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .video-embed__badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          margin: 0 1.25rem 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .video-embed__player {
          width: 100%;
          display: block;
          border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        }

        .video-overlay-text {
          position: absolute;
          bottom: 1.5rem;
          right: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
          z-index: 10;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .music-videos-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Audio Player ── */
        .audio-player {
          max-width: 700px;
          margin: 0 auto;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Album Carousel ── */
        .album-carousel {
          position: relative;
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.5rem;
          background: rgba(0,0,0,0.03);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .album-carousel__track {
          position: relative;
          width: 180px;
          height: 180px;
        }

        .album-slide {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          border: 2px solid rgba(255,255,255,0.1);
          background: #eee;
        }

        .album-slide.active {
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          border-color: rgba(255,255,255,0.5);
        }

        .album-cover {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .album-cover--placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
        }

        .album-label {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          color: white;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.15);
          pointer-events: none;
          z-index: 20;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        @media (max-width: 480px) {
          .audio-player {
            padding: 1.25rem;
          }
        }

        .audio-player__now {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .audio-player__icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          border: 1px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .audio-player__domain-icon {
          font-size: 1.5rem;
        }

        .audio-player__title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          margin-bottom: 0.2rem;
        }

        .audio-player__domain {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .audio-player__controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .audio-player__controls {
            gap: 0.75rem;
          }
        }

        .audio-player__play-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: var(--color-sage);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all var(--transition-med);
        }

        .audio-player__play-btn:hover {
          background: var(--color-sage-light);
          transform: scale(1.05);
        }

        .audio-player__progress-wrap {
          flex: 1;
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .audio-player__progress-bar {
          height: 4px;
          background: var(--color-border-light);
          border-radius: 2px;
          overflow: hidden;
        }

        .audio-player__progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        @media (max-width: 480px) {
          .audio-player__progress-wrap {
             padding: 1rem 0; /* Larger touch area */
          }
        }

        .audio-player__time {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-family: var(--font-body);
          white-space: nowrap;
        }

        .audio-player__lyrics-btn {
          font-size: 0.7rem;
          color: var(--color-sage);
          background: var(--color-sage-soft);
          border: 1px solid var(--color-sage);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-med);
          margin-left: auto;
          font-family: var(--font-body);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .audio-player__lyrics-btn:hover {
          background: var(--color-sage);
          color: #fff;
        }

        .audio-player__lyrics-btn.active {
          background: var(--color-sage);
          color: #fff;
          box-shadow: 0 0 10px var(--color-sage-glow);
        }

        .audio-player__lyrics {
          margin-top: 0;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid var(--color-border-light);
          scrollbar-width: thin;
          scrollbar-color: var(--color-sage) transparent;
        }

        .audio-player__lyrics::-webkit-scrollbar {
          width: 6px;
        }

        .audio-player__lyrics::-webkit-scrollbar-thumb {
          background-color: var(--color-sage);
          border-radius: 3px;
        }

        .audio-player__lyrics-content {
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-primary);
          text-align: center;
        }

        .audio-player__lyrics-content p {
          margin-bottom: 0.6rem;
        }

        .audio-player__lyrics-content .lyrics-label {
          font-weight: 600;
          color: var(--color-gold);
          margin-top: 1rem;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }

        .audio-player__tracks {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }

        .audio-player__track {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem 1rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background var(--transition-med);
          text-align: left;
          color: var(--color-text-primary);
        }

        .audio-player__track:hover {
          background: var(--color-bg-card-hover);
        }

        .audio-player__track--active {
          background: var(--color-bg-card-hover);
        }

        .audio-player__track-icon {
          font-size: 1.2rem;
        }

        .audio-player__track-info {
          flex: 1;
        }

        .audio-player__track-title {
          display: block;
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .audio-player__track-domain {
          display: block;
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }



        /* ── Le Cheval Video Feature ── */
        .video-feature {
          max-width: 900px;
          margin: 0 auto;
          padding: 0;
          overflow: hidden;
        }

        .video-feature__player {
          width: 100%;
          display: block;
          max-height: 520px;
          object-fit: cover;
          background: #000;
        }

        .video-feature__meta {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .video-feature__badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          width: fit-content;
        }

        .video-feature__title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 0;
        }

        .video-feature__desc {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin: 0;
          max-width: 680px;
        }

        /* ── Book Viewer ── */
        .book-viewer {
          max-width: 750px;
          margin: 0 auto;
          padding: 2rem;
        }

        @media (max-width: 480px) {
          .book-viewer {
            padding: 1rem;
          }
          .book-viewer__controls {
            gap: 1rem;
          }
          .book-viewer__controls button {
            padding: 0.8rem 1.5rem !important;
            font-size: 0.9rem !important;
          }
        }

        .book-viewer__display {
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 1.5rem;
          background: var(--color-bg-navy);
        }

        .book-viewer__page {
          width: 100%;
          display: block;
        }

        .book-viewer__page--placeholder {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.04);
          border-radius: var(--radius-md);
          border: 2px dashed var(--color-border);
          font-family: var(--font-heading);
          font-size: 4rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .book-viewer__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .book-viewer__counter {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .book-viewer__controls button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Photo Gallery Grid ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .gallery-shot {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: var(--radius-md);
          border: none;
          padding: 0;
          cursor: pointer;
          background: var(--color-surface);
          opacity: 0;
          will-change: transform, opacity;
        }

        .gallery-shot img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s var(--ease-gentle);
        }

        .gallery-shot:hover img {
          transform: scale(1.08);
          animation: kenBurns 8s ease-in-out infinite alternate;
        }

        .gallery-shot__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-shot:hover .gallery-shot__overlay {
          opacity: 1;
        }

        .gallery-shot__zoom {
          font-size: 2rem;
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }

        /* ── Lightbox ── */
        .gallery-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: pointer;
        }

        .gallery-lightbox__img {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 30px 80px rgba(0,0,0,0.7);
          cursor: default;
        }

        .gallery-lightbox__close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 1.5rem;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .gallery-lightbox__close:hover { background: rgba(255,255,255,0.2); }

        .gallery-lightbox__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-size: 2.5rem;
          width: 3.5rem;
          height: 5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          line-height: 1;
        }

        .gallery-lightbox__nav:hover { background: rgba(255,255,255,0.2); }
        .gallery-lightbox__nav--prev { left: 1.5rem; }
        .gallery-lightbox__nav--next { right: 1.5rem; }

        .gallery-lightbox__counter {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          font-family: var(--font-heading);
        }

        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `})]})};export{J as default};
