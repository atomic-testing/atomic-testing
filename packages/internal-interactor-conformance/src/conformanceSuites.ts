import {
  byDataTestId,
  byLinkedElement,
  ElementNotFoundErrorId,
  InteractorErrorBase,
  LocatorResolutionErrorId,
} from '@atomic-testing/core';
import { TestSuiteInfo, useTestEngine } from '@atomic-testing/internal-test-runner';

import { conformanceScenePart } from './conformanceFixture';

/**
 * Bound an interactor's fast-fail behavior. `DOMInteractor` answers a
 * missing-element read instantly, but `PlaywrightInteractor` auto-waits for
 * actionability; a genuinely-absent element would otherwise hang to the action
 * timeout. The read primitives are all fixed to short-circuit on absence
 * (#1047), and mutations translate to `ElementNotFoundError` only after the
 * timeout — so cap it low for the one mutation-on-absent assertion. jsdom has no
 * `page` and ignores this.
 */
function boundAutoWait(interactor: unknown): void {
  const withPage = interactor as { page?: { setDefaultTimeout(ms: number): void } };
  withPage.page?.setDefaultTimeout(2000);
}

async function captureError(run: () => Promise<unknown>): Promise<Error | undefined> {
  try {
    await run();
    return undefined;
  } catch (e) {
    return e as Error;
  }
}

/**
 * Interactor conformance suite (TCK). The same specs run under every
 * `TestFrameworkMapper` (Jest, Playwright), proving each interactor honors the
 * one contract jsdom defines (ADR-006). The cases encode the corrected,
 * jsdom-conforming behavior of the four `PlaywrightInteractor` read-path defects
 * fixed in #1047, plus error-hierarchy conformance (ADR-010).
 *
 * NOT covered here — the `runInteraction` template-method seam (#1052) is now
 * mechanically verified white-box in
 * `packages/dom-core/__tests__/runInteractionRouting.dom.test.ts`, which asserts
 * every mutating primitive routes through the seam exactly once (and reads do
 * not). That routing is invisible to this black-box TCK, so it lives there
 * rather than here.
 */
export const interactorConformanceSuite: TestSuiteInfo<typeof conformanceScenePart> = {
  title: 'Interactor conformance (TCK)',
  url: '/interactor-conformance',
  tests: (getTestEngine, { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse }) => {
    const engine = useTestEngine(conformanceScenePart, getTestEngine, { beforeEach, afterEach });
    const interactor = () => engine().interactor;
    const absent = byDataTestId('definitely-absent');

    // Defect 1: a read on a missing element returns the same undefined/false the
    // DOM yields, instead of Playwright auto-waiting and throwing TimeoutError.
    describe('missing element reads', () => {
      test('getText / getAttribute / getInputValue return undefined', async () => {
        assertEqual(await interactor().getText(absent), undefined);
        assertEqual(await interactor().getAttribute(absent, 'id'), undefined);
        assertEqual(await interactor().getInputValue(absent), undefined);
      });

      test('boolean state reads return false', async () => {
        assertFalse(await interactor().isChecked(absent));
        assertFalse(await interactor().isDisabled(absent));
        assertFalse(await interactor().isReadonly(absent));
        assertFalse(await interactor().isRequired(absent));
        assertFalse(await interactor().isError(absent));
        assertFalse(await interactor().hasAttribute(absent, 'id'));
        assertFalse(await interactor().hasCssClass(absent, 'anything'));
        assertFalse(await interactor().isVisible(absent));
      });
    });

    // Defect 3: a locator matching multiple elements resolves to the first,
    // matching querySelector, instead of a Playwright strict-mode violation.
    describe('multiple matches resolve to the first', () => {
      const dup = byDataTestId('dup');

      test('getText reads the first match', async () => {
        assertEqual(await interactor().getText(dup), 'first');
      });

      test('getAttribute reads the first match', async () => {
        assertEqual(await interactor().getAttribute(dup, 'data-order'), 'first');
      });
    });

    // Defect 2: getInputValue on a non-input element yields undefined rather than
    // Playwright's "Node is not an <input>" throw; a real input still reads back.
    describe('input value reads', () => {
      test('reads the value of an <input>', async () => {
        assertEqual(await interactor().getInputValue(byDataTestId('text-input')), 'typed');
      });

      test('returns undefined for a non-input element', async () => {
        assertEqual(await interactor().getInputValue(byDataTestId('not-input')), undefined);
      });
    });

    // Defect 4: a selected <option> with no value attribute yields its text (the
    // value IDL property's spec fallback), instead of being silently dropped.
    describe('select with a value-less selected option', () => {
      const select = byDataTestId('valueless-select');

      test('getSelectValues falls back to the option text', async () => {
        assertEqual(await interactor().getSelectValues(select), ['Apple']);
      });

      test('getSelectLabels returns the option text', async () => {
        assertEqual(await interactor().getSelectLabels(select), ['Apple']);
      });

      test('getSelectValues / getSelectLabels return undefined for a missing element', async () => {
        assertEqual(await interactor().getSelectValues(absent), undefined);
        assertEqual(await interactor().getSelectLabels(absent), undefined);
      });

      test('getSelectValues / getSelectLabels return undefined for a non-<select> element', async () => {
        const notSelect = byDataTestId('not-input');
        assertEqual(await interactor().getSelectValues(notSelect), undefined);
        assertEqual(await interactor().getSelectLabels(notSelect), undefined);
      });
    });

    // Ancestor visibility (#1053): isVisible must walk the ancestor chain, not
    // inspect the target element alone. display:none / opacity:0 are not
    // inherited, so a descendant of a hidden ancestor keeps its own non-hidden
    // computed values — the divergence a black-box TCK exists to catch, since it
    // reproduces identically under jsdom and a real browser.
    describe('ancestor visibility', () => {
      test('a plain element with no hidden ancestor is visible', async () => {
        assertTrue(await interactor().isVisible(byDataTestId('visible-target')));
      });

      test('an element inside a display:none ancestor is not visible', async () => {
        assertFalse(await interactor().isVisible(byDataTestId('hidden-by-ancestor-display')));
      });

      test('an element inside an opacity:0 ancestor is not visible', async () => {
        assertFalse(await interactor().isVisible(byDataTestId('hidden-by-ancestor-opacity')));
      });
    });

    // Element count (#1054): getElementCount counts by locator match, not by tag
    // position among siblings. The fixture list holds three matching items plus a
    // same-tag (`<li>`) non-item sibling, so a tag-based count would answer 4 —
    // this locks the "counts by match, not tag" behavior identically under jsdom
    // and a real browser (where it resolves to Playwright's `locator.count()`).
    describe('element count', () => {
      test('counts every element matching the locator, ignoring same-tag non-items', async () => {
        assertEqual(await interactor().getElementCount(byDataTestId('count-item')), 3);
      });

      test('a locator matching a single element counts 1', async () => {
        assertEqual(await interactor().getElementCount(byDataTestId('count-list')), 1);
      });

      test('a locator matching nothing counts 0', async () => {
        assertEqual(await interactor().getElementCount(absent), 0);
      });
    });

    // Error-class conformance (ADR-010): interactor-level failures share one
    // catchable hierarchy across every environment.
    describe('error hierarchy', () => {
      test('a mutation on a missing element throws ElementNotFoundError', async () => {
        boundAutoWait(interactor());
        const error = await captureError(() => interactor().click(absent));
        assertEqual(error?.name, ElementNotFoundErrorId);
        assertTrue(error instanceof InteractorErrorBase);
      });

      test('an unresolvable linked locator throws LocatorResolutionError', async () => {
        // The linked locator's match target is absent, so it cannot be reduced to
        // a CSS selector — surfacing #1051's dedicated error rather than a bare Error.
        const brokenLinkedLocator = byLinkedElement()
          .onLinkedElement(absent)
          .extractAttribute('for')
          .toMatchMyAttribute('id');
        const error = await captureError(() => interactor().exists(brokenLinkedLocator));
        assertEqual(error?.name, LocatorResolutionErrorId);
        assertTrue(error instanceof InteractorErrorBase);
      });
    });
  },
};

export const interactorConformanceSuites = [interactorConformanceSuite];
