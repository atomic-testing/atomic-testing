import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const port = 3050;

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port,
    // Having strictPort set to true along with hmr port locked to the same port
    // would make sure hot-module-reload works properly
    strictPort: true,
    hmr: {
      port,
    },
  },
});
