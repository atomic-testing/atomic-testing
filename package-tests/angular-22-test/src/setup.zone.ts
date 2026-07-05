// Zone-based project setup: load zone.js BEFORE any @angular import, then the
// JIT compiler (fixture components carry runtime-compiled inline templates).
import 'zone.js';
import '@angular/compiler';
import { setChangeDetectionMode } from './changeDetectionMode';

setChangeDetectionMode('zone');
