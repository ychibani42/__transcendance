import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    watch: {
      usePolling: true
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5173 // you can replace this port with any porr
  }
})