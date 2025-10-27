import{j as t}from"./app-CZwS2G5Y.js";import"./vendor-DkBadjUr.js";import"./pusher-DVtoYAOu.js";const b=({title:o,subtitle:a,meta:n,data:c,columns:s,analytics:x})=>{const l=e=>{switch(e){case"Expired":return"status-expired";case"Critical Expiry":return"status-critical";case"Expiring Soon":return"status-expiring";case"Low Stock":return"status-low-stock";case"Out of Stock":return"status-out-of-stock";case"Overstocked":return"status-overstocked";default:return"status-active"}},d=e=>{switch(e){case"High":return"priority-high";case"Medium":return"priority-medium";case"Low":return"priority-low";default:return""}},p=e=>e<0||e<=7?"days-critical":e<=30?"days-warning":"days-safe",m=(e,r)=>e==="Status"?t.jsx("span",{className:l(r),children:r}):e==="Priority"?t.jsx("span",{className:d(r),children:r}):e==="Days Until Expiry"&&r!=="N/A"?t.jsx("span",{className:p(r),children:r}):e==="Current Stock"||e==="Minimum Stock"||e==="Maximum Stock"?new Intl.NumberFormat().format(r):r;return t.jsxs("div",{className:"inventory-summary-report",children:[t.jsx("style",{jsx:!0,children:`
                .inventory-summary-report {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #1e3a8a;
                }
                .subtitle {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #666;
                }
                .meta-info {
                    background: #f8f9fa;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-left: 4px solid #1e3a8a;
                }
                .meta-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 10px;
                }
                .meta-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                }
                .meta-label {
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                }
                th {
                    background: #1e3a8a;
                    color: white;
                    padding: 8px;
                    text-align: left;
                    font-size: 10px;
                }
                td {
                    padding: 6px 8px;
                    border-bottom: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .status-expired { color: #dc2626; font-weight: bold; }
                .status-critical { color: #dc2626; font-weight: bold; }
                .status-expiring { color: #d97706; font-weight: bold; }
                .status-low-stock { color: #ea580c; font-weight: bold; }
                .status-out-of-stock { color: #dc2626; font-weight: bold; }
                .status-overstocked { color: #2563eb; font-weight: bold; }
                .status-active { color: #16a34a; font-weight: bold; }
                .priority-high { color: #dc2626; font-weight: bold; }
                .priority-medium { color: #d97706; font-weight: bold; }
                .priority-low { color: #16a34a; font-weight: bold; }
                .days-critical { color: #dc2626; font-weight: bold; }
                .days-warning { color: #d97706; font-weight: bold; }
                .days-safe { color: #16a34a; }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                }
            `}),t.jsx("div",{className:"header",children:o}),t.jsx("div",{className:"subtitle",children:a}),t.jsx("div",{className:"meta-info",children:t.jsx("div",{className:"meta-grid",children:Object.entries(n).map(([e,r])=>t.jsxs("div",{className:"meta-item",children:[t.jsxs("span",{className:"meta-label",children:[e,":"]}),t.jsx("span",{children:r})]},e))})}),t.jsxs("table",{children:[t.jsx("thead",{children:t.jsx("tr",{children:Object.entries(s).map(([e,r])=>t.jsx("th",{children:r},e))})}),t.jsx("tbody",{children:c.map((e,r)=>t.jsx("tr",{children:Object.entries(s).map(([i,f])=>t.jsx("td",{children:m(i,e[i])},i))},r))})]}),t.jsxs("div",{className:"footer",children:[t.jsxs("p",{children:[t.jsx("strong",{children:"OFFICIAL DOCUMENT"})," - Generated on ",new Date().toLocaleString()]}),t.jsx("p",{children:"RURAL HEALTH UNIT CALUMPANG"})]})]})};export{b as default};
