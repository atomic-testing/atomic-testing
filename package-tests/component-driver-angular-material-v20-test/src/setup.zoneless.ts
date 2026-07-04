// Zoneless project setup: zone.js is deliberately NOT loaded, so
// createTestEngine must detect its absence and bootstrap with
// provideZonelessChangeDetection(). See setup.zone.ts for why the JIT
// compiler and the prebuilt theme are loaded.
import '@angular/compiler';
import '@angular/material/prebuilt-themes/azure-blue.css';
