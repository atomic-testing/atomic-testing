import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const port = 5128;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Assuming your source code is in the 'src' directory
    },
    // This app renders ExampleApp/ExampleList from the internal-react-example
    // workspace package, which resolves its own React 19 while this MUI X v6-era
    // app is pinned to React 18. Without dedupe, Vite serves both copies and every
    // hook throws "Cannot read properties of null (reading 'useContext')" — which
    // jsdom never sees, because the dom tests import the components directly
    // rather than through the dev server.
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
