import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  rollupOptions: {
    external: ["react", "react-router", "react-router-dom"],
    output: {
      globals: {
        react: "React",
      },
    },
  },
})
