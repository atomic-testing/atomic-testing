import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const port = 5129;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Assuming your source code is in the 'src' directory
    },
    // MUI X v9 + the React 19 adapter pull React through several workspace links;
    // dedupe keeps a single React copy so hooks don't throw "more than one copy of React".
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
