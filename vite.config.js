import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 4173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      process.env.ALLOWED_HOST,
    ],
  },
});
