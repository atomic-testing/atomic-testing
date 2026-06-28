import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const port = 3020;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Assuming your source code is in the 'src' directory
    },
    // Astryx pulls in its own React via peer deps; dedupe so the app and the
    // component library share one React copy (a second copy breaks hooks with
    // "Invalid hook call" / null useContext).
    dedupe: ['react', 'react-dom'],
  },
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
