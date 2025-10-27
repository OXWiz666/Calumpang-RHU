import{j as e,H as ue,L as Y,r as G}from"./app-DbEHk-Y1.js";import{r as n,R as ge}from"./vendor-DkBadjUr.js";import{A as ve}from"./AdminLayout-Dn1LAAmD.js";import{C as W,a as J,b as K,c as Q}from"./card-CuNX9n6Z.js";import{B as l}from"./button-hTaAscVM.js";import{B as g}from"./badge-BjEm-iAn.js";import{I as X}from"./input-BfkVQ9Hy.js";import{T as f}from"./textarea-CgDPV80k.js";import{S as y,a as b,b as N,c as w,d as i}from"./select-DwW4yNtx.js";import{D as Z,a as ee,b as se,c as te}from"./dialog-CHHHHR8_.js";import{n as S}from"./index-WHihrx3k.js";import{m as D}from"./proxy-BRuk2j5t.js";import{A as je}from"./arrow-left-DcYYnBRL.js";import{F as fe}from"./filter-BAwJ6QQu.js";import{S as ye}from"./search-Cye_TdpF.js";import{S as L}from"./stethoscope-QcN9KdKi.js";import{F as be}from"./file-text-YZXa1D2L.js";import{P as Ne}from"./plus-MavOGQlj.js";import{C as we}from"./calendar-D9APQM2e.js";import{U as Se}from"./user-3RJR1iCA.js";import{E as De}from"./eye-mxYijkrE.js";import{S as ae}from"./square-pen-Bb1JtfBr.js";import{A as Ce,a as _e}from"./archive-BwGVl8jP.js";import{C as Pe}from"./chevron-left-B36-TXNE.js";import{C as Ae}from"./chevron-right-B3qqnx4D.js";import{P as ke}from"./printer-CfgcPaUh.js";import"./pusher-DVtoYAOu.js";import"./index-C-BhOzML.js";import"./avatar-C9EXpg1l.js";import"./react-icons.esm-DCEEl_mi.js";import"./separator-KL7v4q6k.js";import"./index-B7VWkaSA.js";import"./index-CeA5MDTz.js";import"./moment-C5S46NFB.js";import"./label-z6rUNhXe.js";import"./calendar-DCrMp8Ot.js";import"./index-B2NWmDAr.js";import"./tslib.es6-M_FJ09fS.js";import"./index-BZVXTTf6.js";import"./index-CUQ3XI0U.js";import"./format-Dp3w_Y3x.js";import"./isSameMonth-BOwz-_mK.js";import"./isBefore-Bnl9x5VB.js";import"./TextInput-Dos6RRW0.js";import"./createLucideIcon-BKWaAi2G.js";import"./x-b8JahagL.js";import"./settings-D_MeB5oN.js";import"./house-CSq-WFst.js";import"./users-D4PhO1-D.js";import"./pill-DIGxtF-3.js";import"./pusher-BR51OpoQ.js";import"./package-L7rgkkVO.js";import"./circle-check-big-BQVCuGNJ.js";import"./index-SmYPfogB.js";import"./autoprefixer-BHVjDhrs.js";import"./unit-CopbpOEH.js";import"./Toaster-BjJdaHbU.js";import"./toast-DwOpO9i-.js";import"./index-16Tu26i9.js";import"./index-C1y68Ddx.js";import"./use-toast-Dm0PN6fH.js";import"./layers-OK8ayVTK.js";import"./chart-column-yMaSKbSU.js";import"./index-DqxisvwK.js";function Is({diagnoses:T,patients:ie,services:Fe}){const[o,$]=n.useState(""),[x,z]=n.useState("all"),[h,R]=n.useState("all"),[p,M]=n.useState("all"),[d,H]=n.useState(1),[v]=n.useState(5),[t,C]=n.useState(null),[re,V]=n.useState(!1),[le,_]=n.useState(!1),[r,c]=n.useState({diagnosis:"",symptoms:"",treatment_plan:"",assessment:"",pertinent_findings:"",status:""}),m=T.filter(s=>{const a=o===""||s.patient_name?.toLowerCase().includes(o.toLowerCase())||s.diagnosis?.toLowerCase().includes(o.toLowerCase())||s.symptoms?.toLowerCase().includes(o.toLowerCase()),u=x==="all"||s.status===x,xe=h==="all"||s.patient_id===h;let j=!0;if(p!=="all"){const F=new Date(s.created_at),E=new Date;switch(p){case"today":j=F.toDateString()===E.toDateString();break;case"week":const he=new Date(E.getTime()-7*24*60*60*1e3);j=F>=he;break;case"month":const pe=new Date(E.getTime()-30*24*60*60*1e3);j=F>=pe;break}}return a&&u&&xe&&j}),U=Math.ceil(m.length/v),P=(d-1)*v,I=P+v,ne=m.slice(P,I);ge.useEffect(()=>{H(1)},[o,x,h,p]);const A=s=>{H(s)},oe=s=>{C(s),V(!0)},ce=s=>{C(s),c({diagnosis:s.diagnosis||"",symptoms:s.symptoms||"",treatment_plan:s.treatment_plan||"",assessment:s.assessment||s.notes||"",pertinent_findings:s.pertinent_findings||"",status:s.status||"active"}),_(!0)},O=()=>{_(!1),C(null),c({diagnosis:"",symptoms:"",treatment_plan:"",assessment:"",pertinent_findings:"",status:""})},me=s=>{s.preventDefault(),G.post(route("doctor.diagnosis.update",t.id),r,{onSuccess:()=>{S.success("Diagnosis updated successfully!"),O()},onError:a=>{console.error("Update errors:",a),S.error("Failed to update diagnosis. Please try again.")}})},q=s=>{const a=s.status==="archived"?"active":"archived";G.post(route("doctor.diagnosis.update",s.id),{status:a},{onSuccess:()=>{S.success(a==="archived"?"Diagnosis archived successfully!":"Diagnosis unarchived successfully!")},onError:u=>{console.error("Archive error:",u),S.error("Failed to update diagnosis status. Please try again.")}})},k=s=>new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),B=s=>{switch(s){case"active":return e.jsx(g,{className:"bg-green-100 text-green-800 border-green-200",children:"Active"});case"completed":return e.jsx(g,{className:"bg-blue-100 text-blue-800 border-blue-200",children:"Completed"});case"follow_up":return e.jsx(g,{className:"bg-yellow-100 text-yellow-800 border-yellow-200",children:"Follow-up Required"});case"archived":return e.jsx(g,{className:"bg-gray-100 text-gray-800 border-gray-200",children:"Archived"});default:return e.jsx(g,{className:"bg-gray-100 text-gray-800 border-gray-200",children:"Unknown"})}},de=s=>{const a=window.open("","_blank"),u=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Diagnosis Summary - ${s.patient_name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        color: #2563eb;
                        margin: 0;
                        font-size: 24px;
                    }
                    .header h2 {
                        color: #6b7280;
                        margin: 5px 0 0 0;
                        font-size: 16px;
                        font-weight: normal;
                    }
                    .section {
                        margin-bottom: 25px;
                        padding: 15px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        background-color: #f9fafb;
                    }
                    .section h3 {
                        color: #2563eb;
                        margin: 0 0 15px 0;
                        font-size: 18px;
                        border-bottom: 1px solid #d1d5db;
                        padding-bottom: 8px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 20px;
                    }
                    .info-item {
                        margin-bottom: 10px;
                    }
                    .info-label {
                        font-weight: bold;
                        color: #374151;
                        margin-bottom: 5px;
                    }
                    .info-value {
                        color: #111827;
                        padding: 8px;
                        background-color: white;
                        border-radius: 4px;
                        border: 1px solid #d1d5db;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: bold;
                        text-transform: uppercase;
                    }
                    .status-active {
                        background-color: #dcfce7;
                        color: #166534;
                    }
                    .status-completed {
                        background-color: #dbeafe;
                        color: #1e40af;
                    }
                    .status-follow_up {
                        background-color: #fef3c7;
                        color: #92400e;
                    }
                    .status-archived {
                        background-color: #f3f4f6;
                        color: #6b7280;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 2px solid #2563eb;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RHU Calumpang Management System</h1>
                    <h2>Diagnosis Summary Report</h2>
                </div>

                <div class="section">
                    <h3>Patient Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Patient Name</div>
                            <div class="info-value">${s.patient_name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">
                                <span class="status-badge status-${s.status}">${s.status.replace("_"," ")}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Date Created</div>
                            <div class="info-value">${k(s.created_at)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Doctor</div>
                            <div class="info-value">Dr. ${s.doctor_name}</div>
                        </div>
                        ${s.doctor_license_number?`
                        <div class="info-item">
                            <div class="info-label">License Number</div>
                            <div class="info-value">${s.doctor_license_number}</div>
                        </div>
                        `:""}
                    </div>
                </div>

                <div class="section">
                    <h3>Medical Diagnosis</h3>
                    <div class="info-item">
                        <div class="info-label">Diagnosis</div>
                        <div class="info-value">${s.diagnosis}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Symptoms</div>
                        <div class="info-value">${s.symptoms}</div>
                    </div>
                </div>

                ${s.treatment_plan?`
                <div class="section">
                    <h3>Treatment Plan</h3>
                    <div class="info-item">
                        <div class="info-value">${s.treatment_plan}</div>
                    </div>
                </div>
                `:""}

                ${s.assessment?`
                <div class="section">
                    <h3>Assessment</h3>
                    <div class="info-item">
                        <div class="info-value">${s.assessment}</div>
                    </div>
                </div>
                `:""}

                ${s.pertinent_findings?`
                <div class="section">
                    <h3>Pertinent Findings</h3>
                    <div class="info-item">
                        <div class="info-value">${s.pertinent_findings}</div>
                    </div>
                </div>
                `:""}

                <div class="footer">
                    <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
                    <p>RHU Calumpang Management System - Diagnosis Summary</p>
                </div>
            </body>
            </html>
        `;a.document.write(u),a.document.close(),a.focus(),a.print(),a.close()};return e.jsxs(ve,{header:"Diagnosis History",children:[e.jsx(ue,{title:"Diagnosis History"}),e.jsxs("div",{className:"space-y-6",children:[e.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6},className:"flex items-center justify-between",children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(Y,{href:route("doctor.home"),children:e.jsxs(l,{variant:"outline",size:"sm",children:[e.jsx(je,{className:"h-4 w-4 mr-2"}),"Back to Dashboard"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"Diagnosis History"}),e.jsx("p",{className:"text-gray-600",children:"View and manage patient diagnosis records"})]})]})}),e.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.2},children:e.jsxs(W,{children:[e.jsx(J,{children:e.jsxs(K,{className:"flex items-center gap-2",children:[e.jsx(fe,{className:"h-5 w-5"}),"Filters & Search"]})}),e.jsx(Q,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Search Diagnoses"}),e.jsxs("div",{className:"relative",children:[e.jsx(ye,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"}),e.jsx(X,{placeholder:"Search by patient name, diagnosis, symptoms, or treatment plan...",value:o,onChange:s=>$(s.target.value),className:"pl-10"})]}),e.jsx("p",{className:"text-xs text-gray-500",children:"Search across patient names, diagnosis, symptoms, and treatment plans"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Patient"}),e.jsxs(y,{value:h,onValueChange:R,children:[e.jsx(b,{children:e.jsx(N,{placeholder:"All Patients"})}),e.jsxs(w,{children:[e.jsx(i,{value:"all",children:"All Patients"}),ie?.map(s=>e.jsx(i,{value:s.id?.toString()||s.name,children:s.name},s.id||s.name))]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Status"}),e.jsxs(y,{value:x,onValueChange:z,children:[e.jsx(b,{children:e.jsx(N,{placeholder:"All Status"})}),e.jsxs(w,{children:[e.jsx(i,{value:"all",children:"All Status"}),e.jsx(i,{value:"active",children:"Active"}),e.jsx(i,{value:"completed",children:"Completed"}),e.jsx(i,{value:"follow_up",children:"Follow-up Required"}),e.jsx(i,{value:"archived",children:"Archived"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Date Range"}),e.jsxs(y,{value:p,onValueChange:M,children:[e.jsx(b,{children:e.jsx(N,{placeholder:"All Dates"})}),e.jsxs(w,{children:[e.jsx(i,{value:"all",children:"All Dates"}),e.jsx(i,{value:"today",children:"Today"}),e.jsx(i,{value:"week",children:"Last 7 Days"}),e.jsx(i,{value:"month",children:"Last 30 Days"}),e.jsx(i,{value:"year",children:"Last Year"})]})]})]})]}),e.jsxs("div",{className:"flex items-center justify-between pt-2 border-t",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:["Showing ",m.length," of ",T.length," diagnoses",(o||x!=="all"||h!=="all"||p!=="all")&&e.jsx("span",{className:"ml-2 text-blue-600",children:"(filtered)"})]}),e.jsx(l,{variant:"outline",size:"sm",onClick:()=>{$(""),z("all"),R("all"),M("all")},className:"text-gray-600",children:"Clear Filters"})]})]})})]})}),e.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.6,delay:.4},children:e.jsxs(W,{children:[e.jsx(J,{children:e.jsx(K,{className:"flex items-center justify-between",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(L,{className:"h-5 w-5"}),"Diagnosis Records (",m.length,")"]})})}),e.jsxs(Q,{children:[m.length===0?e.jsxs("div",{className:"text-center py-12",children:[e.jsx("div",{className:"p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center",children:e.jsx(be,{className:"h-8 w-8 text-gray-400"})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"No diagnoses found"}),e.jsx("p",{className:"text-gray-500 mb-4",children:o||x!=="all"||h!=="all"||p!=="all"?"Try adjusting your filters to see more results.":"Create your first diagnosis to get started."}),e.jsx(Y,{href:route("doctor.home"),children:e.jsxs(l,{children:[e.jsx(Ne,{className:"h-4 w-4 mr-2"}),"Create Diagnosis"]})})]}):e.jsx("div",{className:"space-y-4",children:ne.map((s,a)=>e.jsx(D.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:a*.1},className:"border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[e.jsx("div",{className:"p-2 rounded-lg bg-indigo-100",children:e.jsx(L,{className:"h-5 w-5 text-indigo-600"})}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold text-gray-900",children:s.diagnosis}),e.jsxs("p",{className:"text-sm text-gray-600",children:["Patient: ",s.patient_name]})]}),B(s.status)]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-1",children:"Symptoms"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.symptoms})]}),s.treatment_plan&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-1",children:"Treatment Plan"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.treatment_plan})]})]}),s.assessment&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-1",children:"Assessment"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.assessment})]}),s.pertinent_findings&&e.jsxs("div",{className:"mb-4",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-700 mb-1",children:"Pertinent Findings"}),e.jsx("p",{className:"text-sm text-gray-600",children:s.pertinent_findings})]}),e.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(we,{className:"h-4 w-4"}),k(s.created_at)]}),e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx(Se,{className:"h-4 w-4"}),"Dr. ",s.doctor_name]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 ml-4",children:[e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>oe(s),className:"text-blue-600 hover:text-blue-700 hover:bg-blue-50",children:[e.jsx(De,{className:"h-4 w-4 mr-1"}),"View Summary"]}),e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>ce(s),className:"text-green-600 hover:text-green-700 hover:bg-green-50",children:[e.jsx(ae,{className:"h-4 w-4 mr-1"}),"Edit"]}),s.status==="archived"?e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>q(s),className:"text-purple-600 hover:text-purple-700 hover:bg-purple-50",children:[e.jsx(Ce,{className:"h-4 w-4 mr-1"}),"Unarchive"]}):e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>q(s),className:"text-orange-600 hover:text-orange-700 hover:bg-orange-50",children:[e.jsx(_e,{className:"h-4 w-4 mr-1"}),"Archive"]})]})]})},s.id))}),m.length>v&&e.jsxs("div",{className:"flex items-center justify-between pt-6 border-t",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:["Showing ",P+1," to ",Math.min(I,m.length)," of ",m.length," diagnoses"]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>A(d-1),disabled:d===1,className:"flex items-center gap-1",children:[e.jsx(Pe,{className:"h-4 w-4"}),"Previous"]}),e.jsx("div",{className:"flex items-center gap-1",children:Array.from({length:U},(s,a)=>a+1).map(s=>e.jsx(l,{variant:d===s?"default":"outline",size:"sm",onClick:()=>A(s),className:`w-8 h-8 p-0 ${d===s?"bg-indigo-600 text-white":"hover:bg-gray-50"}`,children:s},s))}),e.jsxs(l,{variant:"outline",size:"sm",onClick:()=>A(d+1),disabled:d===U,className:"flex items-center gap-1",children:["Next",e.jsx(Ae,{className:"h-4 w-4"})]})]})]})]})]})}),e.jsx(Z,{open:re,onOpenChange:V,children:e.jsxs(ee,{className:"max-w-2xl",children:[e.jsx(se,{children:e.jsxs(te,{className:"flex items-center gap-2",children:[e.jsx(L,{className:"h-5 w-5"}),"Diagnosis Summary"]})}),t&&e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"flex justify-end mb-4",children:e.jsxs(l,{onClick:()=>de(t),className:"bg-blue-600 hover:bg-blue-700 text-white",children:[e.jsx(ke,{className:"h-4 w-4 mr-2"}),"Print Summary"]})}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Patient"}),e.jsx("p",{className:"text-sm text-gray-900",children:t.patient_name})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Status"}),e.jsx("div",{className:"mt-1",children:B(t.status)})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Diagnosis"}),e.jsx("p",{className:"text-sm text-gray-900 mt-1",children:t.diagnosis})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Symptoms"}),e.jsx("p",{className:"text-sm text-gray-900 mt-1",children:t.symptoms})]}),t.treatment_plan&&e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Treatment Plan"}),e.jsx("p",{className:"text-sm text-gray-900 mt-1",children:t.treatment_plan})]}),t.assessment&&e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Assessment"}),e.jsx("p",{className:"text-sm text-gray-900 mt-1",children:t.assessment})]}),t.pertinent_findings&&e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Pertinent Findings"}),e.jsx("p",{className:"text-sm text-gray-900 mt-1",children:t.pertinent_findings})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-4 border-t",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Created"}),e.jsx("p",{className:"text-sm text-gray-900",children:k(t.created_at)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Doctor"}),e.jsxs("p",{className:"text-sm text-gray-900",children:["Dr. ",t.doctor_name]}),t.doctor_license_number&&e.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["License Number: ",t.doctor_license_number]})]})]})]})]})}),e.jsx(Z,{open:le,onOpenChange:_,children:e.jsxs(ee,{className:"max-w-2xl",children:[e.jsx(se,{children:e.jsxs(te,{className:"flex items-center gap-2",children:[e.jsx(ae,{className:"h-5 w-5"}),"Edit Diagnosis"]})}),t&&e.jsxs("form",{onSubmit:me,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Patient"}),e.jsx("p",{className:"text-sm text-gray-900",children:t.patient_name})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Status"}),e.jsxs(y,{value:r.status,onValueChange:s=>c({...r,status:s}),children:[e.jsx(b,{children:e.jsx(N,{})}),e.jsxs(w,{children:[e.jsx(i,{value:"active",children:"Active"}),e.jsx(i,{value:"completed",children:"Completed"}),e.jsx(i,{value:"follow_up",children:"Follow-up Required"})]})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Diagnosis *"}),e.jsx(X,{value:r.diagnosis,onChange:s=>c({...r,diagnosis:s.target.value}),placeholder:"Enter diagnosis",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Symptoms *"}),e.jsx(f,{value:r.symptoms,onChange:s=>c({...r,symptoms:s.target.value}),placeholder:"Enter symptoms",rows:3,required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Treatment Plan"}),e.jsx(f,{value:r.treatment_plan,onChange:s=>c({...r,treatment_plan:s.target.value}),placeholder:"Enter treatment plan",rows:3})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Assessment"}),e.jsx(f,{value:r.assessment,onChange:s=>c({...r,assessment:s.target.value}),placeholder:"Enter assessment",rows:3})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Pertinent Findings"}),e.jsx(f,{value:r.pertinent_findings,onChange:s=>c({...r,pertinent_findings:s.target.value}),placeholder:"Enter pertinent findings",rows:3})]}),e.jsxs("div",{className:"flex justify-end gap-2 pt-4 border-t",children:[e.jsx(l,{type:"button",variant:"outline",onClick:O,children:"Cancel"}),e.jsx(l,{type:"submit",children:"Update Diagnosis"})]})]})]})})]})]})}export{Is as default};
