// zone.js must load before any @angular import. The JIT compiler is required
// because the app (and Angular Material's partial-Ivy declarations) compile at
// runtime — there is no Angular build plugin in the Vite pipeline.
import 'zone.js';
import '@angular/compiler';
import '@angular/material/prebuilt-themes/azure-blue.css';

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './AppComponent';

bootstrapApplication(AppComponent).catch(error => console.error(error));
