import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const port = 5126;

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
  optimizeDeps: {
    // Works around a Rolldown dependency pre-bundling bug: @mui/material's
    // styles/index.js was landing in an auto-split shared chunk that calls
    // init_emotion_react_browser_development_esm() without importing it,
    // throwing a ReferenceError on every route (the same shared chunk is
    // imported correctly elsewhere, so this looks like a Rolldown bug in
    // per-chunk import-list generation, not an app code issue). Forcing all
    // of @emotion + @mui/material into one named chunk means every call site
    // shares a module scope with the init function's definition, so there's
    // no cross-chunk import to generate — and thus none to get lost.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'emotion-mui-vendor',
              test: /[\\/]node_modules[\\/](@emotion|@mui[\\/]material)[\\/]/,
            },
          ],
        },
      },
    },
  },
});
