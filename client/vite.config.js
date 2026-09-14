import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: "all", // Development server ke liye saare hosts allow karega
  },
  preview: {
    allowedHosts: "all", // Production/Preview deployment ke liye host block hatayega
  },
});
