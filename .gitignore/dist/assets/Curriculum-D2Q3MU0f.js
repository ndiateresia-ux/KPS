const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GetInTouch-D_2b9WqC.js","assets/index-DdhT2juL.js","assets/chunk-CyzFmspp.js","assets/react-dom-D4PJ_xSu.js","assets/jsx-runtime-DrT-PAc3.js","assets/index-CIqa-HY8.css","assets/TransitionWrapper-BYe0W4ux.js","assets/Anchor-CMlDA2N1.js","assets/Button-BDuiwzKm.js","assets/Container-CbyOKXvW.js","assets/Alert-BDWuQlRR.js","assets/CloseButton-CZ0t1Ub3.js","assets/utils-W7pImXuJ.js","assets/prop-types-CD4CWj_x.js","assets/divWithClassName-DKtYJXYp.js","assets/Button-CuJSbr1N.js","assets/Row-B8OK5jBH.js","assets/Form-BuiXG3A2.js","assets/ElementChildren-BQxIJFUs.js","assets/warning-Bo9yTVLr.js"])))=>i.map(i=>d[i]);
import{n as y}from"./chunk-CyzFmspp.js";import{n as j,t as v}from"./jsx-runtime-DrT-PAc3.js";import"./react-dom-D4PJ_xSu.js";import{i as C,o as N,r as w,t as S}from"./index-DdhT2juL.js";import{t as d}from"./Container-CbyOKXvW.js";import{t as k}from"./Button-CuJSbr1N.js";import{t as m}from"./Card-WaLIy-cK.js";import{n as o,t as n}from"./Row-B8OK5jBH.js";var r=y(j(),1),e=v(),E=(0,r.lazy)(()=>S(()=>import("./GetInTouch-D_2b9WqC.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]))),p={ecde:"https://images.unsplash.com/photo-1503676260728-517c89092e3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",primary:"https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",jss:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"},b=(0,r.memo)(({value:a,label:l})=>(0,e.jsx)(o,{xs:6,md:3,children:(0,e.jsxs)("div",{className:"curriculum-stat-badge",children:[(0,e.jsx)("div",{className:"stat-number text-gold display-6 fw-bold",children:a}),(0,e.jsx)("div",{className:"stat-label text-white-50 small",children:l})]})}));b.displayName="StatItem";var x=(0,r.memo)(({icon:a,label:l})=>(0,e.jsx)(o,{md:3,sm:6,children:(0,e.jsxs)("div",{className:"pillar-item text-center p-3",children:[(0,e.jsx)("div",{className:"pillar-icon fs-1 mb-2",children:a}),(0,e.jsx)("h6",{className:"small fw-bold text-navy",children:l})]})}));x.displayName="PillarItem";var u=(0,r.memo)(({data:a,onClick:l})=>(0,e.jsx)(o,{md:4,className:"mb-4",children:(0,e.jsxs)(m,{className:"curriculum-nav-card h-100 border-0 shadow-sm",children:[(0,e.jsx)("div",{className:"curriculum-card-img-wrapper",style:{aspectRatio:"16/9",overflow:"hidden"},children:(0,e.jsx)(m.Img,{variant:"top",src:a.image,alt:a.badge,className:"curriculum-card-img",loading:"lazy",decoding:"async",width:"400",height:"225",style:{width:"100%",height:"100%",objectFit:"cover"},onError:s=>{s.target.onerror=null,s.target.src=a.fallbackImage}})}),(0,e.jsxs)(m.Body,{className:"text-center p-3",children:[(0,e.jsx)(m.Title,{className:"card-title-navy fw-bold h6",children:a.badge}),(0,e.jsx)(m.Text,{className:"text-muted small mb-2",children:a.ageRange}),(0,e.jsx)(k,{variant:"outline-primary",size:"sm",className:"btn-outline-navy btn-sm px-3",onClick:()=>l(`${a.id}-section`),children:"Explore"})]})]})}));u.displayName="NavCard";var f=(0,r.memo)(({data:a})=>{const[l,s]=(0,r.useState)(a.image),[t,h]=(0,r.useState)(!1);return(0,e.jsxs)("div",{className:"curriculum-image-wrapper",style:{aspectRatio:"4/3",position:"relative",borderRadius:"12px",overflow:"hidden",backgroundColor:"#f0f0f0"},children:[!t&&(0,e.jsx)("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}),(0,e.jsx)("img",{src:l,alt:a.title,className:`curriculum-image ${t?"loaded":""}`,loading:"lazy",decoding:"async",width:"600",height:"450",style:{width:"100%",height:"100%",objectFit:"cover",opacity:t?1:0,transition:"opacity 0.3s ease, transform 0.3s ease"},onLoad:()=>h(!0),onError:i=>{i.target.onerror=null,s(a.fallbackImage)}}),(0,e.jsxs)("div",{style:{position:"absolute",bottom:"15px",left:"15px",background:"rgba(206, 189, 4, 0.9)",color:"#132f66",padding:"4px 12px",borderRadius:"30px",fontSize:"0.8rem",fontWeight:"600",backdropFilter:"blur(5px)",zIndex:2},children:[(0,e.jsx)("i",{className:`fas ${a.imageIcon} me-2`,"aria-hidden":"true"}),a.imageTag]})]})});f.displayName="CurriculumImage";var g=(0,r.memo)(({data:a,isReversed:l=!1})=>(0,e.jsx)("section",{id:`${a.id}-section`,className:`curriculum-section py-5 ${a.id==="primary"?"bg-light-custom":"bg-white"}`,children:(0,e.jsx)(d,{children:(0,e.jsxs)(n,{className:"align-items-center g-4 g-lg-5",children:[(0,e.jsxs)(o,{lg:6,className:l?"order-lg-2":"",children:[(0,e.jsxs)("div",{className:"curriculum-content",children:[(0,e.jsx)("span",{className:`curriculum-badge ${a.id}-badge`,style:{display:"inline-block",padding:"4px 12px",borderRadius:"30px",fontSize:"0.8rem",fontWeight:"600",marginBottom:"1rem",backgroundColor:a.id==="ecde"?"#ffd700":a.id==="primary"?"#4CAF50":"#2196F3",color:a.id==="ecde"?"#132f66":"white"},children:a.badge}),(0,e.jsx)("h2",{className:"curriculum-title h3 fw-bold mb-2",style:{color:"#132f66"},children:a.title}),(0,e.jsx)("h5",{className:"curriculum-subtitle text-muted mb-2 small",children:a.subtitle}),(0,e.jsx)("p",{className:"curriculum-age-range mb-3 fw-medium",style:{color:"#cebd04"},children:a.ageRange}),(0,e.jsx)("p",{className:"curriculum-description mb-3 text-muted",children:a.description})]}),(0,e.jsxs)(n,{xs:1,md:2,className:"g-3",children:[(0,e.jsxs)(o,{children:[(0,e.jsxs)("h6",{className:"fw-bold mb-2",style:{color:"#132f66",fontSize:"0.9rem"},children:[(0,e.jsx)("i",{className:"fas fa-check-circle me-2",style:{color:"#cebd04"}}),"Learning Areas:"]}),(0,e.jsx)("ul",{className:"list-unstyled small",children:a.learningAreas?.slice(0,5).map((s,t)=>(0,e.jsxs)("li",{className:"mb-1 ps-2",style:{color:"#4a5568"},children:["• ",s]},t))})]}),(0,e.jsxs)(o,{children:[(0,e.jsxs)("h6",{className:"fw-bold mb-2",style:{color:"#132f66",fontSize:"0.9rem"},children:[(0,e.jsx)("i",{className:"fas fa-star me-2",style:{color:"#cebd04"}}),"Competencies:"]}),(0,e.jsx)("ul",{className:"list-unstyled small",children:a.keyCompetencies?.slice(0,4).map((s,t)=>(0,e.jsxs)("li",{className:"mb-1 ps-2",style:{color:"#4a5568"},children:["• ",s]},t))})]})]}),a.optionalSubjects&&(0,e.jsxs)("div",{className:"mt-3",children:[(0,e.jsxs)("h6",{className:"fw-bold mb-2",style:{color:"#132f66",fontSize:"0.9rem"},children:[(0,e.jsx)("i",{className:"fas fa-plus-circle me-2",style:{color:"#cebd04"}}),"Optional Subjects:"]}),(0,e.jsx)("ul",{className:"list-unstyled small",children:a.optionalSubjects.slice(0,5).map((s,t)=>(0,e.jsxs)("li",{className:"mb-1 ps-2",style:{color:"#4a5568"},children:["• ",s]},t))})]})]}),(0,e.jsx)(o,{lg:6,className:l?"order-lg-1":"",children:(0,e.jsx)(f,{data:a})})]})})}));g.displayName="CurriculumSection";function I(){const a=C();(0,r.useEffect)(()=>{a.hash?setTimeout(()=>{const i=document.getElementById(a.hash.substring(1));i&&i.scrollIntoView({behavior:"smooth",block:"start"})},100):window.scrollTo(0,0)},[a]);const l=(0,r.useCallback)(i=>{const c=document.getElementById(i);c&&c.scrollIntoView({behavior:"smooth",block:"start"})},[]),s=(0,r.useMemo)(()=>({ecde:{id:"ecde",badge:"ECDE",title:"ECDE (Early Childhood Development Education)",subtitle:"Playgroup • Pre-Primary 1 • Pre-Primary 2",ageRange:"Ages 2-5 years",image:"/images/ecde.jpg",fallbackImage:p.ecde,description:"The ECDE level focuses on foundational learning through play-based activities that develop curiosity, creativity, and social skills. Our youngest learners explore, discover, and build confidence in a nurturing environment.",learningAreas:["Language Activities","Mathematical Activities","Environmental Activities","Psychomotor and Creative Activities","Religious Education"],keyCompetencies:["Communication skills","Basic numeracy","Social skills","Fine and gross motor skills","Creativity and imagination"],imageTag:"Play-based Learning",imageIcon:"fa-child"},primary:{id:"primary",badge:"Primary",title:"Primary School",subtitle:"Grades 1 - 6",ageRange:"Ages 6-11 years",image:"/images/primary.jpg",fallbackImage:p.primary,description:"The Primary level builds on foundational skills and introduces more structured learning. Learners develop competencies across various subjects while values education remains integral to their holistic development.",learningAreas:["English","Kiswahili","Mathematics","Science and Technology","Social Studies","Religious Education","Creative Arts","Physical and Health Education"],keyCompetencies:["Critical thinking","Problem solving","Digital literacy","Collaboration","Self-awareness"],imageTag:"Structured Learning",imageIcon:"fa-book-open"},juniorSecondary:{id:"jss",badge:"JSS",title:"Junior Secondary School (JSS)",subtitle:"Grades 7 - 9",ageRange:"Ages 12-14 years",image:"/images/jss.jpg",fallbackImage:p.jss,description:"Junior Secondary prepares learners for senior school while helping them explore their talents and interests. The curriculum offers core and optional subjects, allowing students to begin specializing in areas of strength.",learningAreas:["English","Kiswahili","Mathematics","Integrated Science","Social Studies","Religious Education","Business Studies","Agriculture","Pre-Technical Studies","Creative Arts and Sports"],optionalSubjects:["Foreign Languages (French/German)","Kenyan Sign Language","Indigenous Languages","Visual Arts","Performing Arts","Home Science","Computer Science"],keyCompetencies:["Critical thinking and problem solving","Creativity and imagination","Communication and collaboration","Digital literacy","Citizenship","Self-efficacy"],imageTag:"Specialized Learning",imageIcon:"fa-flask"}}),[]),t=(0,r.useMemo)(()=>[{icon:"🧠",label:"Critical Thinking"},{icon:"🎨",label:"Creativity"},{icon:"🤝",label:"Collaboration"},{icon:"💬",label:"Communication"},{icon:"💻",label:"Digital Literacy"},{icon:"🌍",label:"Citizenship"},{icon:"🔍",label:"Self-efficacy"},{icon:"📊",label:"Problem Solving"}],[]),h=(0,r.useMemo)(()=>[{value:"3",label:"Learning Levels"},{value:"20+",label:"Subjects"},{value:"7",label:"Core Competencies"},{value:"KICD",label:"Approved"}],[]);return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)(N,{children:[(0,e.jsx)("title",{children:"Curriculum | Kitale Progressive School"}),(0,e.jsx)("meta",{name:"description",content:"Explore our Competency-Based Curriculum (CBC) across ECDE, Primary, and Junior Secondary levels at Kitale Progressive School."}),(0,e.jsx)("link",{rel:"preload",as:"image",href:"/images/ecde.jpg"}),(0,e.jsx)("link",{rel:"preload",as:"image",href:"/images/primary.jpg"}),(0,e.jsx)("link",{rel:"preload",as:"image",href:"/images/jss.jpg"})]}),(0,e.jsx)("section",{style:{background:"linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)",color:"white",paddingTop:"120px",paddingBottom:"60px",textAlign:"center",width:"100%"},children:(0,e.jsxs)(d,{children:[(0,e.jsx)("h1",{style:{fontSize:"clamp(2rem, 5vw, 2.5rem)",fontWeight:"bold",marginBottom:"1rem",color:"white"},children:"Our Curriculum"}),(0,e.jsx)("p",{style:{fontSize:"clamp(1rem, 4vw, 1.2rem)",maxWidth:"700px",margin:"0 auto",color:"rgba(255,255,255,0.95)"},children:"Competency-Based Curriculum (CBC) Excellence"}),(0,e.jsx)(n,{className:"justify-content-center mt-4 g-3",children:h.map((i,c)=>(0,e.jsx)(b,{value:i.value,label:i.label},c))})]})}),(0,e.jsx)("section",{className:"py-5 bg-light-custom",children:(0,e.jsxs)(d,{children:[(0,e.jsx)(n,{className:"text-center mb-4",children:(0,e.jsxs)(o,{lg:8,className:"mx-auto",children:[(0,e.jsx)("h2",{className:"section-heading h3 mb-3",style:{color:"#132f66",fontWeight:"bold"},children:"The CBC Pathway"}),(0,e.jsx)("p",{className:"text-muted",children:"At Kitale Progressive School, we follow the Competency-Based Curriculum (CBC) approved by the Kenya Institute of Curriculum Development (KICD). Our approach focuses on developing learners' competencies, values, and skills for the 21st century."})]})}),(0,e.jsxs)(n,{className:"mb-5 g-4",children:[(0,e.jsx)(u,{data:s.ecde,onClick:l}),(0,e.jsx)(u,{data:s.primary,onClick:l}),(0,e.jsx)(u,{data:s.juniorSecondary,onClick:l})]}),(0,e.jsx)(n,{className:"mt-5",children:(0,e.jsx)(o,{lg:12,children:(0,e.jsxs)("div",{className:"bg-white p-4 rounded-4 shadow-sm",children:[(0,e.jsx)("h3",{className:"text-center fw-bold h5 mb-4",style:{color:"#132f66"},children:"The 7 Core Competencies of CBC"}),(0,e.jsx)(n,{className:"g-3",children:t.map((i,c)=>(0,e.jsx)(x,{icon:i.icon,label:i.label},c))})]})})})]})}),(0,e.jsx)(g,{data:s.ecde}),(0,e.jsx)(g,{data:s.primary,isReversed:!0}),(0,e.jsx)(g,{data:s.juniorSecondary}),(0,e.jsx)("section",{className:"cta-section py-5",style:{background:"#132f66"},children:(0,e.jsxs)(d,{className:"text-center text-white",children:[(0,e.jsx)("h2",{className:"h3 fw-bold mb-3",children:"Ready to Begin the Journey?"}),(0,e.jsx)("p",{className:"mb-4",style:{opacity:.95},children:"Enroll your child today and give them the gift of quality CBC education."}),(0,e.jsx)(w,{to:"/admissions/apply",className:"btn btn-light px-4 py-2",style:{backgroundColor:"#cebd04",color:"#132f66",border:"none",borderRadius:"40px",fontWeight:"600",textDecoration:"none",display:"inline-block",transition:"all 0.3s ease"},onMouseEnter:i=>{i.target.style.backgroundColor="#b09e03",i.target.style.transform="translateY(-2px)",i.target.style.boxShadow="0 4px 12px rgba(0,0,0,0.2)"},onMouseLeave:i=>{i.target.style.backgroundColor="#cebd04",i.target.style.transform="translateY(0)",i.target.style.boxShadow="none"},children:"Apply Now"})]})}),(0,e.jsx)(r.Suspense,{fallback:null,children:(0,e.jsx)(E,{})}),(0,e.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .curriculum-image-wrapper {
          overflow: hidden;
        }
        .curriculum-image-wrapper:hover img {
          transform: scale(1.05);
        }
        .curriculum-stat-badge {
          text-align: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          backdrop-filter: blur(5px);
        }
        .stat-number {
          font-size: clamp(1.5rem, 5vw, 2.2rem);
          line-height: 1.2;
          color: #cebd04;
          font-weight: bold;
        }
        .stat-label {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .pillar-item {
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pillar-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .btn-outline-navy {
          border: 2px solid #132f66;
          color: #132f66;
          background: transparent;
          transition: all 0.2s ease;
        }
        .btn-outline-navy:hover {
          background: #132f66;
          color: white;
        }
        .curriculum-badge {
          transition: transform 0.2s ease;
        }
        .curriculum-badge:hover {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .curriculum-stat-badge {
            padding: 0.75rem;
          }
          .stat-number {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .curriculum-stat-badge {
            padding: 0.5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          .curriculum-image-wrapper:hover img {
            transform: none !important;
          }
          .pillar-item:hover {
            transform: none !important;
          }
          .btn-outline-navy:hover {
            transform: none !important;
          }
        }
      `}})]})}var D=(0,r.memo)(I);export{D as default};
