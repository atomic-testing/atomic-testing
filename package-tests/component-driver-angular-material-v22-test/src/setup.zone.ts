// Zone-based project setup: load zone.js BEFORE any @angular import, then the
// JIT compiler — the example components carry runtime-compiled inline
// templates, and Angular Material's partial-Ivy declarations also link at
// runtime through it. The prebuilt theme gives Material components their real
// styling so interactions run against realistic geometry.
import 'zone.js';
import '@angular/compiler';
// Direct file path on purpose: @angular/material exports prebuilt themes only
// under the `style` condition, which Vite's JS-import resolution does not
// apply — the bare specifier fails to resolve.
import '../node_modules/@angular/material/prebuilt-themes/azure-blue.css';
