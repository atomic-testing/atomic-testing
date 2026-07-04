// Zone-based project setup: load zone.js BEFORE any @angular import, then the
// JIT compiler — the example components carry runtime-compiled inline
// templates, and Angular Material's partial-Ivy declarations also link at
// runtime through it. The prebuilt theme gives Material components their real
// styling so interactions run against realistic geometry.
import 'zone.js';
import '@angular/compiler';
import '@angular/material/prebuilt-themes/azure-blue.css';
