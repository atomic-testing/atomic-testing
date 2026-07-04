// zone.js must load before any @angular import. The JIT compiler is required
// because the app (and Angular Material's partial-Ivy declarations) compile at
// runtime — there is no Angular build plugin in the Vite pipeline.
import 'zone.js';
import '@angular/compiler';
// Direct file path on purpose: @angular/material exports prebuilt themes only
// under the `style` condition, which Vite's JS-import resolution does not
// apply — the bare specifier fails to resolve.
import '../node_modules/@angular/material/prebuilt-themes/azure-blue.css';

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './AppComponent';

bootstrapApplication(AppComponent).catch(error => console.error(error));
