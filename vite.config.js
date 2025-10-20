import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    build: {
        target: 'es2022', // Support top-level await
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    pusher: ['pusher-js', 'laravel-echo']
                }
            }
        }
    },
    esbuild: {
        target: 'es2022'
    }
});
