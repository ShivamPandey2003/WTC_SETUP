import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // base:'/wtc/',
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // Dev only: apiService calls /api/* and Vite forwards it to the real API,
      // so the browser sees same-origin requests (no CORS, response headers readable).
      proxy: {
        "/api": {
          target: env.VITE_REACT_APP_API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
    },
  };
});
