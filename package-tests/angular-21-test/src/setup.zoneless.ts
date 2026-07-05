// Zoneless project setup: zone.js is deliberately NOT loaded, so
// createTestEngine must detect its absence and bootstrap with
// provideZonelessChangeDetection(). The JIT compiler is still required for the
// fixture's runtime-compiled inline templates.
import '@angular/compiler';
import { setChangeDetectionMode } from './changeDetectionMode';

setChangeDetectionMode('zoneless');
