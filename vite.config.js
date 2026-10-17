import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Custom plugin to auto-reload when Gacha images are added/removed
const watchGachaFolderPlugin = () => {
  return {
    name: 'watch-gacha-folder',
    configureServer(server) {
      server.watcher.add('public/img/Gacha/**')
      server.watcher.on('add', (file) => {
        if (file.replace(/\\/g, '/').includes('public/img/Gacha')) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      })
      server.watcher.on('unlink', (file) => {
        if (file.replace(/\\/g, '/').includes('public/img/Gacha')) {
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(), watchGachaFolderPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
});
