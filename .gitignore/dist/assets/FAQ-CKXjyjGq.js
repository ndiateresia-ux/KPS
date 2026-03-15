const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GetInTouch-D_2b9WqC.js","assets/index-DdhT2juL.js","assets/chunk-CyzFmspp.js","assets/react-dom-D4PJ_xSu.js","assets/jsx-runtime-DrT-PAc3.js","assets/index-CIqa-HY8.css","assets/TransitionWrapper-BYe0W4ux.js","assets/Anchor-CMlDA2N1.js","assets/Button-BDuiwzKm.js","assets/Container-CbyOKXvW.js","assets/Alert-BDWuQlRR.js","assets/CloseButton-CZ0t1Ub3.js","assets/utils-W7pImXuJ.js","assets/prop-types-CD4CWj_x.js","assets/divWithClassName-DKtYJXYp.js","assets/Button-CuJSbr1N.js","assets/Row-B8OK5jBH.js","assets/Form-BuiXG3A2.js","assets/ElementChildren-BQxIJFUs.js","assets/warning-Bo9yTVLr.js"])))=>i.map(i=>d[i]);
import{n as A}from"./chunk-CyzFmspp.js";import{n as B,t as M}from"./jsx-runtime-DrT-PAc3.js";import"./react-dom-D4PJ_xSu.js";import{o as H,r as p,t as I}from"./index-DdhT2juL.js";import{i as u,o as T,t as k}from"./Container-CbyOKXvW.js";import{m as _}from"./TransitionWrapper-BYe0W4ux.js";import{t as F}from"./Collapse-OJbdAbxY.js";import{t as y}from"./Card-WaLIy-cK.js";import{n as b,t as g}from"./Row-B8OK5jBH.js";var s=A(B());function P(t,e){return Array.isArray(t)?t.includes(e):t===e}var f=s.createContext({});f.displayName="AccordionContext";var h=A(T()),o=M(),S=s.forwardRef(({as:t="div",bsPrefix:e,className:r,children:n,eventKey:i,...l},a)=>{const{activeEventKey:c}=(0,s.useContext)(f);return e=u(e,"accordion-collapse"),(0,o.jsx)(F,{ref:a,in:P(c,i),...l,className:(0,h.default)(r,e),children:(0,o.jsx)(t,{children:s.Children.only(n)})})});S.displayName="AccordionCollapse";var w=s.createContext({eventKey:""});w.displayName="AccordionItemContext";var q=s.forwardRef(({as:t="div",bsPrefix:e,className:r,onEnter:n,onEntering:i,onEntered:l,onExit:a,onExiting:c,onExited:d,...x},m)=>{e=u(e,"accordion-body");const{eventKey:C}=(0,s.useContext)(w);return(0,o.jsx)(S,{eventKey:C,onEnter:n,onEntering:i,onEntered:l,onExit:a,onExiting:c,onExited:d,children:(0,o.jsx)(t,{ref:m,...x,className:(0,h.default)(r,e)})})});q.displayName="AccordionBody";function R(t,e){const{activeEventKey:r,onSelect:n,alwaysOpen:i}=(0,s.useContext)(f);return l=>{let a=t===r?null:t;i&&(Array.isArray(r)?r.includes(t)?a=r.filter(c=>c!==t):a=[...r,t]:a=[t]),n?.(a,l),e?.(l)}}var j=s.forwardRef(({as:t="button",bsPrefix:e,className:r,onClick:n,...i},l)=>{e=u(e,"accordion-button");const{eventKey:a}=(0,s.useContext)(w),c=R(a,n),{activeEventKey:d}=(0,s.useContext)(f);return t==="button"&&(i.type="button"),(0,o.jsx)(t,{ref:l,onClick:c,...i,"aria-expanded":Array.isArray(d)?d.includes(a):a===d,className:(0,h.default)(r,e,!P(d,a)&&"collapsed")})});j.displayName="AccordionButton";var W=s.forwardRef(({as:t="h2","aria-controls":e,bsPrefix:r,className:n,children:i,onClick:l,...a},c)=>(r=u(r,"accordion-header"),(0,o.jsx)(t,{ref:c,...a,className:(0,h.default)(n,r),children:(0,o.jsx)(j,{onClick:l,"aria-controls":e,children:i})})));W.displayName="AccordionHeader";var K=s.forwardRef(({as:t="div",bsPrefix:e,className:r,eventKey:n,...i},l)=>{e=u(e,"accordion-item");const a=(0,s.useMemo)(()=>({eventKey:n}),[n]);return(0,o.jsx)(w.Provider,{value:a,children:(0,o.jsx)(t,{ref:l,...i,className:(0,h.default)(r,e)})})});K.displayName="AccordionItem";var N=s.forwardRef((t,e)=>{const{as:r="div",activeKey:n,bsPrefix:i,className:l,onSelect:a,flush:c,alwaysOpen:d,...x}=_(t,{activeKey:"onSelect"}),m=u(i,"accordion"),C=(0,s.useMemo)(()=>({activeEventKey:n,onSelect:a,alwaysOpen:d}),[n,a,d]);return(0,o.jsx)(f.Provider,{value:C,children:(0,o.jsx)(r,{ref:e,...x,className:(0,h.default)(l,m,c&&`${m}-flush`)})})});N.displayName="Accordion";var v=Object.assign(N,{Button:j,Collapse:S,Item:K,Header:W,Body:q}),D=(0,s.lazy)(()=>I(()=>import("./GetInTouch-D_2b9WqC.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19])));function V(){const t=(0,s.useCallback)(()=>{const e=document.getElementById("contact-section");e&&e.scrollIntoView({behavior:"smooth"})},[]);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(H,{children:[(0,o.jsx)("title",{children:"Frequently Asked Questions | Kitale Progressive School"}),(0,o.jsx)("meta",{name:"description",content:"Find answers about admissions, CBC curriculum, school fees, boarding, and transport at Kitale Progressive School in Kitale, Trans Nzoia County, Kenya."}),(0,o.jsx)("script",{type:"application/ld+json",children:`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I apply for admission at Kitale Progressive School?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Parents can apply by completing the admission form, submitting required documents, paying the admission fee, and attending a short learner interview."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which curriculum does Kitale Progressive School follow?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Kitale Progressive School follows the Competency Based Curriculum (CBC) approved by the Kenya Institute of Curriculum Development."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Kitale Progressive School offer boarding?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Kitale Progressive School offers boarding facilities with supervised dormitories and dedicated boarding staff."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much are the school fees at Kitale Progressive School?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "School fees depend on the grade level and whether the learner is a day scholar or boarder. Parents can view the full fee structure on the school website."
                  }
                }
              ]
            }
          `})]}),(0,o.jsx)("section",{style:{background:"linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)",color:"white",paddingTop:"120px",paddingBottom:"60px",textAlign:"center",position:"relative",overflow:"hidden"},children:(0,o.jsx)(k,{children:(0,o.jsx)(g,{children:(0,o.jsxs)(b,{lg:8,className:"mx-auto text-center",children:[(0,o.jsx)("h1",{style:{fontSize:"clamp(2rem, 5vw, 3rem)",fontWeight:"bold",marginBottom:"1.5rem",color:"white"},children:"Frequently Asked Questions"}),(0,o.jsx)("p",{style:{fontSize:"clamp(1rem, 4vw, 1.2rem)",marginBottom:"2rem",color:"rgba(255,255,255,0.95)",maxWidth:"700px",margin:"0 auto 2rem auto"},children:"Everything parents need to know about admissions, academics, boarding, transport, and school life at Kitale Progressive School."}),(0,o.jsxs)("div",{style:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},children:[(0,o.jsx)(p,{to:"/admissions/apply",style:{backgroundColor:"#cebd04",color:"#132f66",padding:"0.75rem 2rem",borderRadius:"40px",fontWeight:"600",textDecoration:"none",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="#b09e03",e.target.style.transform="translateY(-2px)",e.target.style.boxShadow="0 4px 12px rgba(0,0,0,0.2)"},onMouseLeave:e=>{e.target.style.backgroundColor="#cebd04",e.target.style.transform="translateY(0)",e.target.style.boxShadow="none"},children:"Apply Now"}),(0,o.jsx)(p,{to:"/admissions/fee-structure",style:{backgroundColor:"transparent",color:"white",padding:"0.75rem 2rem",borderRadius:"40px",fontWeight:"600",textDecoration:"none",border:"2px solid white",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="white",e.target.style.color="#132f66",e.target.style.transform="translateY(-2px)"},onMouseLeave:e=>{e.target.style.backgroundColor="transparent",e.target.style.color="white",e.target.style.transform="translateY(0)"},children:"Fee Structure"}),(0,o.jsx)(p,{to:"/contact",style:{backgroundColor:"transparent",color:"white",padding:"0.75rem 2rem",borderRadius:"40px",fontWeight:"600",textDecoration:"none",border:"2px solid white",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="white",e.target.style.color="#132f66",e.target.style.transform="translateY(-2px)"},onMouseLeave:e=>{e.target.style.backgroundColor="transparent",e.target.style.color="white",e.target.style.transform="translateY(0)"},children:"Contact"})]})]})})})}),(0,o.jsx)("section",{className:"py-5 bg-light-custom",children:(0,o.jsxs)(k,{children:[(0,o.jsx)(g,{className:"mb-4",children:(0,o.jsx)(b,{lg:8,className:"mx-auto text-center",children:(0,o.jsxs)("div",{style:{backgroundColor:"white",padding:"1rem",borderRadius:"50px",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",fontSize:"1rem"},children:["Can't find what you're looking for?"," ",(0,o.jsx)("button",{onClick:t,style:{background:"none",border:"none",color:"#132f66",fontWeight:"600",textDecoration:"underline",cursor:"pointer"},children:"Contact our team"})," ","and we'll respond within 24 hours."]})})}),[{category:"Admissions",icon:"📋",color:"#4299e1",questions:[{question:"How can I apply for admission at Kitale Progressive School in Kitale, Kenya?",answer:`
            Parents can apply for admission at Kitale Progressive School through a simple, structured process:
            <br/><br/>
            <strong>1. Interview</strong> – All new learners (PP1–Grade 9) attend a brief competency interview (KES 700).<br/>
            <strong>2. Requirements</strong> – A checklist of class items, boarding needs, uniforms, and transport is provided.<br/>
            <strong>3. Purchase & Preparation</strong> – Buy the necessary items and prepare for school.<br/>
            <strong>4. Submit Forms & Documents</strong> – Completed admission form and copy of birth certificate.<br/>
            <strong>5. Fee Payment</strong> – Via official school Paybill or bank account.<br/>
            <strong>6. Meet the Headteacher</strong> – Welcome session and Assessment Number issuance.<br/>
            <strong>7. Meet the Class Teacher</strong> – Class orientation.<br/>
            <strong>8. Boarding Introduction</strong> – Tour and introduction to boarding teachers (if applicable).<br/>
            <strong>9. Transport Orientation</strong> – Day scholars meet drivers and confirm routes.
            <br/><br/>
            <a href="/admissions/apply" class="text-navy fw-bold">Begin your application here →</a>
          `},{question:"When does the admission process start at Kitale Progressive School?",answer:`
            Admissions run throughout the year, but the main intake is in January. Mid-term admissions are available depending on space. Parents are encouraged to 
            <a href="/admissions/apply" class="text-navy fw-bold">apply early</a> to secure a spot.
          `},{question:"What are the age requirements for Playgroup at Kitale Progressive School?",answer:`
            Our Playgroup is for children aged 2½ to 3½ years. Children learn through play-based activities, early language, music, movement, and social interaction. Classes run Monday–Friday with half-day or full-day options.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">Learn more about our early years curriculum →</a>
          `},{question:"What documents are needed for admission at Kitale Progressive School?",answer:`
            <strong>Required documents:</strong>
            <br/>
            • Child's birth certificate<br/>
            • Previous school report cards<br/>
            • Immunization record<br/>
            • 4 Passport photos<br/>
            • Parents' ID/Passport copies<br/>
            • Transfer letter (if applicable)
            <br/><br/>
            <a href="/admissions/apply" class="text-navy fw-bold">Download admission forms</a> and view the 
            <a href="/admissions/fee-structure" class="text-navy fw-bold"> fee structure</a>.
          `},{question:"Is there an admission interview or assessment at Kitale Progressive School?",answer:`
            Yes, a friendly assessment for all new students (PP1–Grade 9) is conducted at KES 700. This is a diagnostic tool, not a pass/fail test.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact admissions</a> to schedule an assessment.
          `}]},{category:"Academics & Co-curricular",icon:"🏆",color:"#48bb78",questions:[{question:"Which curriculum does Kitale Progressive School follow in Kenya?",answer:`
            We follow the Competency-Based Curriculum (CBC) approved by KICD. CBC develops learners' skills, values, and competencies for the 21st century.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">View full curriculum →</a>
          `},{question:"What sports and clubs are available at Kitale Progressive School?",answer:`
            Sports & clubs include Football, Volleyball, Netball, Handball, Taekwondo, Swimming, Chess, Skating, Music, Debate, Computer Club, and Chinese Language. We focus on skills development, creativity, and global readiness.
            <br/><br/>
            <a href="/academics/clubs-societies" class="text-navy fw-bold">Clubs & societies</a> | 
            <a href="/school-life/gallery" class="text-navy fw-bold"> Gallery</a>
          `},{question:"What is the average class size at Kitale Progressive School?",answer:`
            Average class size is 25–30 learners. Small classes allow for personalized attention and effective learning.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">Learn about our teaching approach →</a>
          `},{question:"How does Kitale Progressive School support learners with special needs?",answer:`
            We have a learning support department offering remedial classes, one-on-one tutoring, and parental support to ensure every child succeeds.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact learning support →</a>
          `},{question:"Are there ICT/computer facilities at Kitale Progressive School?",answer:`
            Yes. We have a fully equipped computer lab and integrate ICT into all subjects. Students learn coding, digital literacy, and responsible tech use.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View ICT facilities</a> | 
            <a href="/academics/clubs-societies" class="text-navy fw-bold"> Computer Club</a>
          `}]},{category:"Boarding & Student Life",icon:"🏡",color:"#9f7aea",questions:[{question:"What are the boarding facilities at Kitale Progressive School?",answer:`
            Our boarding facilities provide a home away from home. Dorms are separate for boys and girls with comfortable beds, lighting, and 24/7 supervision.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View boarding facilities</a> | 
            <a href="/school-life/gallery" class="text-navy fw-bold"> Gallery</a>
          `},{question:"What is the daily routine for boarders at Kitale Progressive School?",answer:`
            Boarders follow a structured schedule: Wake up at 5:30 AM, morning prep, classes 8:00 AM–5:00 PM, activities, evening prep, supper, lights out 9:00–10:00 PM.
            <br/><br/>
            <a href="/school-life/events" class="text-navy fw-bold">View events calendar →</a>
          `},{question:"What meals are provided for boarders at Kitale Progressive School?",answer:`
            Boarders receive breakfast, lunch, supper, morning and evening tea. Meals are nutritious and approved by a nutritionist.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View dining facilities →</a>
          `},{question:"How is security ensured for boarders?",answer:`
            We provide 24/7 security, secure fencing, and strict visitor protocols. House parents live within dormitories for constant supervision.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View safety measures →</a>
          `}]},{category:"Fees & Payments",icon:"💰",color:"#f56565",questions:[{question:"How much are the school fees at Kitale Progressive School?",answer:`
            Fees vary by grade level and student type (day or boarder). View the detailed fees here:
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View complete fee structure →</a>
          `},{question:"How can parents pay school fees?",answer:`
            Payment methods: Official school Paybill, bank transfer, or direct bank deposit. Flexible installment plans are available through prior arrangement.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact finance office →</a>
          `},{question:"Are there any additional costs besides fees?",answer:`
            Additional costs may include uniforms, stationery, co-curricular activities, and special events.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View complete fee breakdown →</a>
          `},{question:"Does Kitale Progressive School offer sibling discounts?",answer:`
            Yes. 5% discount for second and subsequent children from the same family. Applies to school fees only.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View fee structure →</a>
          `}]},{category:"School Transport",icon:"🚌",color:"#ed8936",questions:[{question:"Does Kitale Progressive School provide school transport services in Kitale?",answer:`
            Yes, Kitale Progressive School provides safe and reliable school transport. Our school vans run Monday to Friday, with options for: Two-way (pick-up & drop-off) or One-way (pick-up only). Day scholars meet drivers during orientation and confirm van routes.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View transport facilities</a> | 
            <a href="/contact" class="text-navy fw-bold"> Contact transport office</a>
          `},{question:"Why do parents in Kitale prefer our school transport services?",answer:`
            <strong>Parents love our transport services because:</strong>
            <br/>
            ✔️ Child safety is our priority<br/>
            ✔️ Weatherproof – no walking in rain or dust<br/>
            ✔️ Guaranteed that your child gets home safely<br/>
            ✔️ Friendly drivers who know every child<br/>
            ✔️ Saves time and daily hassle
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact our transport office →</a>
          `},{question:"How much does school transport cost at Kitale Progressive School and which areas do you cover?",answer:`
            Transport fees vary depending on the distance from the school. To confirm if your area is covered and get the exact fee, please 
            <a href="/contact" class="text-navy fw-bold">contact our transport office</a> or share your location. Transport Fees are paid per term along with school fees.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View full fee structure →</a>
          `},{question:"What are the school start and end times for Kitale Progressive School?",answer:`
            School starts at 8:00 AM and ends at 5:00 PM from Monday to Friday. Check our full 
            <a href="/school-life/events" class="text-navy fw-bold">school calendar</a> for term dates, holidays, and special events.
          `}]},{category:"Parent Involvement & Communication",icon:"👪",color:"#38b2ac",questions:[{question:"How can parents get involved in school activities?",answer:`
            We encourage parent participation through: Parent-Teacher Association (PTA), volunteering for school events, career day presentations, fundraising activities, and attending parent-teacher conferences. We maintain a close parent-teacher partnership with regular academic clinics to keep you informed.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Join our PTA</a> and check our 
            <a href="/school-life/events" class="text-navy fw-bold">events calendar</a> for upcoming opportunities.
          `},{question:"How often are parent-teacher meetings held?",answer:`
            We hold formal parent-teacher conferences at the end of each term. However, parents can request meetings with teachers at any time by scheduling through the school office.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact the school office</a> to schedule a meeting.
          `},{question:"How will I receive updates about my child's progress?",answer:`
            We provide regular updates through: termly report cards, WhatsApp communication groups, newsletters, and text message alerts for urgent information. We also have regular academic clinics to keep you informed about your child's progress.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Update your contact information</a> to ensure you don't miss any communications.
          `}]},{category:"School Policies & Health",icon:"📜",color:"#667eea",questions:[{question:"What is the school uniform policy?",answer:`
            All students are required to wear the complete school uniform as outlined in the parent handbook. Uniforms are available at the school. Sports wear is required on designated days. A requirements checklist is issued for class items, boarding needs, and uniforms during admission.
            <br/><br/>
            Read our full <a href="/privacy-policy" class="text-navy fw-bold">uniform policy</a> and 
            <a href="/terms-of-service" class="text-navy fw-bold">terms of service</a> for more details.
          `},{question:"What is the discipline policy?",answer:`
            We follow a positive discipline approach that focuses on character development and restorative justice. We have chapel services for spiritual growth and strong focus on guidance, counselling, and holistic development. Our code of conduct outlines expected behaviors and consequences. Corporal punishment is strictly prohibited.
            <br/><br/>
            Review our <a href="/terms-of-service" class="text-navy fw-bold">code of conduct</a> for complete details.
          `},{question:"How do you handle medical emergencies?",answer:`
            In case of emergency, we immediately contact parents and transport the child to the nearest hospital. We have established relationships with Kitale County Hospital and other local medical facilities for quick response.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact our health office</a> for more information.
          `},{question:"What should I do if my child is sick?",answer:`
            For day scholars, please keep your child at home and inform the school. For boarders, our school matron provides initial care, and parents are contacted immediately for serious cases. We have a partnership with nearby hospitals for emergencies.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Report an absence here</a> or contact the school office directly.
          `}]}].map((e,r)=>(0,o.jsx)(g,{className:"mb-4",children:(0,o.jsx)(b,{lg:10,className:"mx-auto",children:(0,o.jsx)(y,{className:"border-0 shadow-sm overflow-hidden",children:(0,o.jsxs)(y.Body,{className:"p-0",children:[(0,o.jsx)("div",{style:{backgroundColor:e.color||"#132f66",padding:"1.5rem 2rem",color:"white"},children:(0,o.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[(0,o.jsx)("span",{style:{fontSize:"2.5rem"},children:e.icon}),(0,o.jsx)("h2",{style:{fontSize:"1.5rem",fontWeight:"bold",margin:0},children:e.category})]})}),(0,o.jsx)("div",{style:{padding:"1rem"},children:(0,o.jsx)(v,{flush:!0,children:e.questions.map((n,i)=>(0,o.jsxs)(v.Item,{eventKey:`${r}-${i}`,style:{border:"none",borderBottom:i<e.questions.length-1?"1px solid #e9ecef":"none"},children:[(0,o.jsx)(v.Header,{children:(0,o.jsx)("span",{style:{fontWeight:"500",color:"#2c3e50"},children:n.question})}),(0,o.jsx)(v.Body,{children:(0,o.jsx)("div",{dangerouslySetInnerHTML:{__html:n.answer},style:{lineHeight:"1.7",color:"#4a5568"}})})]},i))})})]})})})},r)),(0,o.jsx)(g,{className:"mt-5",children:(0,o.jsx)(b,{lg:8,className:"mx-auto",children:(0,o.jsx)(y,{className:"border-0 shadow-lg",style:{background:"linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)",color:"white"},children:(0,o.jsxs)(y.Body,{className:"p-5 text-center",children:[(0,o.jsx)("h3",{style:{fontSize:"1.8rem",fontWeight:"bold",marginBottom:"1rem"},children:"Still Have Questions?"}),(0,o.jsx)("p",{style:{fontSize:"1.1rem",marginBottom:"2rem",opacity:.95},children:"Our admissions team is happy to assist you with anything you need."}),(0,o.jsxs)("div",{style:{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"},children:[(0,o.jsx)("button",{onClick:t,style:{backgroundColor:"#cebd04",color:"#132f66",padding:"0.75rem 2rem",borderRadius:"40px",fontWeight:"600",border:"none",cursor:"pointer",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="#b09e03",e.target.style.transform="translateY(-2px)",e.target.style.boxShadow="0 4px 12px rgba(0,0,0,0.2)"},onMouseLeave:e=>{e.target.style.backgroundColor="#cebd04",e.target.style.transform="translateY(0)",e.target.style.boxShadow="none"},children:"Contact Us"}),(0,o.jsx)(p,{to:"/admissions/apply",style:{backgroundColor:"white",color:"#132f66",padding:"0.75rem 2rem",borderRadius:"40px",fontWeight:"600",textDecoration:"none",transition:"all 0.3s ease"},onMouseEnter:e=>{e.target.style.backgroundColor="#f8f9fa",e.target.style.transform="translateY(-2px)",e.target.style.boxShadow="0 4px 12px rgba(0,0,0,0.2)"},onMouseLeave:e=>{e.target.style.backgroundColor="white",e.target.style.transform="translateY(0)",e.target.style.boxShadow="none"},children:"Apply Now"})]})]})})})})]})}),(0,o.jsx)(s.Suspense,{fallback:null,children:(0,o.jsx)(D,{})}),(0,o.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        .accordion-button {
          background-color: white !important;
          color: #2c3e50 !important;
          padding: 1.25rem !important;
          font-weight: 500 !important;
        }
        .accordion-button:not(.collapsed) {
          background-color: #f8fafc !important;
          color: #132f66 !important;
          box-shadow: none !important;
        }
        .accordion-button:focus {
          box-shadow: none !important;
          border-color: #e9ecef !important;
        }
        .accordion-button::after {
          background-size: 1rem !important;
        }
        .accordion-body {
          padding: 1.5rem !important;
          background-color: #f8fafc !important;
        }
        .btn-hover-effect {
          transition: all 0.3s ease;
        }
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
          .hero-buttons a {
            width: 100%;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .btn-hover-effect,
          a,
          button {
            transition: none !important;
          }
          .btn-hover-effect:hover {
            transform: none !important;
          }
        }
      `}})]})}var J=(0,s.memo)(V);export{J as default};
