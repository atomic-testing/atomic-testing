import { resolve } from 'node:path';

import {
  byCssSelector,
  byDataTestId,
  byLinkedElement,
  ElementNotFoundErrorId,
  InteractorErrorBase,
  LocatorResolutionErrorId,
  PartLocator,
  WaitForFailureErrorId,
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
 * Fixtures resolve relative to `process.cwd()`: both the Jest and Playwright
 * legs are launched from `package-tests/internal-interactor-conformance-test`
 * (see CLAUDE.md's "Running E2E Tests"), so `process.cwd()` is the portable
 * anchor — the identical technique
 * `package-tests/component-driver-html-test/src/examples/fileUpload/FileUpload.suite.ts`
 * uses. `DOMInteractor` never reads these bytes (`setInputFiles` wraps an empty
 * `File` named by basename), but `PlaywrightInteractor`'s native
 * `setInputFiles` reads real files from disk, so they must exist for the e2e leg.
 */
function fixtureFile(name: string): string {
  return resolve(process.cwd(), 'fixtures', name);
}

/**
 * A `[data-testid="..."]:focus` selector, used as an `exists()` probe for
 * "is this element currently focused" (see the `pressKey` / `focus` / `blur`
 * tests below).
 *
 * `:focus` is plain selector MATCHING against `document.activeElement`, which
 * jsdom's selector engine implements correctly — unlike `getStyleValue`
 * (`getComputedStyle`), which in jsdom reflects only inline styles and does NOT
 * apply stylesheet-rule cascade, so a `:focus` rule's declared style is
 * invisible there even on a genuinely-focused element. Matching is therefore
 * the one cross-engine-reliable way to observe focus through the black-box
 * `Interactor` surface.
 */
function focusedLocator(testId: string): PartLocator {
  return byCssSelector(`[data-testid="${testId}"]:focus`);
}

/**
 * Interactor conformance suite (TCK). The same specs run under every
 * `TestFrameworkMapper` (Jest, Playwright), proving each interactor honors the
 * one contract jsdom defines (ADR-006). The cases encode the corrected,
 * jsdom-conforming behavior of the four `PlaywrightInteractor` read-path defects
 * fixed in #1047, plus error-hierarchy conformance (ADR-010), plus (#973) the
 * full ~41-method `Interactor` surface across every capability facet
 * (`PointerActions`, `KeyboardActions`, `FocusActions`, `FormActions`,
 * `ScrollActions`, `Waiter`, `ElementQueries`).
 *
 * Layout/geometry assertions are gated on `hasLayout` (jsdom has no layout
 * engine — see each such block below); event-dispatch-only primitives with no
 * native or CSS-observable side effect (the plain mouse events, drag) are
 * verified against the "throw-vs-auto-wait convention" instead: they resolve
 * without throwing once the target is found, and throw `ElementNotFoundError`
 * when it is not — the same convention the pre-existing `click`-on-absent case
 * established.
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
  tests: (
    getTestEngine,
    { describe, test, beforeEach, afterEach, assertEqual, assertTrue, assertFalse, assertApproxEqual, hasLayout }
  ) => {
    const engine = useTestEngine(conformanceScenePart, getTestEngine, { beforeEach, afterEach });
    const interactor = () => engine().interactor;
    const absent = byDataTestId('definitely-absent');

    /** Assert a mutation throws the shared `ElementNotFoundError` for a missing target. */
    async function assertElementNotFound(action: () => Promise<unknown>): Promise<void> {
      boundAutoWait(interactor());
      const error = await captureError(action);
      assertEqual(error?.name, ElementNotFoundErrorId);
      assertTrue(error instanceof InteractorErrorBase);
    }

    /** Assert an action resolves without throwing once its target is found. */
    async function assertResolves(action: () => Promise<unknown>): Promise<void> {
      const error = await captureError(action);
      assertEqual(error, undefined);
    }

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
        await assertElementNotFound(() => interactor().click(absent));
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

    // #973 — PointerActions: click gets a working positive case (the prior
    // suite only exercised its error path); the remaining raw event-dispatch
    // primitives have no native or CSS-observable effect without application
    // JS (the fixture is deliberately script-free — see conformanceFixture.ts),
    // so they are verified against the throw-vs-auto-wait convention: resolve
    // once found, throw ElementNotFoundError when not.
    describe('click', () => {
      const target = byDataTestId('click-checkbox');

      test('a click on a checkbox toggles its checked state', async () => {
        assertFalse(await interactor().isChecked(target));
        await interactor().click(target);
        assertTrue(await interactor().isChecked(target));
      });
    });

    describe('pointer event dispatch (mouseMove/mouseDown/mouseUp/mouseOver/mouseOut/mouseEnter/mouseLeave/hover)', () => {
      const target = byDataTestId('present');

      test('mouseMove resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseMove(target));
        await assertElementNotFound(() => interactor().mouseMove(absent));
      });

      test('mouseDown resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseDown(target));
        await assertElementNotFound(() => interactor().mouseDown(absent));
      });

      test('mouseUp resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseUp(target));
        await assertElementNotFound(() => interactor().mouseUp(absent));
      });

      test('mouseOver resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseOver(target));
        await assertElementNotFound(() => interactor().mouseOver(absent));
      });

      test('mouseOut resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseOut(target));
        await assertElementNotFound(() => interactor().mouseOut(absent));
      });

      test('mouseEnter resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseEnter(target));
        await assertElementNotFound(() => interactor().mouseEnter(absent));
      });

      test('mouseLeave resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().mouseLeave(target));
        await assertElementNotFound(() => interactor().mouseLeave(absent));
      });

      test('hover resolves for a present element and throws for a missing one', async () => {
        await assertResolves(() => interactor().hover(target));
        await assertElementNotFound(() => interactor().hover(absent));
      });
    });

    describe('contextMenu', () => {
      test('dispatches a contextmenu event on a present element without throwing', async () => {
        await assertResolves(() => interactor().contextMenu(byDataTestId('present')));
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().contextMenu(absent));
      });
    });

    // activate is coordinate-free: it reaches a visually-hidden, covered
    // control that a positional click's hit-test would miss (the canonical
    // case documented on PointerActions.activate, e.g. MUI Rating's hidden
    // radio) — the fixture's `activate-target` reproduces exactly that shape.
    describe('activate', () => {
      const target = byDataTestId('activate-target');

      test('activates a visually-hidden, covered control', async () => {
        assertFalse(await interactor().isChecked(target));
        await interactor().activate(target);
        assertTrue(await interactor().isChecked(target));
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().activate(absent));
      });
    });

    describe('dragTo', () => {
      const source = byDataTestId('drag-source');
      const target = byDataTestId('drag-target');

      test('resolves once both the source and target are found', async () => {
        await assertResolves(() => interactor().dragTo(source, target));
      });

      test('throws ElementNotFoundError when the source is missing', async () => {
        await assertElementNotFound(() => interactor().dragTo(absent, target));
      });

      test('throws ElementNotFoundError when the target is missing', async () => {
        await assertElementNotFound(() => interactor().dragTo(source, absent));
      });
    });

    describe('drag', () => {
      const target = byDataTestId('drag-source');

      test('resolves once the element is found', async () => {
        await assertResolves(() => interactor().drag(target, { x: 10, y: 10 }));
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().drag(absent, { x: 10, y: 10 }));
      });
    });

    // #973 — KeyboardActions. pressKey's own documented contract is "the
    // element is focused first" — observed via the `:focus` selector probe
    // (see `focusedLocator` above) rather than any typed value, since a real
    // browser's native default action for a printable key on a focused TEXT
    // input inserts the character (a trusted key event does that), while jsdom
    // never performs default actions for its synthetic events — so a text
    // target's resulting VALUE is not a safe cross-engine assertion, but the
    // FOCUS transfer is (both interactors call the real DOM focus API).
    describe('pressKey', () => {
      const target = byDataTestId('key-target');
      const focused = focusedLocator('key-target');

      test('focuses the element first, matching a real key press', async () => {
        assertFalse(await interactor().exists(focused));
        await interactor().pressKey(target, 'a');
        assertTrue(await interactor().exists(focused));
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().pressKey(absent, 'a'));
      });
    });

    // #973 — FocusActions, observed via the same :focus selector probe.
    describe('focus / blur', () => {
      const target = byDataTestId('focus-target');
      const focused = focusedLocator('focus-target');

      test('focus moves focus onto the element', async () => {
        assertFalse(await interactor().exists(focused));
        await interactor().focus(target);
        assertTrue(await interactor().exists(focused));
      });

      test('blur removes focus from the element', async () => {
        await interactor().focus(target);
        assertTrue(await interactor().exists(focused));
        await interactor().blur(target);
        assertFalse(await interactor().exists(focused));
      });

      test('focus throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().focus(absent));
      });

      test('blur throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().blur(absent));
      });
    });

    // #973 — FormActions.
    describe('enterText', () => {
      const target = byDataTestId('enter-text-target');

      test('clears and fills the target by default', async () => {
        await interactor().enterText(target, 'hello');
        assertEqual(await interactor().getInputValue(target), 'hello');
        await interactor().enterText(target, 'world');
        assertEqual(await interactor().getInputValue(target), 'world');
      });

      test('appends instead of replacing when append is true', async () => {
        await interactor().enterText(target, 'hello');
        await interactor().enterText(target, ' world', { append: true });
        assertEqual(await interactor().getInputValue(target), 'hello world');
      });

      // The null-vs-empty convention: a PRESENT element with an empty value
      // reads back as '' — contrast with the "missing element reads" block
      // above, where an ABSENT element reads back as undefined.
      test('an empty string is a pure clear, leaving the value an empty string (not undefined)', async () => {
        await interactor().enterText(target, 'hello');
        await interactor().enterText(target, '');
        assertEqual(await interactor().getInputValue(target), '');
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().enterText(absent, 'x'));
      });
    });

    describe('typeText', () => {
      const target = byDataTestId('type-text-target');

      test('types literal per-character keystrokes without clearing the existing value', async () => {
        await interactor().typeText(target, 'ab');
        assertEqual(await interactor().getInputValue(target), 'ab');
        await interactor().typeText(target, 'cd');
        assertEqual(await interactor().getInputValue(target), 'abcd');
      });

      test('types brace characters literally rather than as a descriptor', async () => {
        await interactor().typeText(target, '{a}');
        assertEqual(await interactor().getInputValue(target), '{a}');
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().typeText(absent, 'x'));
      });
    });

    describe('setRangeValue', () => {
      const target = byDataTestId('range-input'); // min=0 max=20 step=5

      test('sets an on-step value identically in both engines', async () => {
        await interactor().setRangeValue(target, 10);
        assertEqual(await interactor().getInputValue(target), '10');
      });

      // jsdom performs no range sanitization at all, so an off-step value is
      // stored verbatim — the "zero-rect under jsdom" of setRangeValue.
      if (!hasLayout) {
        test('jsdom has no range sanitization: an off-step value is stored verbatim', async () => {
          await interactor().setRangeValue(target, 7);
          assertEqual(await interactor().getInputValue(target), '7');
        });
      }

      // A real browser snaps to the nearest valid step (0, 5, 10, 15, 20); 7 is
      // strictly closer to 5 than to 10, so the snapped value is unambiguous.
      if (hasLayout) {
        test('a real browser snaps an off-step value to the nearest step', async () => {
          await interactor().setRangeValue(target, 7);
          assertEqual(await interactor().getInputValue(target), '5');
        });
      }

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().setRangeValue(absent, 5));
      });
    });

    describe('selectOptionValue / multi-select reads', () => {
      const target = byDataTestId('multi-select');

      // The null-vs-empty convention, select edition: a select that EXISTS but
      // has nothing chosen reads as [] — contrast with the "missing element"
      // case above (getSelectValues/getSelectLabels on `absent` -> undefined).
      test('a multi-select with nothing chosen reads as an empty array (not undefined)', async () => {
        assertEqual(await interactor().getSelectValues(target), []);
        assertEqual(await interactor().getSelectLabels(target), []);
      });

      test('selecting multiple values round-trips through getSelectValues / getSelectLabels', async () => {
        await interactor().selectOptionValue(target, ['a', 'c']);
        assertEqual(await interactor().getSelectValues(target), ['a', 'c']);
        assertEqual(await interactor().getSelectLabels(target), ['Alpha', 'Charlie']);
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().selectOptionValue(absent, ['a']));
      });
    });

    describe('setInputFiles', () => {
      test("uploads a single file, reflected as a value ending with the file's basename", async () => {
        const target = byDataTestId('file-input');
        await interactor().setInputFiles(target, fixtureFile('hello.txt'));
        const value = await interactor().getInputValue(target);
        assertTrue(value != null && value.endsWith('hello.txt'));
      });

      test('uploads multiple files onto a multiple input', async () => {
        const target = byDataTestId('file-input-multiple');
        await interactor().setInputFiles(target, [fixtureFile('hello.txt'), fixtureFile('world.txt')]);
        const value = await interactor().getInputValue(target);
        assertTrue(value != null && value.endsWith('hello.txt'));
      });

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().setInputFiles(absent, fixtureFile('hello.txt')));
      });
    });

    // #973 — ScrollActions. jsdom has no layout engine, so both primitives are
    // documented, guarded no-ops there; the positional assertions are gated to
    // hasLayout, matching the pattern in
    // package-tests/component-driver-html-test/src/examples/drag/Geometry.suite.ts.
    describe('scrollIntoView / scrollBy', () => {
      const container = byDataTestId('scroll-container');
      const target = byDataTestId('scroll-target');

      test('scrollIntoView resolves once the element is found', async () => {
        await assertResolves(() => interactor().scrollIntoView(target));
      });

      test('scrollIntoView throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().scrollIntoView(absent));
      });

      test('scrollBy resolves once the element is found', async () => {
        await assertResolves(() => interactor().scrollBy(container, { x: 0, y: 50 }));
      });

      test('scrollBy throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().scrollBy(absent, { x: 0, y: 50 }));
      });

      if (hasLayout) {
        test('scrollIntoView brings an out-of-view target into the container viewport', async () => {
          const before = await interactor().getBoundingRect(target);
          await interactor().scrollIntoView(target);
          const after = await interactor().getBoundingRect(target);
          assertTrue(after.y < before.y);
        });

        test('scrollBy moves the container content by the given delta', async () => {
          const before = await interactor().getBoundingRect(target);
          await interactor().scrollBy(container, { x: 0, y: 50 });
          const after = await interactor().getBoundingRect(target);
          assertApproxEqual(before.y - after.y, 50, 2);
        });
      }
    });

    // #973 — Waiter. Every WaitForCondition ('attached' | 'detached' | 'visible'
    // | 'hidden') gets both a "meets immediately" and a "times out and throws
    // WaitForFailureError" case. Timeouts are kept short (150ms) since the
    // condition is known never to flip.
    describe('waitUntilComponentState conditions', () => {
      async function assertWaitForFailure(action: () => Promise<unknown>): Promise<void> {
        const error = await captureError(action);
        assertEqual(error?.name, WaitForFailureErrorId);
        assertTrue(error instanceof InteractorErrorBase);
      }

      test("condition 'attached' (default) resolves immediately for a present element", async () => {
        await interactor().waitUntilComponentState(byDataTestId('present'));
      });

      test("condition 'attached' throws WaitForFailureError when the element never attaches", async () => {
        await assertWaitForFailure(() =>
          interactor().waitUntilComponentState(absent, { condition: 'attached', timeoutMs: 150 })
        );
      });

      test("condition 'detached' resolves immediately for a missing element", async () => {
        await interactor().waitUntilComponentState(absent, { condition: 'detached', timeoutMs: 150 });
      });

      test("condition 'detached' throws WaitForFailureError when the element never detaches", async () => {
        await assertWaitForFailure(() =>
          interactor().waitUntilComponentState(byDataTestId('present'), { condition: 'detached', timeoutMs: 150 })
        );
      });

      test("condition 'visible' resolves immediately for a visible element", async () => {
        await interactor().waitUntilComponentState(byDataTestId('visible-target'), { condition: 'visible' });
      });

      test("condition 'visible' throws WaitForFailureError for a never-visible element", async () => {
        await assertWaitForFailure(() =>
          interactor().waitUntilComponentState(byDataTestId('hidden-by-ancestor-display'), {
            condition: 'visible',
            timeoutMs: 150,
          })
        );
      });

      test("condition 'hidden' resolves immediately for a hidden element", async () => {
        await interactor().waitUntilComponentState(byDataTestId('hidden-by-ancestor-display'), {
          condition: 'hidden',
        });
      });

      test("condition 'hidden' throws WaitForFailureError for a never-hidden (visible) element", async () => {
        await assertWaitForFailure(() =>
          interactor().waitUntilComponentState(byDataTestId('visible-target'), {
            condition: 'hidden',
            timeoutMs: 150,
          })
        );
      });
    });

    describe('waitUntil (generic probe)', () => {
      test('resolves with the value once the probe meets the terminate condition', async () => {
        let n = 0;
        const result = await interactor().waitUntil<number>({
          probeFn: async () => ++n,
          terminateCondition: (value: number) => value >= 3,
          timeoutMs: 200,
        });
        assertEqual(result, 3);
      });

      // Distinct from waitUntilComponentState: the generic waitUntil returns the
      // last probed value on timeout rather than throwing.
      test('returns the last probed value on timeout, without throwing', async () => {
        const result = await interactor().waitUntil<number>({
          probeFn: async () => 42,
          terminateCondition: (value: number) => value === 0,
          timeoutMs: 100,
        });
        assertEqual(result, 42);
      });
    });

    // #973 — the remaining ElementQueries members: the 3 getAttribute
    // overloads (incl. the isMultiple length-divergence finding),
    // getStyleValue, getBoundingRect (hasLayout-gated), and innerHTML (incl.
    // the missing-element-throws finding).
    describe('getAttribute overloads', () => {
      const multi = byDataTestId('attr-multi');

      test('the 2-arg form and the explicit isMultiple: false form agree', async () => {
        const twoArg = await interactor().getAttribute(byDataTestId('present'), 'data-testid');
        const explicitFalse = await interactor().getAttribute(byDataTestId('present'), 'data-testid', false);
        assertEqual(twoArg, explicitFalse);
      });

      test('isMultiple: true returns every match, in document order, when all matches carry the attribute', async () => {
        assertEqual(await interactor().getAttribute(multi, 'data-group', true), ['multi', 'multi', 'multi']);
      });

      test('isMultiple: true returns an empty array (not undefined) for a locator matching nothing', async () => {
        assertEqual(await interactor().getAttribute(absent, 'data-flag', true), []);
      });

      // FINDING (#973) — cross-engine isMultiple length divergence.
      // DOMInteractor's isMultiple:true branch maps unconditionally
      // (`el.getAttribute(name)!`) with no filtering, so an element that
      // matches the locator but lacks the named attribute contributes a `null`
      // entry — despite the `readonly string[]` return type — instead of being
      // omitted. See packages/dom-core/src/DOMInteractor.ts, the `getAttribute`
      // isMultiple branch. PlaywrightInteractor DOES filter `null` values out
      // (packages/playwright/src/PlaywrightInteractor.ts, same method), so for
      // an identical locator/attribute pair where only SOME matches carry the
      // attribute, the two interactors return DIFFERENT-LENGTH arrays — the
      // "cross-engine isMultiple length divergence" #973 calls out by name.
      //
      // Skipped rather than asserting either interactor's current (divergent)
      // behavior as correct. The assertion below documents the contract that
      // honors the declared `readonly string[]` type — filtering out matches
      // that lack the attribute, i.e. PlaywrightInteractor's existing
      // behavior — which DOMInteractor should converge on. Un-skip once
      // DOMInteractor's isMultiple branch filters like PlaywrightInteractor's does.
      test.skip('isMultiple: true omits matches that lack the attribute, matching the readonly string[] return type', async () => {
        assertEqual(await interactor().getAttribute(multi, 'data-flag', true), ['a', 'b']);
      });
    });

    describe('getStyleValue', () => {
      test('reads a computed style property value', async () => {
        assertEqual(await interactor().getStyleValue(byDataTestId('style-target'), 'color'), 'rgb(255, 0, 0)');
      });

      test('returns undefined for a missing element', async () => {
        assertEqual(await interactor().getStyleValue(absent, 'color'), undefined);
      });
    });

    describe('getBoundingRect', () => {
      const target = byDataTestId('sized-box'); // width: 120px, height: 60px

      test('returns a numeric x/y/width/height shape in both engines', async () => {
        const r = await interactor().getBoundingRect(target);
        assertEqual(typeof r.x, 'number');
        assertEqual(typeof r.y, 'number');
        assertEqual(typeof r.width, 'number');
        assertEqual(typeof r.height, 'number');
      });

      // jsdom-only: no layout engine, so getBoundingClientRect is all zeros.
      if (!hasLayout) {
        test('returns a zero-rect under jsdom (no layout engine)', async () => {
          const r = await interactor().getBoundingRect(target);
          assertEqual(r.width, 0);
          assertEqual(r.height, 0);
        });
      }

      // E2E-only: a real layout engine reports the box's actual CSS dimensions.
      // A small tolerance absorbs the sub-pixel rounding CLAUDE.md notes across
      // browsers.
      if (hasLayout) {
        test('returns the real, CSS-specified dimensions in a real browser', async () => {
          const r = await interactor().getBoundingRect(target);
          assertApproxEqual(r.width, 120, 1);
          assertApproxEqual(r.height, 60, 1);
        });
      }

      test('throws ElementNotFoundError for a missing element', async () => {
        await assertElementNotFound(() => interactor().getBoundingRect(absent));
      });
    });

    describe('innerHTML', () => {
      test("returns the element's markup", async () => {
        assertEqual(await interactor().innerHTML(byDataTestId('inner-html-target')), '<span>hi</span>');
      });

      test('returns an empty string for a missing element, matching every other read primitive', async () => {
        assertEqual(await interactor().innerHTML(absent), '');
      });
    });
  },
};

export const interactorConformanceSuites = [interactorConformanceSuite];
