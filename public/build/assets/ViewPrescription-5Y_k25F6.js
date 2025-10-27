import{j as e,H as f,L as j}from"./app-CZwS2G5Y.js";import"./vendor-DkBadjUr.js";import{A as v}from"./AdminLayout-BdMzZsyd.js";import{B as m}from"./button-BesobgtA.js";import{C as n,a as l,b as r,c as d}from"./card-CRUoSCLq.js";import{B as a}from"./badge-ChpTVm3n.js";import{A as u}from"./arrow-left-DcYYnBRL.js";import{P as N}from"./printer-CfgcPaUh.js";import{U as b}from"./user-3RJR1iCA.js";import{F as y}from"./file-text-YZXa1D2L.js";import{P as c}from"./pill-DIGxtF-3.js";import{C as x}from"./circle-check-big-BQVCuGNJ.js";import{C as p}from"./clock-D6yUBuGv.js";import{C as w}from"./circle-x-Cf2XhiVO.js";import"./pusher-DVtoYAOu.js";import"./index-B3OEEYC6.js";import"./avatar-DEV84UVA.js";import"./react-icons.esm-Bo4nchVy.js";import"./separator-6iJRufmK.js";import"./index-Bgkzuaxa.js";import"./index-DWou3t1m.js";import"./select-Cxat1dCU.js";import"./index-BL_R5CeI.js";import"./index-VaCZcEHj.js";import"./tslib.es6-M_FJ09fS.js";import"./index-hcl4Lfqn.js";import"./index-Dg-CcdeN.js";import"./index-DqxisvwK.js";import"./index-C0yHodGM.js";import"./moment-C5S46NFB.js";import"./dialog-Tf1FOk7X.js";import"./input-BuSGIsg0.js";import"./label-IliVNXtj.js";import"./calendar-LRnVXR3S.js";import"./format-Dp3w_Y3x.js";import"./isSameMonth-BOwz-_mK.js";import"./isBefore-Bnl9x5VB.js";import"./TextInput-BgmIWbMp.js";import"./createLucideIcon-BKWaAi2G.js";import"./x-b8JahagL.js";import"./settings-D_MeB5oN.js";import"./house-CSq-WFst.js";import"./calendar-D9APQM2e.js";import"./users-D4PhO1-D.js";import"./pusher-qs61TsAX.js";import"./package-L7rgkkVO.js";import"./index-0fk0WGfz.js";import"./proxy-C0TaRtDf.js";import"./autoprefixer-Bonhs1zv.js";import"./unit-CopbpOEH.js";import"./Toaster-BpbevUrA.js";import"./toast-T3VyHObl.js";import"./use-toast-Dm0PN6fH.js";import"./layers-OK8ayVTK.js";import"./chart-column-yMaSKbSU.js";function Ce({prescription:s}){const h=t=>{switch(t){case"pending":return e.jsxs(a,{variant:"outline",className:"text-yellow-600 border-yellow-600",children:[e.jsx(p,{className:"h-3 w-3 mr-1"}),"Pending"]});case"dispensed":return e.jsxs(a,{variant:"outline",className:"text-green-600 border-green-600",children:[e.jsx(x,{className:"h-3 w-3 mr-1"}),"Dispensed"]});case"cancelled":return e.jsxs(a,{variant:"outline",className:"text-red-600 border-red-600",children:[e.jsx(w,{className:"h-3 w-3 mr-1"}),"Cancelled"]});default:return e.jsx(a,{variant:"outline",children:t})}},g=()=>{const t=window.open("","_blank"),o=`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Prescription - ${s.prescription_number}</title>
                <style>
                    @page {
                        size: A4;
                        margin: 0.5in;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        margin: 0;
                        padding: 0;
                        background: #fff;
                        color: #333;
                    }
                    .prescription-header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 10px;
                    }
                    .doctor-name {
                        font-weight: bold;
                        font-size: 14pt;
                        text-transform: uppercase;
                        margin-bottom: 5px;
                    }
                    .clinic-info {
                        font-size: 11pt;
                        margin-bottom: 3px;
                    }
                    .patient-info {
                        display: flex;
                        justify-content: space-between;
                        margin: 20px 0;
                        border-bottom: 1px solid #000;
                        padding-bottom: 10px;
                    }
                    .patient-left {
                        flex: 1;
                    }
                    .patient-right {
                        flex: 1;
                        margin-left: 20px;
                    }
                    .patient-field {
                        display: flex;
                        margin-bottom: 8px;
                    }
                    .patient-label {
                        font-weight: bold;
                        width: 80px;
                        margin-right: 10px;
                    }
                    .patient-value {
                        border-bottom: 1px solid #000;
                        flex: 1;
                        padding-bottom: 2px;
                        font-style: italic;
                    }
                    .prescription-content {
                        padding: 25px;
                        background: #fff;
                        min-height: 250px;
                    }
                    .rx-symbol {
                        font-size: 32pt;
                        font-weight: 900;
                        margin-right: 20px;
                        display: inline-block;
                        vertical-align: top;
                        color:rgb(0, 0, 0);
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                        font-family: 'Georgia', serif;
                    }
                    .medicine-item {
                        margin-bottom: 15px;
                        display: flex;
                        align-items: flex-start;
                    }
                    .medicine-details {
                        flex: 1;
                    }
                    .medicine-name {
                        font-weight: bold;
                        font-style: italic;
                        margin-bottom: 3px;
                    }
                    .medicine-instructions {
                        font-style: italic;
                        margin-top: 5px;
                    }
                    .medicine-quantity {
                        font-weight: bold;
                        margin-left: 10px;
                    }
                    .doctor-signature {
                        margin-top: 50px;
                        text-align: right;
                        padding: 20px;
                        background: #f8fafc;
                        border-top: 2px solid #e5e7eb;
                    }
                    .signature-line {
                        border-bottom: 2px solid rgb(0, 0, 0);
                        width: 250px;
                        margin: 25px 0 10px auto;
                        height: 2px;
                    }
                    .doctor-credentials {
                        text-align: right;
                        font-size: 11pt;
                        margin-top: 8px;
                    }
                    .doctor-credentials strong {
                        color: rgb(0, 0, 0);
                        font-size: 12pt;
                    }
                    .license-info {
                        font-size: 9pt;
                        margin-top: 8px;
                        color: #6b7280;
                        line-height: 1.4;
                    }
                    .prescription-date {
                        text-align: right;
                        margin-bottom: 20px;
                        font-size: 10pt;
                        color: #6b7280;
                        font-weight: 500;
                    }
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none; }
                        .prescription-container { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="prescription-header">
                        <div class="doctor-name">${s.doctor.name}</div>
                        <div class="clinic-info">Calumpang Rural Health Unit</div>
                        <div class="clinic-info">Calumpang, General Santos City</div>
                        <div class="clinic-info">Tel No: (083) 554-0146</div>
                    </div>

                    <div class="patient-info">
                        <div class="patient-left">
                            <div class="patient-field">
                                <span class="patient-label">Name:</span>
                                <span class="patient-value">${s.patient.name}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Address:</span>
                                <span class="patient-value">${s.patient.address||"N/A"}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Date:</span>
                                <span class="patient-value">${s.prescription_date}</span>
                            </div>
                        </div>
                        <div class="patient-right">
                            <div class="patient-field">
                                <span class="patient-label">Sex:</span>
                                <span class="patient-value">${s.patient.gender||"N/A"}</span>
                            </div>
                            <div class="patient-field">
                                <span class="patient-label">Age:</span>
                                <span class="patient-value">${s.patient.age||"N/A"}</span>
                            </div>
                        </div>
                    </div>

                    <div class="prescription-content">
                        <div class="prescription-date">Prescription #${s.prescription_number}</div>
                        <div class="rx-symbol">Rx</div>
                        <div style="display: inline-block; width: calc(100% - 80px);">
                            ${s.medicines.map(i=>`
                                <div class="medicine-item">
                                    <div class="medicine-details">
                                        <div class="medicine-name">
                                            ${i.medicine.name} ${i.medicine.generic_name?`(${i.medicine.generic_name})`:""}
                                        </div>
                                        <div class="medicine-instructions">
                                            ${i.frequency} ${i.duration} ${i.instructions?`- ${i.instructions}`:""}
                                        </div>
                                    </div>
                                    <div class="medicine-quantity">${i.quantity}</div>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="doctor-signature">
                        <div class="signature-line"></div>
                        <div class="doctor-credentials">
                            <strong>Dr. ${s.doctor.name}</strong><br>
                            <div class="license-info">
                                Lic. No: ${s.doctor.license_number||"N/A"}
                            </div>
                        </div>
                    </div>
            </body>
            </html>
        `;t.document.write(o),t.document.close(),t.focus(),t.print(),t.close()};return e.jsxs(v,{header:"Prescription Details",children:[e.jsx(f,{title:`Prescription ${s.prescription_number}`}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(j,{href:route("doctor.prescriptions"),children:e.jsxs(m,{variant:"outline",size:"sm",className:"flex items-center gap-2",children:[e.jsx(u,{className:"h-4 w-4"}),"Back to Prescriptions"]})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:s.prescription_number}),e.jsx("p",{className:"text-gray-600",children:"Prescription Details"})]})]}),s.status==="dispensed"&&e.jsxs(m,{onClick:g,className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700",children:[e.jsx(N,{className:"h-4 w-4"}),"Print Prescription"]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsxs(n,{children:[e.jsx(l,{children:e.jsxs(r,{className:"flex items-center gap-2",children:[e.jsx(b,{className:"h-5 w-5"}),"Patient Information"]})}),e.jsxs(d,{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Name"}),e.jsx("p",{className:"font-medium",children:s.patient.name})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Date of Birth"}),e.jsx("p",{className:"font-medium",children:s.patient.date_of_birth})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Age"}),e.jsx("p",{className:"font-medium",children:s.patient.age})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Gender"}),e.jsx("p",{className:"font-medium capitalize",children:s.patient.gender})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Contact"}),e.jsx("p",{className:"font-medium",children:s.patient.contact_number})]})]})]}),e.jsxs(n,{children:[e.jsx(l,{children:e.jsxs(r,{className:"flex items-center gap-2",children:[e.jsx(y,{className:"h-5 w-5"}),"Prescription Details"]})}),e.jsxs(d,{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Prescription Number"}),e.jsx("p",{className:"font-medium",children:s.prescription_number})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Date"}),e.jsx("p",{className:"font-medium",children:s.prescription_date})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Status"}),e.jsx("div",{className:"mt-1",children:h(s.status)})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Doctor"}),e.jsx("p",{className:"font-medium",children:s.doctor.name})]}),s.dispensed_at&&e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Dispensed At"}),e.jsx("p",{className:"font-medium",children:s.dispensed_at})]})]})]}),e.jsxs(n,{children:[e.jsx(l,{children:e.jsxs(r,{className:"flex items-center gap-2",children:[e.jsx(c,{className:"h-5 w-5"}),"Summary"]})}),e.jsxs(d,{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Total Medicines"}),e.jsx("p",{className:"text-2xl font-bold text-blue-600",children:s.medicines.length})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Dispensed"}),e.jsx("p",{className:"text-2xl font-bold text-green-600",children:s.medicines.filter(t=>t.is_dispensed).length})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-gray-600",children:"Pending"}),e.jsx("p",{className:"text-2xl font-bold text-yellow-600",children:s.medicines.filter(t=>!t.is_dispensed).length})]})]})]})]}),e.jsxs(n,{children:[e.jsx(l,{children:e.jsxs(r,{className:"flex items-center gap-2",children:[e.jsx(c,{className:"h-5 w-5"}),"Prescribed Medicines"]})}),e.jsx(d,{children:s.medicines.length===0?e.jsxs("div",{className:"text-center py-8 text-gray-500",children:[e.jsx(c,{className:"h-12 w-12 mx-auto mb-4 text-gray-400"}),e.jsx("p",{children:"No medicines prescribed"})]}):e.jsx("div",{className:"space-y-4",children:s.medicines.map((t,o)=>e.jsx("div",{className:"border rounded-lg p-4 bg-gray-50",children:e.jsx("div",{className:"flex items-start justify-between",children:e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("h4",{className:"font-semibold text-gray-900",children:t.medicine.name}),t.is_dispensed?e.jsxs(a,{variant:"outline",className:"text-green-600 border-green-600",children:[e.jsx(x,{className:"h-3 w-3 mr-1"}),"Dispensed"]}):e.jsxs(a,{variant:"outline",className:"text-yellow-600 border-yellow-600",children:[e.jsx(p,{className:"h-3 w-3 mr-1"}),"Pending"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600",children:"Frequency"}),e.jsx("p",{className:"font-medium",children:t.frequency})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600",children:"Duration"}),e.jsx("p",{className:"font-medium",children:t.duration})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600",children:"Quantity"}),e.jsxs("p",{className:"font-medium",children:[t.quantity," ",t.medicine.unit]})]})]}),t.instructions&&e.jsxs("div",{className:"mt-3",children:[e.jsx("p",{className:"text-gray-600 text-sm",children:"Instructions"}),e.jsx("p",{className:"text-sm italic",children:t.instructions})]})]})})},t.id))})})]}),s.notes&&e.jsxs(n,{children:[e.jsx(l,{children:e.jsx(r,{children:"Additional Notes"})}),e.jsx(d,{children:e.jsx("p",{className:"text-gray-700 whitespace-pre-wrap",children:s.notes})})]})]})]})}export{Ce as default};
