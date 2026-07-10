#!/usr/bin/env node
// Single source of truth for which packages under packages/ are part of the
// generated API reference, and how they're bucketed in navigation.
//
// WHY: before this module existed, docusaurus.config.ts owned the real
// EXCLUDED_FROM_DOCS set + package listing, sidebars.ts needed the same
// listing to build the API Reference sidebar, and check-doc-driver-sync.mjs
// re-derived EXCLUDED_FROM_DOCS by regex-parsing docusaurus.config.ts's
// source text. Three independent readings of the same fact drift silently.
// This module is the one place that fact lives; the other three import it.
//
// See issue #1088 for the framework/driver bucketing rationale.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagesRoot = path.resolve(__dirname, '..', '..', 'packages');

// Packages excluded from the generated API reference — e.g. a frozen/EOL
// package still in packages/ but no longer built, so TypeDoc can't resolve
// its cross-package types (see ADR-005 for the MUI 5 precedent). Currently
// empty: MUI 5 / MUI-X 5 were fully extracted to a separate repo (ADR-014)
// rather than frozen in place, so there's nothing to exclude right now.
export const EXCLUDED_FROM_DOCS = new Set([]);

// Every package directory under packages/ that's part of the generated API
// reference: real packages minus internal-* helpers minus EXCLUDED_FROM_DOCS.
export function getDocPackageNames() {
  return fs
    .readdirSync(packagesRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !name.startsWith('internal-') && !EXCLUDED_FROM_DOCS.has(name))
    .sort();
}

// component-driver-* packages document a per-component vocabulary of driver
// classes (10-80+ per package); everything else (core, dom-core, and one
// package per UI-framework major) is thin wiring around the Interactor
// interface (~1 Interactor class + a handful of functions/types). These are
// different reading modes, so they get separate sidebar categories.
export function classifyPackage(name) {
  return name.startsWith('component-driver-') ? 'driver' : 'framework';
}

export function getBucketedDocPackages() {
  const driver = [];
  const framework = [];
  for (const name of getDocPackageNames()) {
    (classifyPackage(name) === 'driver' ? driver : framework).push(name);
  }
  return { driver, framework };
}
