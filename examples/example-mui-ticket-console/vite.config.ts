import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// A dedicated port (8090) that no other app in this monorepo uses, so this example can run
// alongside every other example/package-test app. Override with PORT for CI/parallel runs.
// `strictPort` fails fast on a busy port instead of silently drifting to another one (which
// would let the Playwright `webServer` run against the wrong app).
const port = Number(process.env.PORT) || 8090;

// The atomic-testing packages are linked from the monorepo (see package.json `pnpm.overrides`),
// so React/Emotion can be resolved both from this app and from the linked packages. Dedupe them
// to a single copy or MUI's emotion cache and React's hooks break at runtime.
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'] },
  server: { port, strictPort: true },
});
