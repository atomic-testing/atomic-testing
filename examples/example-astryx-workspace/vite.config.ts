import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Defaults to Vite's 5173; override with PORT for CI/parallel runs. `strictPort` makes
// a busy port fail fast instead of silently drifting to another one (which would let the
// Playwright `webServer` run against the wrong app).
const port = Number(process.env.PORT) || 5173;

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port, strictPort: true },
});
