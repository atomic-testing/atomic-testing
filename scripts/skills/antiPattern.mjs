// Detects whether the `example-mui-signup-form` wizard has grown a single
// page-level driver that composes its step forms.
//
// INTENTIONALLY INVERTED CHECK. Today this example is the repo's canonical
// decomposition anti-pattern: each wizard step (CredentialForm, ShippingAddress,
// …) has its own feature driver, but there is NO page-object driver composing
// them — the step drivers are only ever exercised in isolation by per-step unit
// tests. The six-rule algorithm's rule 6 says a page/route should terminate in
// exactly one root ScenePart entry pointing to one thin page-object driver.
//
// So the harness asserts the gap STILL EXISTS (i.e. `findWizardPageObject`
// returns null). The moment someone fixes the example by adding a composing
// wizard driver, this detector returns non-null and the golden-fixtures check
// FAILS — which is the signal to (a) flip this assertion to require the page
// object, and (b) retire the "anti-pattern" framing in the docs decomposition
// guide. See scripts/skills/README.md.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { _internal } from './driverStructure.mjs';

/** The per-step feature drivers a real wizard page object would compose. */
export const SIGNUP_STEP_DRIVERS = [
  'CredentialFormDriver',
  'ShippingAddressFormDriver',
  'BillingAddressFormDriver',
  'InterestFormDriver',
  'SignupReviewDriver',
];

const SIGNUP_FORM_SRC = 'examples/example-mui-signup-form/src';

/** Recursively collect `.ts`/`.tsx` files under a directory. */
function collectSourceFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.tsx?$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Scan the signup-form example for a ScenePart object that composes two or more
 * step-form drivers — the tell-tale of a wizard page object.
 *
 * @param {string} repoRoot absolute path to the monorepo root
 * @returns {{ file: string, drivers: string[] } | null} the composing scene, or
 *   null when no single ScenePart references ≥2 step drivers (the current, gapped
 *   state).
 */
export function findWizardPageObject(repoRoot) {
  const srcDir = join(repoRoot, SIGNUP_FORM_SRC);
  for (const file of collectSourceFiles(srcDir)) {
    const code = _internal.stripComments(readFileSync(file, 'utf8'));
    for (const scene of _internal.findSceneObjects(code)) {
      const referenced = SIGNUP_STEP_DRIVERS.filter(d => new RegExp(`\\b${d}\\b`).test(scene.object));
      if (referenced.length >= 2) {
        return { file, drivers: referenced };
      }
    }
  }
  return null;
}
