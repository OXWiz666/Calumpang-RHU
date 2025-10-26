import{j as e,r as ae}from"./app-Bz1k8fwb.js";import{r as o}from"./vendor-DkBadjUr.js";import{t as f,a as we}from"./toast-Cn-iRbzP.js";import{B as u}from"./button-BuxGVvE1.js";import{C as E}from"./circle-check-big-BQVCuGNJ.js";import{P as ie}from"./printer-CfgcPaUh.js";import{X as Se}from"./x-b8JahagL.js";import{B as ne}from"./building-2-DmPcAwng.js";import{C as ke}from"./clock-D6yUBuGv.js";import{F as D}from"./file-text-YZXa1D2L.js";import{P as k}from"./package-L7rgkkVO.js";import{C as Ce}from"./calendar-D9APQM2e.js";import{U as De}from"./user-3RJR1iCA.js";import{H as de}from"./hash-AgYeaIxt.js";import{S as Ie}from"./stethoscope-QcN9KdKi.js";import{D as Pe,a as Ae,b as $e,c as qe}from"./dialog-Nua2NsPT.js";import{I as Q}from"./input-Cxfo37eO.js";import{B as re}from"./badge-4-rsJP2l.js";import{C as Ee}from"./checkbox-Bh-x4r46.js";import{S as Te,a as Me,b as Re,c as ze,d as Fe}from"./select-CzkTuhTK.js";import{S as U}from"./shopping-cart-CMDRxEaq.js";import{S as le}from"./search-Cye_TdpF.js";import{m as Be}from"./proxy-Ciz88pZ8.js";import"./pusher-DVtoYAOu.js";import"./use-toast-Dm0PN6fH.js";import"./refresh-cw-D3hZ7e_O.js";import"./createLucideIcon-BKWaAi2G.js";import"./save-CAdd64LS.js";import"./square-pen-Bb1JtfBr.js";import"./download-BH8XyxCx.js";import"./trash-2-DJ5zXW8D.js";import"./archive-BwGVl8jP.js";import"./info-BVLwYIm5.js";import"./triangle-alert-BslwqqvL.js";import"./circle-x-Cf2XhiVO.js";import"./circle-check-F3PuHnLX.js";import"./index-Sbype2of.js";import"./react-icons.esm-CaEbm_m1.js";import"./index-CVzUxLnK.js";import"./tslib.es6-M_FJ09fS.js";import"./index-COj9XpJO.js";import"./index-DqxisvwK.js";import"./index-2C8mQqet.js";import"./index-C9cWDRNv.js";import"./index-C2K23d2_.js";import"./index-zhi7iPPU.js";import"./index-DFHF6qpL.js";const Le=({isOpen:T,onClose:I,dispenseData:r,mode:d="prescription"})=>{const w=o.useRef(null);if(!T||!r)return null;console.log("DispenseSummary dispenseData:",r),console.log("Dispensed items:",r.dispensed_items),r.dispensed_items&&r.dispensed_items.length>0&&(console.log("First item:",r.dispensed_items[0]),console.log("First item quantity:",r.dispensed_items[0].quantity));const _=()=>{const p=`
                <div class="print-container">
                    <!-- System Header -->
                    <div class="header">
                        <h1>RHU Calumpang Management System</h1>
                        <h2>Dispense Summary</h2>
                        <div class="generated-time">Generated on ${b(new Date)}</div>
                    </div>

                    <!-- Dispense Information -->
                    <div class="summary-section">
                        <div class="summary-title">Dispense Information</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Dispense Mode:</span>
                                <span class="info-value">${d}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Dispense Date:</span>
                                <span class="info-value">${b(r.dispense_date)}</span>
                            </div>
                            ${d==="prescription"?`
                                <div class="info-item">
                                    <span class="info-label">Patient:</span>
                                    <span class="info-value">${r.patient_name||"N/A"}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Case ID:</span>
                                    <span class="info-value">${r.case_id||"N/A"}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Doctor:</span>
                                    <span class="info-value">${r.doctor_name||"N/A"}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Prescription ID:</span>
                                    <span class="info-value">RX-${String(r.prescription_id).padStart(6,"0")}</span>
                                </div>
                            `:""}
                            ${d==="manual"&&r.reason_for_dispensing?`
                                <div class="info-item">
                                    <span class="info-label">Reason:</span>
                                    <span class="info-value">${r.reason_for_dispensing}</span>
                                </div>
                            `:""}
                        </div>
                    </div>

                    <!-- Dispensed Items -->
                    <div class="summary-section">
                        <div class="summary-title">Dispensed Items</div>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Batch Number</th>
                                    <th>Quantity</th>
                                    <th>Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${r.dispensed_items?.map(x=>`
                                    <tr>
                                        <td>${x.name}</td>
                                        <td>${x.batch_number}</td>
                                        <td>${x.quantity||x.qty||"N/A"}</td>
                                        <td>${x.expiry_date?new Date(x.expiry_date).toLocaleDateString():"N/A"}</td>
                                    </tr>
                                `).join("")||'<tr><td colspan="4">No items dispensed</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                    <!-- Transaction Summary -->
                    <div class="summary-section">
                        <div class="summary-title">Transaction Summary</div>
                        <div class="summary-stats">
                            <div class="stat-item">
                                <div class="stat-label">Total Items</div>
                                <div class="stat-value">${r.dispensed_items?.length||0}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Total Quantity</div>
                                <div class="stat-value">${r.dispensed_items?.reduce((x,y)=>x+(y.quantity||y.qty||0),0)||0}</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-label">Transaction Status</div>
                                <div class="stat-value">Completed</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <div class="system-name">RHU Calumpang Management System</div>
                        <div class="disclaimer">This is a computer-generated dispense summary. Generated on ${b(new Date)}</div>
                    </div>
                </div>
            `,j=window.open("","_blank","width=800,height=600"),g=j.document;g.open(),g.write(`
                <!DOCTYPE html>
            <html>
                <head>
                    <title>Dispense Summary - ${r.patient_name||"Manual Dispense"}</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        * { 
                            box-sizing: border-box; 
                            margin: 0; 
                            padding: 0; 
                        }
                        
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            margin: 0; 
                            padding: 0; 
                            background: white; 
                            font-size: 11pt;
                            line-height: 1.4;
                            color: #333;
                        }
                        
                        .print-container {
                            max-width: 100%;
                            margin: 0 auto;
                            padding: 0;
                        }
                        
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 4px solid #059669; 
                            padding-bottom: 25px; 
                            page-break-inside: avoid;
                            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                            padding: 25px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        
                        .header h1 { 
                            color: #059669; 
                            font-size: 20pt; 
                            margin: 0 0 10px 0; 
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
                        }
                        
                        .header h2 { 
                            color: #374151; 
                            font-size: 16pt; 
                            margin: 0 0 10px 0; 
                            font-weight: 600;
                        }
                        
                        .header .generated-time {
                            color: #6b7280;
                            font-size: 10pt;
                            font-weight: normal;
                        }
                        
                        .summary-section { 
                            margin-bottom: 20px; 
                            background: #f8fafc; 
                            padding: 15px; 
                            border: 1px solid #e2e8f0; 
                            border-radius: 6px;
                            page-break-inside: avoid;
                        }
                        
                        .summary-title { 
                            font-size: 12pt; 
                            font-weight: bold; 
                            margin-bottom: 12px; 
                            color: #1e293b; 
                            border-bottom: 1px solid #cbd5e1;
                            padding-bottom: 6px;
                        }
                        
                        .info-grid { 
                            display: grid; 
                            grid-template-columns: 1fr 1fr; 
                            gap: 15px; 
                            margin-bottom: 15px; 
                        }
                        
                        .info-item { 
                            margin-bottom: 8px; 
                            display: flex;
                            align-items: center;
                            gap: 8px;
                        }
                        
                        .info-label { 
                            font-weight: 600; 
                            color: #475569; 
                            font-size: 9pt; 
                            min-width: 80px;
                        }
                        
                        .info-value { 
                            color: #1e293b; 
                            font-size: 10pt; 
                            font-weight: 500;
                        }
                        
                        .items-table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px; 
                            background: white; 
                            font-size: 9pt;
                            border: 2px solid #374151;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        }
                        
                        .items-table th, .items-table td { 
                            border: 1px solid #6b7280; 
                            padding: 10px 8px; 
                            text-align: left; 
                            vertical-align: middle;
                        }
                        
                        .items-table th { 
                            background-color: #f1f5f9; 
                            font-weight: bold; 
                            color: #334155; 
                            font-size: 9pt;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        
                        .items-table tr:nth-child(even) { 
                            background-color: #f8fafc; 
                        }
                        
                        .items-table tr:hover {
                            background-color: #f1f5f9;
                        }
                        
                        .summary-stats {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 15px;
                            margin-top: 15px;
                        }
                        
                        .stat-item {
                            background: #f8fafc;
                            padding: 12px;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            text-align: center;
                        }
                        
                        .stat-label {
                            font-size: 9pt;
                            color: #64748b;
                            font-weight: 600;
                            margin-bottom: 4px;
                        }
                        
                        .stat-value {
                            font-size: 12pt;
                            color: #1e293b;
                            font-weight: bold;
                        }
                        
                        .footer { 
                            margin-top: 25px; 
                            text-align: center; 
                            font-size: 9pt; 
                            color: #64748b; 
                            background: #f1f5f9; 
                            padding: 12px; 
                            border-radius: 6px; 
                            border: 1px solid #e2e8f0;
                            page-break-inside: avoid;
                        }
                        
                        .footer .system-name {
                            font-weight: bold;
                            color: #059669;
                            margin-bottom: 4px;
                        }
                        
                        .footer .disclaimer {
                            font-size: 8pt;
                            color: #94a3b8;
                        }
                        
                        /* Print-specific styles */
                        @media print { 
                            body { 
                                margin: 0; 
                                padding: 0; 
                                font-size: 10pt;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            
                            .no-print { 
                                display: none !important; 
                            }
                            
                            .items-table { 
                                font-size: 8pt;
                                page-break-inside: avoid;
                            }
                            
                            .items-table th, .items-table td { 
                                padding: 6px 4px; 
                            }
                            
                            .summary-section {
                                page-break-inside: avoid;
                                margin-bottom: 15px;
                            }
                            
                            .header {
                                page-break-after: avoid;
                            }
                            
                            .footer {
                                page-break-before: avoid;
                            }
                            
                            /* Ensure proper spacing */
                            .print-container {
                                padding: 0;
                            }
                        }
                        
                        @page {
                            margin: 0.75in 0.5in;
                            size: A4;
                        }
                    </style>
                </head>
                <body>
                    ${p}
                </body>
            </html>
        `),g.close(),setTimeout(()=>{j.print()},100)},b=p=>new Date(p).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"});return e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-200",children:[e.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 text-white p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"bg-white bg-opacity-20 p-3 rounded-full",children:e.jsx(E,{className:"h-8 w-8 text-white"})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:"Dispense Summary"}),e.jsx("p",{className:"text-green-100 text-sm",children:"Transaction completed successfully"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs(u,{variant:"outline",size:"sm",onClick:_,className:"bg-white bg-opacity-20 border-white text-white hover:bg-white hover:text-green-700 flex items-center gap-2",children:[e.jsx(ie,{className:"h-4 w-4"}),"Print"]}),e.jsx(u,{variant:"ghost",size:"sm",onClick:I,className:"text-white hover:bg-white hover:bg-opacity-20",children:e.jsx(Se,{className:"h-5 w-5"})})]})]})}),e.jsx("div",{className:"p-8 overflow-y-auto max-h-[calc(95vh-200px)] bg-gray-50",children:e.jsxs("div",{ref:w,className:"dispense-summary",children:[e.jsxs("div",{className:"text-center mb-8 bg-white p-6 rounded-xl shadow-sm border",children:[e.jsxs("div",{className:"flex items-center justify-center gap-3 mb-4",children:[e.jsx(ne,{className:"h-8 w-8 text-green-600"}),e.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"RHU Calumpang Management System"})]}),e.jsx("h2",{className:"text-2xl font-semibold text-gray-700 mb-2",children:"Dispense Summary"}),e.jsxs("div",{className:"flex items-center justify-center gap-2 text-sm text-gray-600",children:[e.jsx(ke,{className:"h-4 w-4"}),"Generated on ",b(new Date)]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border p-6 mb-6",children:[e.jsxs("h3",{className:"text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[e.jsx(D,{className:"h-5 w-5 text-blue-600"}),"Dispense Information"]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-blue-100 p-2 rounded-lg",children:e.jsx(k,{className:"h-4 w-4 text-blue-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Dispense Mode"}),e.jsx("div",{className:"font-semibold text-gray-900 capitalize",children:d})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-green-100 p-2 rounded-lg",children:e.jsx(Ce,{className:"h-4 w-4 text-green-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Dispense Date"}),e.jsx("div",{className:"font-semibold text-gray-900",children:b(r.dispense_date)})]})]})]}),d==="prescription"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-purple-100 p-2 rounded-lg",children:e.jsx(De,{className:"h-4 w-4 text-purple-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Patient"}),e.jsx("div",{className:"font-semibold text-gray-900",children:r.patient_name})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-orange-100 p-2 rounded-lg",children:e.jsx(de,{className:"h-4 w-4 text-orange-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Case ID"}),e.jsx("div",{className:"font-semibold text-gray-900",children:r.case_id})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-indigo-100 p-2 rounded-lg",children:e.jsx(Ie,{className:"h-4 w-4 text-indigo-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Doctor"}),e.jsx("div",{className:"font-semibold text-gray-900",children:r.doctor_name||"N/A"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-red-100 p-2 rounded-lg",children:e.jsx(D,{className:"h-4 w-4 text-red-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Prescription ID"}),e.jsxs("div",{className:"font-semibold text-gray-900",children:["RX-",String(r.prescription_id).padStart(6,"0")]})]})]})]}),d==="manual"&&r.reason_for_dispensing&&e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"bg-yellow-100 p-2 rounded-lg",children:e.jsx(D,{className:"h-4 w-4 text-yellow-600"})}),e.jsxs("div",{children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Reason"}),e.jsx("div",{className:"font-semibold text-gray-900",children:r.reason_for_dispensing})]})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border p-6 mb-6",children:[e.jsxs("h3",{className:"text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[e.jsx(k,{className:"h-5 w-5 text-green-600"}),"Dispensed Items"]}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-50",children:[e.jsx("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Item Name"}),e.jsx("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Batch Number"}),e.jsx("th",{className:"px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Quantity"}),e.jsx("th",{className:"px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Expiry Date"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:r.dispensed_items?.map((p,j)=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-4 whitespace-nowrap",children:e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"bg-green-100 p-2 rounded-lg mr-3",children:e.jsx(k,{className:"h-4 w-4 text-green-600"})}),e.jsx("div",{className:"text-sm font-medium text-gray-900",children:p.name})]})}),e.jsx("td",{className:"px-4 py-4 whitespace-nowrap",children:e.jsx("span",{className:"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800",children:p.batch_number})}),e.jsx("td",{className:"px-4 py-4 whitespace-nowrap text-center",children:e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800",children:p.quantity||p.qty||"N/A"})}),e.jsx("td",{className:"px-4 py-4 whitespace-nowrap text-sm text-gray-900",children:p.expiry_date?new Date(p.expiry_date).toLocaleDateString():"N/A"})]},j))})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border p-6 mb-6",children:[e.jsxs("h3",{className:"text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[e.jsx(E,{className:"h-5 w-5 text-green-600"}),"Transaction Summary"]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsx("div",{className:"bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-medium text-blue-600",children:"Total Items"}),e.jsx("div",{className:"text-3xl font-bold text-blue-900",children:r.dispensed_items?.length||0})]}),e.jsx("div",{className:"bg-blue-200 p-3 rounded-full",children:e.jsx(k,{className:"h-6 w-6 text-blue-700"})})]})}),e.jsx("div",{className:"bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-medium text-green-600",children:"Total Quantity"}),e.jsx("div",{className:"text-3xl font-bold text-green-900",children:r.dispensed_items?.reduce((p,j)=>p+j.quantity,0)||0})]}),e.jsx("div",{className:"bg-green-200 p-3 rounded-full",children:e.jsx(E,{className:"h-6 w-6 text-green-700"})})]})}),e.jsx("div",{className:"bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-sm font-medium text-purple-600",children:"Transaction Status"}),e.jsx("div",{className:"text-lg font-bold text-purple-900",children:"Completed"})]}),e.jsx("div",{className:"bg-purple-200 p-3 rounded-full",children:e.jsx(E,{className:"h-6 w-6 text-purple-700"})})]})})]})]}),e.jsxs("div",{className:"bg-gray-50 rounded-xl p-6 text-center",children:[e.jsxs("div",{className:"flex items-center justify-center gap-2 text-sm text-gray-600 mb-2",children:[e.jsx(ne,{className:"h-4 w-4"}),e.jsx("span",{children:"RHU Calumpang Management System"})]}),e.jsxs("p",{className:"text-xs text-gray-500",children:["This is a computer-generated dispense summary. Generated on ",b(new Date)]})]})]})}),e.jsx("div",{className:"bg-white border-t border-gray-200 p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("div",{className:"text-sm text-gray-600",children:"Transaction completed successfully"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(u,{variant:"outline",onClick:I,className:"px-6 py-2",children:"Close"}),e.jsxs(u,{onClick:_,className:"flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2",children:[e.jsx(ie,{className:"h-4 w-4"}),"Print Summary"]})]})]})})]})})};function Ts({open:T,onClose:I,inventoryItems:r=[]}){const[d,w]=o.useState([]),[_,b]=o.useState(""),[p,j]=o.useState([]),[g,x]=o.useState({}),[y,H]=o.useState(""),[M,P]=o.useState(!1),[c,R]=o.useState("manual"),[O,A]=o.useState([]),[z,X]=o.useState(""),[n,C]=o.useState(null),[G,V]=o.useState(!1),[W,K]=o.useState(!1),[Y,v]=o.useState(""),[ce,J]=o.useState(!1),[oe,Z]=o.useState(null),[N,$]=o.useState(1),[q]=o.useState(10);o.useEffect(()=>{const s=r.filter(a=>{const i=a.name.toLowerCase().includes(_.toLowerCase())||(a.category?.name||"Uncategorized").toLowerCase().includes(_.toLowerCase()),t=(a.stock?.stocks||0)>0,l=a.status!==0,m=!a.expiry_date||new Date(a.expiry_date)>new Date;return t||console.log(`Filtered out ${a.name}: No stock (${a.stock?.stocks||0})`),l||console.log(`Filtered out ${a.name}: Archived`),!m&&a.expiry_date&&console.log(`Filtered out ${a.name}: Expired (${a.expiry_date})`),i&&t&&l&&m});console.log(`Filtered items: ${s.length} out of ${r.length}`),j(s),$(1)},[_,r]),o.useEffect(()=>{c==="prescription"&&O.length===0&&me()},[c]);const me=async()=>{V(!0);try{const s=route("pharmacist.inventory.prescriptions.case-ids"),a=await fetch(s,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||""},credentials:"same-origin"});if(a.ok){const i=await a.json();A(Array.isArray(i)?i:[])}else A([])}catch(s){console.error("Error loading Case IDs:",s),A([])}finally{V(!1)}},ee=async s=>{if(!s.trim()){v("Please select a CASE ID");return}K(!0),v("");try{const a=route("pharmacist.inventory.prescriptions.by-case",{caseId:encodeURIComponent(s.trim())}),i=await fetch(a,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json","X-Requested-With":"XMLHttpRequest","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")||""},credentials:"same-origin"});if(!i.ok){i.status===404?v("No prescription found for this CASE ID"):v("Failed to fetch prescription. Please try again."),C(null);return}const t=await i.json();if(t&&t.medicines&&t.medicines.length>0){console.log("Fetched prescription data:",t),C(t),v("");const l=t.medicines.map(h=>h.medicine_id),m=r.filter(h=>l.includes(h.id));w(m);const S={};m.forEach(h=>{const te=t.medicines.find(_e=>_e.medicine_id===h.id);S[h.id]=te?te.quantity:1}),x(S)}else v("No medicines found in this prescription"),C(null)}catch(a){console.error("Error fetching prescription by CASE ID:",a),v("Error searching prescription. Please try again."),C(null)}finally{K(!1)}};o.useEffect(()=>{const s={};d.forEach(a=>{g[a.id]?s[a.id]=g[a.id]:s[a.id]=1}),x(s)},[d]);const pe=(s,a)=>{a?w(i=>[...i,s]):(w(i=>i.filter(t=>t.id!==s.id)),x(i=>{const t={...i};return delete t[s.id],t}))},xe=(s,a)=>{const i=parseInt(a)||0,t=r.find(l=>l.id===s)?.stock?.stocks||0;i>t||x(l=>({...l,[s]:Math.max(0,i)}))},he=async()=>{if(d.length===0){f("No Items Selected","Please select at least one item to dispense.");return}if(c==="prescription"&&!n){f("Prescription Required","Please enter a valid CASE ID and search the prescription first.");return}if(c==="manual"&&!y.trim()){f("Reason Required","Please enter reason for dispensing.");return}const s=[];if(d.forEach(a=>{const i=g[a.id]||0,t=a.stock?.stocks||0;if(i<=0?s.push(`${a.name}: Quantity must be greater than 0 (entered: ${i})`):i>t&&s.push(`${a.name}: Insufficient stock (requested: ${i}, available: ${t})`),c==="prescription"&&n&&n.medicines){const l=n.medicines.find(m=>m.medicine_id===a.id);if(l){const m=l.quantity;t<m&&s.push(`${a.name}: Insufficient stock for prescription (required: ${m}, available: ${t})`)}}}),s.length>0){f("Validation Errors",s.join(`
`));return}P(!0);try{let a,i;if(c==="prescription"){if(a=d.map(t=>({item_id:t.id,quantity:g[t.id]||1,batch_number:t.batch_number||"N/A",expiry_date:t.expiry_date||null})),console.log("Validating prescription fields:",{patient_name:n.patient_name,case_id:n.case_id,id:n.id,patient_id:n.patient_id,doctor_id:n.doctor_id}),!n.patient_name||!n.case_id||!n.id||!n.patient_id){f("Missing Prescription Information","Missing required prescription information. Please search the prescription again."),console.error("Missing prescription fields:",{patient_name:!!n.patient_name,case_id:!!n.case_id,id:!!n.id,patient_id:!!n.patient_id}),P(!1);return}i={items:a,patient_name:n.patient_name,case_id:n.case_id,doctor_name:n.doctor_name||null,dispense_date:new Date().toISOString().split("T")[0],prescription_id:parseInt(n.id),patient_id:n.patient_id.toString(),doctor_id:n.doctor_id?parseInt(n.doctor_id):null}}else a=d.map(t=>({item_id:t.id,quantity:g[t.id]||1,batch_number:t.batch_number||"N/A",expiry_date:t.expiry_date||null})),i={items:a,reason_for_dispensing:y,dispense_date:new Date().toISOString().split("T")[0]};console.log("Bulk dispense request data:",i),console.log("Selected items:",d),console.log("Dispense quantities:",g),console.log("Case prescription:",n),console.log("Dispense mode:",c),console.log("Request data keys:",Object.keys(i)),console.log("Items array length:",i.items?i.items.length:"NO ITEMS"),i.items&&i.items.forEach((t,l)=>{console.log(`Item ${l}:`,{item_id:t.item_id,quantity:t.quantity,batch_number:t.batch_number,expiry_date:t.expiry_date})}),ae.post(route("pharmacist.inventory.dispense.bulk"),i,{onSuccess:t=>{console.log("Bulk dispense successful:",t);const l={dispense_date:i.dispense_date,mode:c,dispensed_items:d.map(m=>({name:m.name,batch_number:m.batch_number||"N/A",quantity:g[m.id]||1,expiry_date:m.expiry_date||null})),...c==="prescription"?{patient_name:i.patient_name,case_id:i.case_id,doctor_name:i.doctor_name,prescription_id:i.prescription_id}:{reason_for_dispensing:i.reason_for_dispensing}};console.log("Dispense Summary Data:",{mode:c,summaryData:l,requestData:i,casePrescription:n}),Z(l),J(!0),F(),we("Bulk Dispense Successful",`${c==="prescription"?"Prescription dispense":"Manual dispense"} completed successfully! ${d.length} item(s) dispensed.`,"update")},onError:t=>{if(console.error("Bulk dispense error:",t),t&&typeof t=="object"){const l=[];t.items&&l.push(`Items: ${Array.isArray(t.items)?t.items[0]:t.items}`),t.patient_name&&l.push(`Patient name: ${Array.isArray(t.patient_name)?t.patient_name[0]:t.patient_name}`),t.case_id&&l.push(`Case ID: ${Array.isArray(t.case_id)?t.case_id[0]:t.case_id}`),t.doctor_name&&l.push(`Doctor name: ${Array.isArray(t.doctor_name)?t.doctor_name[0]:t.doctor_name}`),t.dispense_date&&l.push(`Dispense date: ${Array.isArray(t.dispense_date)?t.dispense_date[0]:t.dispense_date}`),l.length>0?f("Validation Errors",l.join(", ")):f("Bulk Dispense Failed","Please check your inputs and try again.")}else typeof t=="string"?f("Bulk Dispense Error",t):f("Bulk Dispense Failed","An unexpected error occurred. Please try again.")},onFinish:()=>{P(!1)}})}catch(a){console.error("Bulk dispense error:",a),f("Bulk Dispense Error","An unexpected error occurred during bulk dispense. Please try again."),P(!1)}},F=()=>{w([]),x({}),H(""),b(""),R("manual"),A([]),X(""),C(null),v(""),I()},ge=s=>{const a=s.stock?.stocks||0,i=s.minimum_stock||10;return a===0?"out_of_stock":a<=i?"low_stock":"in_stock"},ue=s=>{switch(s){case"in_stock":return"bg-green-100 text-green-800 border-green-200";case"low_stock":return"bg-amber-100 text-amber-800 border-amber-200";case"out_of_stock":return"bg-red-100 text-red-800 border-red-200";default:return"bg-gray-100 text-gray-800 border-gray-200"}},fe=s=>{switch(s){case"in_stock":return"In Stock";case"low_stock":return"Low Stock";case"out_of_stock":return"Out of Stock";default:return"Unknown"}},be=d.reduce((s,a)=>s+(g[a.id]||0),0),B=Math.ceil(p.length/q),L=(N-1)*q,se=L+q,je=p.slice(L,se),ye=s=>{$(s)},ve=()=>{N>1&&$(N-1)},Ne=()=>{N<B&&$(N+1)};return e.jsxs(Pe,{open:T,onOpenChange:F,children:[e.jsxs(Ae,{className:"max-w-4xl max-h-[90vh] overflow-hidden",children:[e.jsx($e,{children:e.jsxs(qe,{className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-5 w-5 text-green-600"}),"Bulk Dispense Items"]})}),e.jsxs("div",{className:"space-y-6 overflow-y-auto max-h-[70vh]",children:[e.jsxs("div",{className:"p-4 bg-blue-50 rounded-lg",children:[e.jsx("h3",{className:"font-semibold text-gray-900 mb-3",children:"Dispense Mode"}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(u,{variant:c==="manual"?"default":"outline",onClick:()=>R("manual"),className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-4 w-4"}),"Manual Dispense"]}),e.jsxs(u,{variant:c==="prescription"?"default":"outline",onClick:()=>R("prescription"),className:"flex items-center gap-2",children:[e.jsx(D,{className:"h-4 w-4"}),"Prescription Mode"]})]})]}),c==="prescription"&&e.jsxs("div",{className:"p-4 bg-green-50 rounded-lg",children:[e.jsx("h3",{className:"font-semibold text-gray-900 mb-3",children:"Select CASE ID"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex gap-3",children:[e.jsx("div",{className:"flex-1",children:e.jsxs(Te,{value:z,onValueChange:s=>{X(s),ee(s)},disabled:G,children:[e.jsx(Me,{children:e.jsx(Re,{placeholder:G?"Loading Case IDs...":"Select a CASE ID to search prescription..."})}),e.jsx(ze,{children:O.map(s=>e.jsx(Fe,{value:s.case_id,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(de,{className:"h-4 w-4"}),e.jsx("span",{children:s.display_text}),e.jsxs("span",{className:"text-xs text-gray-500",children:["(",new Date(s.created_at).toLocaleDateString(),")"]})]})},s.case_id))})]})}),z&&e.jsx(u,{onClick:()=>ee(z),disabled:W,className:"bg-green-600 hover:bg-green-700",children:W?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"}),"Loading..."]}):e.jsxs(e.Fragment,{children:[e.jsx(le,{className:"h-4 w-4 mr-2"}),"Search"]})})]}),Y&&e.jsx("div",{className:"p-3 bg-red-50 border border-red-200 rounded-lg",children:e.jsx("p",{className:"text-red-600 text-sm",children:Y})}),n&&e.jsxs("div",{className:"p-3 bg-white rounded-lg border",children:[e.jsx("h4",{className:"font-medium text-gray-900 mb-2",children:"Prescription Details"}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"Patient:"}),e.jsx("span",{className:"ml-2 font-medium",children:n.patient_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"Doctor:"}),e.jsx("span",{className:"ml-2 font-medium",children:n.doctor_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"Case ID:"}),e.jsx("span",{className:"ml-2 font-medium",children:n.case_id||"N/A"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-600",children:"Medicines:"}),e.jsx("span",{className:"ml-2 font-medium",children:n.medicines?.length||0})]})]}),n.medicines&&n.medicines.length>0&&e.jsxs("div",{className:"mt-3",children:[e.jsx("h5",{className:"text-sm font-medium text-gray-700 mb-2",children:"Required Medicines:"}),e.jsx("div",{className:"space-y-1",children:n.medicines.map((s,a)=>e.jsxs("div",{className:"text-xs text-gray-600 flex justify-between",children:[e.jsx("span",{children:s.medicine_name||"Unknown Medicine"}),e.jsxs("span",{className:"font-medium",children:[s.quantity," units"]})]},a))})]})]})]})]}),c==="manual"&&e.jsx("div",{className:"p-4 bg-gray-50 rounded-lg",children:e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Reason for Dispensing *"}),e.jsx(Q,{value:y,onChange:s=>H(s.target.value),placeholder:"Enter reason for dispensing (e.g., Emergency supply, Stock transfer, etc.)",className:"w-full",required:!0})]})}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(le,{className:"absolute left-3 top-3 h-4 w-4 text-gray-400"}),e.jsx(Q,{placeholder:"Search items...",value:_,onChange:s=>b(s.target.value),className:"pl-10"})]}),e.jsxs(re,{variant:"outline",className:"text-sm",children:[d.length," selected"]})]}),e.jsx("div",{className:"space-y-2 max-h-96 overflow-y-auto",children:p.length===0?e.jsxs("div",{className:"text-center py-8 text-gray-500",children:[e.jsx(k,{className:"h-12 w-12 mx-auto mb-4 text-gray-300"}),e.jsx("p",{className:"text-lg font-medium",children:"No valid items available"}),e.jsx("p",{className:"text-sm",children:"All items are either out of stock, archived, or expired"})]}):je.map(s=>{const a=d.some(h=>h.id===s.id),i=ge(s),t=s.stock?.stocks||0,l=c==="prescription"&&n&&n.medicines?n.medicines.find(h=>h.medicine_id===s.id):null,m=l?l.quantity:0,S=m===0||t>=m;return e.jsx(Be.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:`p-4 border rounded-lg transition-all ${a?"border-green-500 bg-green-50":!S&&c==="prescription"?"border-red-300 bg-red-50":"border-gray-200 hover:border-gray-300"}`,children:e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(Ee,{checked:a,onCheckedChange:h=>pe(s,h),className:"h-4 w-4",disabled:!S&&c==="prescription"}),e.jsx("div",{className:"flex-1",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(k,{className:"h-5 w-5 text-gray-600"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-gray-900",children:s.name}),e.jsxs("p",{className:"text-sm text-gray-500",children:[s.category?.name||"Uncategorized"," • Available: ",t," ",s.unit_type||"pieces",m>0&&e.jsxs("span",{className:"ml-2 text-blue-600 font-medium",children:["(Prescription needs: ",m,")"]})]}),!S&&c==="prescription"&&e.jsx("p",{className:"text-sm text-red-600 font-medium mt-1",children:"⚠️ Insufficient stock for prescription requirement"})]})]})}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(re,{className:ue(i),children:fe(i)}),a&&e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Q,{type:"number",min:"1",max:t,value:g[s.id]||1,onChange:h=>xe(s.id,h.target.value),className:"w-20 text-center"}),e.jsx("span",{className:"text-sm text-gray-500",children:s.unit_type||"pieces"})]})]})]})},s.id)})}),p.length>q&&e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-gray-50 border-t",children:[e.jsx("div",{className:"flex items-center gap-2 text-sm text-gray-600",children:e.jsxs("span",{children:["Showing ",L+1," to ",Math.min(se,p.length)," of ",p.length," items"]})}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(u,{variant:"outline",size:"sm",onClick:ve,disabled:N===1,className:"px-3 py-1",children:"Previous"}),e.jsx("div",{className:"flex items-center gap-1",children:Array.from({length:B},(s,a)=>a+1).map(s=>e.jsx(u,{variant:N===s?"default":"outline",size:"sm",onClick:()=>ye(s),className:"w-8 h-8 p-0",children:s},s))}),e.jsx(u,{variant:"outline",size:"sm",onClick:Ne,disabled:N===B,className:"px-3 py-1",children:"Next"})]})]}),d.length>0&&e.jsxs("div",{className:"p-4 bg-blue-50 border border-blue-200 rounded-lg",children:[e.jsx("h4",{className:"font-medium text-blue-900 mb-2",children:"Dispense Summary"}),e.jsxs("div",{className:"space-y-1 text-sm text-blue-800",children:[e.jsxs("p",{children:["Total Items: ",d.length]}),e.jsxs("p",{children:["Total Quantity: ",be]}),c==="manual"?e.jsxs("p",{children:["Reason: ",y||"Not specified"]}):e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:["Patient: ",n?.patient_name||"Not specified"]}),e.jsxs("p",{children:["Case ID: ",n?.case_id||"Not specified"]})]})]})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-3 pt-4 border-t",children:[e.jsx(u,{variant:"outline",onClick:F,disabled:M,children:"Cancel"}),e.jsx(u,{onClick:he,disabled:d.length===0||c==="manual"&&!y||c==="prescription"&&!n||M,className:"bg-green-600 hover:bg-green-700",children:M?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"}),"Processing..."]}):e.jsx(e.Fragment,{children:c==="prescription"?e.jsxs(e.Fragment,{children:[e.jsx(D,{className:"h-4 w-4 mr-2"}),"Dispense ",d.length," Items"]}):e.jsxs(e.Fragment,{children:[e.jsx(U,{className:"h-4 w-4 mr-2"}),"Dispense ",d.length," Items"]})})})]})]}),e.jsx(Le,{isOpen:ce,onClose:()=>{J(!1),Z(null),ae.visit(window.location.pathname,{method:"get"})},dispenseData:oe,mode:c})]})}export{Ts as default};
