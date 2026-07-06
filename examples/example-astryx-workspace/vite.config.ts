import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// A dedicated port (8088) that no other app in this monorepo uses, so every example and
// package-test app can run side by side without collision. Override with PORT for
// CI/parallel runs. `strictPort` makes a busy port fail fast instead of silently drifting
// to another one (which would let the Playwright `webServer` run against the wrong app).
const port = Number(process.env.PORT) || 8088;

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port, strictPort: true },
});
