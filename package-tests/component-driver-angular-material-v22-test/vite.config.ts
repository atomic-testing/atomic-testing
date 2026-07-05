import { defineConfig } from 'vite';

const port = 5222;

// No Angular build plugin: the example app is JIT-compiled at runtime
// (src/main.ts loads @angular/compiler), so Vite's esbuild transform only has
// to handle the (legacy) decorators, which it picks up from the root
// tsconfig's `experimentalDecorators`. Angular Material ships partial-Ivy
// declarations, which the JIT compiler links at runtime for the same reason —
// mirroring the package-tests/angular-*-test fixtures.
export default defineConfig({
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
