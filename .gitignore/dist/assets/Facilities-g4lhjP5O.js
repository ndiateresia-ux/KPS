const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GetInTouch-D_2b9WqC.js","assets/index-DdhT2juL.js","assets/chunk-CyzFmspp.js","assets/react-dom-D4PJ_xSu.js","assets/jsx-runtime-DrT-PAc3.js","assets/index-CIqa-HY8.css","assets/TransitionWrapper-BYe0W4ux.js","assets/Anchor-CMlDA2N1.js","assets/Button-BDuiwzKm.js","assets/Container-CbyOKXvW.js","assets/Alert-BDWuQlRR.js","assets/CloseButton-CZ0t1Ub3.js","assets/utils-W7pImXuJ.js","assets/prop-types-CD4CWj_x.js","assets/divWithClassName-DKtYJXYp.js","assets/Button-CuJSbr1N.js","assets/Row-B8OK5jBH.js","assets/Form-BuiXG3A2.js","assets/ElementChildren-BQxIJFUs.js","assets/warning-Bo9yTVLr.js"])))=>i.map(i=>d[i]);
import{n as R}from"./chunk-CyzFmspp.js";import{n as A,t as F}from"./jsx-runtime-DrT-PAc3.js";import{o as B,t as H}from"./index-DdhT2juL.js";import{t as _}from"./Container-CbyOKXvW.js";import{t as j}from"./Button-CuJSbr1N.js";import{t as h}from"./Card-WaLIy-cK.js";import{n as a,t as m}from"./Row-B8OK5jBH.js";var o=R(A(),1),e=F(),T=(0,o.lazy)(()=>H(()=>import("./GetInTouch-D_2b9WqC.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]))),y={facility:"https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",kitchen:"https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",dining:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",placeholder:"https://via.placeholder.com/800x600?text=Image+Coming+Soon"},n=(0,o.memo)(({image:c,alt:d,onClick:g})=>{const[p,t]=(0,o.useState)(c),[s,x]=(0,o.useState)(!1);return(0,e.jsxs)("div",{className:"facility-image-card cursor-pointer",onClick:g,style:{position:"relative",borderRadius:"12px",overflow:"hidden",aspectRatio:"4/3",cursor:"pointer",backgroundColor:"#f0f0f0"},children:[!s&&(0,e.jsx)("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}),(0,e.jsx)("img",{src:p,alt:d,loading:"lazy",decoding:"async",onLoad:()=>x(!0),onError:u=>{u.target.onerror=null,t(y.placeholder)},style:{width:"100%",height:"100%",objectFit:"cover",opacity:s?1:0,transition:"opacity 0.3s ease, transform 0.3s ease"}}),(0,e.jsx)("div",{style:{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)",color:"white",padding:"1rem 0.5rem 0.5rem 0.5rem",fontSize:"0.9rem",fontWeight:"500"},children:d})]})});n.displayName="FacilityImageCard";var v=(0,o.memo)(({eventKey:c,active:d,icon:g,label:p,onClick:t})=>(0,e.jsxs)("button",{onClick:()=>t(c),style:{padding:"0.75rem 1.5rem",borderRadius:"40px",border:"none",backgroundColor:d?"#132f66":"transparent",color:d?"white":"#132f66",fontWeight:"600",fontSize:"1rem",cursor:"pointer",transition:"all 0.2s ease",boxShadow:d?"0 4px 12px rgba(19,47,102,0.2)":"none",display:"inline-flex",alignItems:"center",gap:"0.5rem"},children:[(0,e.jsx)("span",{children:g}),p]}));v.displayName="TabButton";function z(){const[c,d]=(0,o.useState)("boarding"),[g,p]=(0,o.useState)(null),t={dormitory:"/images/facilities/dormitory.jpg",commonRoom:"/images/facilities/common-room.jpg",dining:"/images/facilities/dining-hall.jpg",studyArea:"/images/facilities/study-area.jpg",recreation:"/images/facilities/recreation.jpg",chapel:"/images/facilities/chapel.jpg"},s={kitchen:"/images/facilities/kitchen.jpg",diningHall:"/images/facilities/dining-hall-2.jpg",foodPrep:"/images/facilities/food-preparation.jpg",storage:"/images/facilities/food-storage.jpg"},x="/images/menu.png",u="/images/boarding-items.jpg",w={itemsList:"/pdfs/boarding-items-list.pdf",weeklyMenu:"/pdfs/weekly-menu.pdf"},I=[{time:"6:00 AM - 6:45 AM",activity:"Morning Prep (Study Time)"},{time:"7:00 AM - 7:45 AM",activity:"Breakfast"},{time:"8:00 AM - 5:00 PM",activity:"Classes (with breaks)"},{time:"5:00 PM - 6:00 PM",activity:"Sports & Recreation"},{time:"6:00 PM - 7:00 PM",activity:"Personal Time/Shower"},{time:"7:00 PM - 8:00 PM",activity:"Supper"},{time:"8:00 PM - 9:00 PM",activity:"Evening Prep (Homework)"},{time:"9:00 PM",activity:"Lights Out (Younger Students)"},{time:"10:00 PM",activity:"Lights Out (Older Students)"}],k=(0,o.useCallback)((i,f)=>{const l=document.createElement("a");l.href=i,l.download=f,l.target="_blank",l.rel="noopener noreferrer",document.body.appendChild(l),l.click(),document.body.removeChild(l)},[]),r=(0,o.useCallback)(i=>{p(i)},[]),N=(0,o.useCallback)(()=>{p(null)},[]),C=(0,o.useCallback)(i=>{d(i)},[]);return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)(B,{children:[(0,e.jsx)("title",{children:"Facilities | Kitale Progressive School"}),(0,e.jsx)("meta",{name:"description",content:"Explore our modern boarding facilities, kitchen, dining hall, and other amenities at Kitale Progressive School."})]}),(0,e.jsx)("section",{style:{background:"linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)",color:"white",paddingTop:"120px",paddingBottom:"60px",textAlign:"center"},children:(0,e.jsxs)(_,{children:[(0,e.jsx)("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)",fontWeight:"bold",marginBottom:"1rem",color:"white"},children:"Our Facilities"}),(0,e.jsx)("p",{style:{fontSize:"clamp(1rem, 4vw, 1.3rem)",maxWidth:"700px",margin:"0 auto",color:"rgba(255,255,255,0.95)"},children:"Modern Learning Environment • Home Away From Home"})]})}),(0,e.jsx)("section",{className:"py-5 bg-light-custom",children:(0,e.jsxs)(_,{children:[(0,e.jsxs)("div",{className:"d-flex justify-content-center gap-3 mb-5",children:[(0,e.jsx)(v,{eventKey:"boarding",active:c==="boarding",icon:"🏠",label:"Boarding Facilities",onClick:C}),(0,e.jsx)(v,{eventKey:"kitchen",active:c==="kitchen",icon:"🍳",label:"Kitchen & Dining",onClick:C})]}),c==="boarding"&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(m,{className:"mb-5",children:(0,e.jsxs)(a,{lg:8,className:"mx-auto text-center",children:[(0,e.jsx)("h2",{className:"h3 fw-bold mb-3",style:{color:"#132f66"},children:"Home Away From Home"}),(0,e.jsx)("p",{className:"text-muted",children:"Our boarding facilities provide a safe, nurturing environment where students develop independence, lifelong friendships, and strong character."})]})}),(0,e.jsxs)(m,{className:"g-4 mb-5",children:[(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.dormitory,alt:"Dormitory",onClick:()=>r(t.dormitory)})}),(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.commonRoom,alt:"Common Room",onClick:()=>r(t.commonRoom)})}),(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.dining,alt:"Dining Hall",onClick:()=>r(t.dining)})}),(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.studyArea,alt:"Study Area",onClick:()=>r(t.studyArea)})}),(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.recreation,alt:"Recreation Area",onClick:()=>r(t.recreation)})}),(0,e.jsx)(a,{md:4,children:(0,e.jsx)(n,{image:t.chapel,alt:"Chapel",onClick:()=>r(t.chapel)})})]}),(0,e.jsx)(m,{className:"mb-5",children:(0,e.jsx)(a,{lg:12,children:(0,e.jsx)(h,{className:"border-0 shadow-sm overflow-hidden",children:(0,e.jsxs)(h.Body,{className:"p-4",children:[(0,e.jsxs)("h3",{className:"h5 fw-bold mb-4",style:{color:"#132f66"},children:[(0,e.jsx)("i",{className:"fas fa-clock me-2",style:{color:"#cebd04"}}),"Daily Routine for Boarders"]}),(0,e.jsxs)("div",{className:"routine-header",children:[(0,e.jsx)("span",{className:"time-column",children:"Time"}),(0,e.jsx)("span",{className:"activity-column",children:"Activity"})]}),(0,e.jsx)("div",{className:"routine-body",children:I.map((i,f)=>{const l=i.activity.includes("Morning Prep"),M=i.activity.includes("Evening Prep"),S=i.activity.includes("Breakfast")||i.activity.includes("Supper"),P=i.activity.includes("Lights Out");let b=f%2===0?"routine-row-even":"routine-row-odd";return(l||M)&&(b+=" prep-time"),S&&(b+=" meal-time"),P&&(b+=" lights-out"),(0,e.jsxs)("div",{className:`routine-row ${b}`,children:[(0,e.jsx)("span",{className:"time-column",children:i.time}),(0,e.jsxs)("span",{className:"activity-column",children:[l&&(0,e.jsx)("span",{className:"activity-icon",children:"📚"}),M&&(0,e.jsx)("span",{className:"activity-icon",children:"✏️"}),S&&(0,e.jsx)("span",{className:"activity-icon",children:"🍽️"}),P&&(0,e.jsx)("span",{className:"activity-icon",children:"🌙"}),i.activity]})]},f)})}),(0,e.jsxs)("div",{className:"routine-legend",children:[(0,e.jsx)("span",{children:"📚 Prep Time"}),(0,e.jsx)("span",{children:"🍽️ Meal Time"}),(0,e.jsx)("span",{children:"🌙 Lights Out"})]})]})})})}),(0,e.jsx)(m,{className:"mb-5",children:(0,e.jsx)(a,{lg:12,children:(0,e.jsx)(h,{className:"border-0 shadow-sm",children:(0,e.jsxs)(h.Body,{className:"p-4",children:[(0,e.jsxs)("h3",{className:"h5 fw-bold mb-4",style:{color:"#132f66"},children:[(0,e.jsx)("i",{className:"fas fa-box me-2",style:{color:"#cebd04"}}),"Boarding Items Checklist"]}),(0,e.jsxs)("div",{className:"text-center mb-4 cursor-pointer",onClick:()=>r(u),style:{cursor:"pointer"},children:[(0,e.jsx)("img",{src:u,alt:"Boarding Items Checklist",loading:"lazy",style:{maxHeight:"400px",width:"auto",maxWidth:"100%",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"},onError:i=>{i.target.onerror=null,i.target.src=y.placeholder}}),(0,e.jsx)("div",{className:"mt-2",children:(0,e.jsx)("small",{className:"text-muted",children:"Click image to enlarge"})})]}),(0,e.jsx)("div",{className:"text-center",children:(0,e.jsxs)(j,{onClick:()=>k(w.itemsList,"Boarding_Items_List.pdf"),style:{backgroundColor:"#132f66",borderColor:"#132f66",padding:"0.5rem 2rem",borderRadius:"40px",fontWeight:"600"},children:[(0,e.jsx)("i",{className:"fas fa-download me-2"}),"Download PDF"]})})]})})})})]}),c==="kitchen"&&(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(m,{className:"mb-5",children:(0,e.jsxs)(a,{lg:8,className:"mx-auto text-center",children:[(0,e.jsx)("h2",{className:"h3 fw-bold mb-3",style:{color:"#132f66"},children:"Nutritious Meals Daily"}),(0,e.jsx)("p",{className:"text-muted",children:"Our kitchen prepares balanced, nutritious meals following strict hygiene standards and a menu approved by nutritionists."})]})}),(0,e.jsxs)(m,{className:"g-4 mb-5",children:[(0,e.jsx)(a,{md:6,children:(0,e.jsx)(n,{image:s.kitchen,alt:"Modern Kitchen",onClick:()=>r(s.kitchen)})}),(0,e.jsx)(a,{md:6,children:(0,e.jsx)(n,{image:s.diningHall,alt:"Dining Hall",onClick:()=>r(s.diningHall)})}),(0,e.jsx)(a,{md:6,children:(0,e.jsx)(n,{image:s.foodPrep,alt:"Food Preparation",onClick:()=>r(s.foodPrep)})}),(0,e.jsx)(a,{md:6,children:(0,e.jsx)(n,{image:s.storage,alt:"Food Storage",onClick:()=>r(s.storage)})})]}),(0,e.jsx)(m,{className:"mb-5",children:(0,e.jsx)(a,{lg:12,children:(0,e.jsx)(h,{className:"border-0 shadow-sm",children:(0,e.jsxs)(h.Body,{className:"p-4",children:[(0,e.jsxs)("h3",{className:"h5 fw-bold mb-4",style:{color:"#132f66"},children:[(0,e.jsx)("i",{className:"fas fa-utensils me-2",style:{color:"#cebd04"}}),"Weekly Menu"]}),(0,e.jsxs)("div",{className:"text-center mb-4 cursor-pointer",onClick:()=>r(x),style:{cursor:"pointer"},children:[(0,e.jsx)("img",{src:x,alt:"Weekly Menu",loading:"lazy",style:{maxHeight:"500px",width:"auto",maxWidth:"100%",borderRadius:"8px",boxShadow:"0 4px 12px rgba(0,0,0,0.1)"},onError:i=>{i.target.onerror=null,i.target.src=y.placeholder}}),(0,e.jsx)("div",{className:"mt-2",children:(0,e.jsx)("small",{className:"text-muted",children:"Click image to enlarge"})})]}),(0,e.jsxs)("div",{className:"d-flex justify-content-center gap-3",children:[(0,e.jsxs)(j,{variant:"outline-primary",onClick:()=>r(x),style:{borderColor:"#132f66",color:"#132f66",padding:"0.5rem 2rem",borderRadius:"40px",fontWeight:"600"},children:[(0,e.jsx)("i",{className:"fas fa-eye me-2"}),"View Menu"]}),(0,e.jsxs)(j,{onClick:()=>k(w.weeklyMenu,"Weekly_Menu.pdf"),style:{backgroundColor:"#132f66",borderColor:"#132f66",padding:"0.5rem 2rem",borderRadius:"40px",fontWeight:"600"},children:[(0,e.jsx)("i",{className:"fas fa-download me-2"}),"Download PDF"]})]})]})})})})]})]})}),g&&(0,e.jsx)("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"rgba(0,0,0,0.9)",zIndex:1e5,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"},onClick:N,children:(0,e.jsxs)("div",{style:{position:"relative",maxWidth:"90vw",maxHeight:"90vh"},onClick:i=>i.stopPropagation(),children:[(0,e.jsx)("button",{onClick:N,style:{position:"absolute",top:"-40px",right:"-40px",background:"white",border:"none",borderRadius:"50%",width:"40px",height:"40px",fontSize:"1.2rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"},children:"✕"}),(0,e.jsx)("img",{src:g,alt:"Enlarged view",style:{maxWidth:"100%",maxHeight:"90vh",objectFit:"contain",borderRadius:"8px"}})]})}),(0,e.jsx)(o.Suspense,{fallback:null,children:(0,e.jsx)(T,{})}),(0,e.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .cursor-pointer { cursor: pointer; }
        
        .facility-image-card {
          transition: transform 0.3s ease;
        }
        .facility-image-card:hover {
          transform: scale(1.02);
        }
        .facility-image-card:hover img {
          transform: scale(1.05);
        }

        /* Routine Table Styles */
        .routine-header {
          display: flex;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #132f66 0%, #1e3a7a 100%);
          color: white;
          border-radius: 12px 12px 0 0;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.5px;
        }

        .time-column {
          width: 200px;
        }

        .activity-column {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .activity-icon {
          font-size: 1.2rem;
          min-width: 24px;
        }

        .routine-body {
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .routine-row {
          display: flex;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }

        .routine-row:last-child {
          border-bottom: none;
        }

        .routine-row-even {
          background-color: #ffffff;
        }

        .routine-row-odd {
          background-color: #f8fafc;
        }

        .routine-row:hover {
          background-color: #e6f0ff !important;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: relative;
          z-index: 1;
        }

        /* Special activity styling */
        .routine-row.prep-time {
          border-left: 4px solid #4299e1;
        }

        .routine-row.meal-time {
          border-left: 4px solid #cebd04;
        }

        .routine-row.lights-out {
          border-left: 4px solid #4a5568;
        }

        .routine-legend {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .routine-legend span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .routine-header {
            display: none;
          }

          .routine-row {
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
          }

          .time-column {
            width: 100%;
            font-weight: 700;
            color: #132f66;
          }

          .activity-column {
            margin-left: 0;
          }

          .routine-legend {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .facility-image-card,
          .facility-image-card img,
          .routine-row,
          * {
            transition: none !important;
            animation: none !important;
          }
          .routine-row:hover {
            transform: none !important;
          }
        }
      `}})]})}var V=(0,o.memo)(z);export{V as default};
