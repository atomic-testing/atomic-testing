// Zoneless project setup: zone.js is deliberately NOT loaded, so
// createTestEngine must detect its absence and bootstrap with
// provideZonelessChangeDetection(). See setup.zone.ts for why the JIT
// compiler and the prebuilt theme are loaded.
import '@angular/compiler';
// Direct file path on purpose: @angular/material exports prebuilt themes only
// under the `style` condition, which Vite's JS-import resolution does not
// apply — the bare specifier fails to resolve.
import '../node_modules/@angular/material/prebuilt-themes/azure-blue.css';
