import { defineConfig } from 'tsdown';

// Two entry points: `index` is the programmatic API (importable, typed) and
// `cli` is the executable the `bin` field points at. The base config declares a
// single entry, so this package configures its own instead of extending it.
export default defineConfig({
  entry: {
    index: './src/index.ts',
    cli: './src/cli.ts',
  },
  dts: {
    // The bin has no importable surface; only emit declarations for the API.
    entry: './src/index.ts',
  },
  sourcemap: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
});
