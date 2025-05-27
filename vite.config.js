import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/instructors": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
