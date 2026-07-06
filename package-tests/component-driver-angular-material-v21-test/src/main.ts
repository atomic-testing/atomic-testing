// zone.js must load before any @angular import. The JIT compiler is required
// because the app (and Angular Material's partial-Ivy declarations) compile at
// runtime — there is no Angular build plugin in the Vite pipeline.
import 'zone.js';
import '@angular/compiler';
// Direct file path on purpose: @angular/material exports prebuilt themes only
// under the `style` condition, which Vite's JS-import resolution does not
// apply — the bare specifier fails to resolve.
import '../node_modules/@angular/material/prebuilt-themes/azure-blue.css';
import { ANIMATION_MODULE_TYPE } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './AppComponent';

// Animations disabled for the same reason src/createTestEngine.ts disables
// them for the Vitest dom suites: Material's real CSS enter/exit animations
// are cleared only by a real `animationend`, which the e2e (Playwright) path
// can also race under load. See src/createTestEngine.ts for the full root
// cause and why this uses the ANIMATION_MODULE_TYPE token directly rather
// than `provideNoopAnimations()`.
bootstrapApplication(AppComponent, {
  providers: [{ provide: ANIMATION_MODULE_TYPE, useValue: 'NoopAnimations' }],
}).catch(error => console.error(error));
