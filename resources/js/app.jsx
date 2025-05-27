import "../css/app.css";
import "./bootstrap";
//import "./echo";
import "../js/components/tempo/index.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// import Pusher from "pusher-js";
// // Initialize Pusher once
// window.Pusher = Pusher;
// window.pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
//     cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
//     forceTLS: true,
// });
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Optional: Expose globally if needed elsewhere
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    // authEndpoint: "/broadcasting/auth",
    // auth: {
    //     headers: {
    //         "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
    //             .content,
    //         Authorization: `Bearer ${localStorage.getItem("auth_token")}`, // For API
    //         Accept: "application/json",
    //     },   
    // },
});

createInertiaApp({
    title: (title) => `Calumpang Rural Health Unit`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <pusher />
                <App {...props} />
                <ToastContainer />
            </>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
