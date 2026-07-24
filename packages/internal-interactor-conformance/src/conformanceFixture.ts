import { byDataTestId, ComponentDriver, ScenePart } from '@atomic-testing/core';

/**
 * Framework-agnostic DOM the conformance suite probes. It is plain HTML so the
 * SAME markup drives every interactor: the Jest leg mounts it via
 * `@atomic-testing/dom-core`, the Playwright leg loads it with `page.setContent`.
 *
 * Every element the suite queries lives here; the `absent` test ids are
 * deliberately NOT present so missing-element behavior can be asserted.
 *
 * Deliberately declarative only (no `<script>`/inline event-handler content):
 * a `<script>` inserted via `innerHTML` never executes (per the HTML spec, only
 * scripts parsed as part of the initial document do), so the Jest leg
 * (`document.body.innerHTML = ...`) and the Playwright leg (`page.setContent`,
 * which navigates and DOES run scripts) would silently diverge.
 *
 * Focus is observed via a `[data-testid="..."]:focus` `byCssSelector` +
 * `exists()` probe (see conformanceSuites.ts) rather than a computed style: an
 * element === `document.activeElement` check is plain selector MATCHING, which
 * jsdom's selector engine (nwsapi) implements correctly, unlike
 * `getComputedStyle`, which in jsdom reflects only inline styles and does NOT
 * apply stylesheet-rule cascade (a `<style>` `:focus` rule's declaration would
 * never show up there, even though the element genuinely is focused).
 */
export const conformanceFixtureHtml = `
  <main>
    <button type="button" data-testid="present">present</button>

    <!-- Multi-match: two elements share a locator; reads must resolve to the first. -->
    <div data-testid="dup" data-order="first">first</div>
    <div data-testid="dup" data-order="second">second</div>

    <!-- Value reads: a real input vs. a non-input element. -->
    <input type="text" data-testid="text-input" value="typed" />
    <div data-testid="not-input">not an input</div>

    <!-- A checkbox so isChecked has a positive control. -->
    <input type="checkbox" data-testid="checked-box" checked />

    <!-- A selected <option> with NO value attribute: its value must fall back to
         the option text (HTML IDL semantics), not be dropped. A single option
         keeps selectedness unambiguous across jsdom and real browsers (jsdom
         mis-marks later options selected when a <select> is parsed via innerHTML). -->
    <select data-testid="valueless-select">
      <option selected>Apple</option>
    </select>

    <!-- Visibility: an element is visible only when it AND every ancestor are
         displayed and non-transparent. display:none / opacity:0 are NOT
         inherited, so a descendant keeps its OWN non-hidden computed values —
         isVisible must walk ancestors (the hole #1053 closes). -->
    <div data-testid="visible-target">visible</div>
    <div style="display: none">
      <span data-testid="hidden-by-ancestor-display">hidden via ancestor display:none</span>
    </div>
    <div style="opacity: 0">
      <span data-testid="hidden-by-ancestor-opacity">hidden via ancestor opacity:0</span>
    </div>

    <!-- Element count: three matching items plus a same-tag non-item sibling.
         getElementCount must count by locator match (3), not by tag among
         siblings (which would be 4) — the miscount #1054 fixes on the count side
         of the list helpers. -->
    <ul data-testid="count-list">
      <li data-testid="count-item">one</li>
      <li data-testid="count-item">two</li>
      <li data-testid="count-item">three</li>
      <li data-testid="count-other">not a counted item</li>
    </ul>

    <!-- click: a fresh, unchecked control so a positional click's real toggling
         side effect (not just "the call resolved") is observable. -->
    <input type="checkbox" data-testid="click-checkbox" />

    <!-- activate: a zero-size, visually-hidden checkbox behind a covering label —
         the canonical case activate exists for (e.g. MUI Rating's hidden radio),
         unreachable by a positional click's hit-test. -->
    <span style="position: relative; display: inline-block">
      <input
        type="checkbox"
        data-testid="activate-target"
        style="position: absolute; opacity: 0; width: 1px; height: 1px"
      />
      <span aria-hidden="true">covering label</span>
    </span>

    <!-- dragTo / drag: a static source+target pair. No drop handler exists (no
         app JS — see the file-level note), so only the event-wiring / "resolves
         once both elements are found" contract is exercised, matching the
         PointerActions.dragTo / .drag JSDoc's own jsdom caveat. -->
    <div data-testid="drag-source">drag source</div>
    <div data-testid="drag-target">drag target</div>

    <!-- focus / blur: a plain text input, observed via the :focus selector probe. -->
    <input type="text" data-testid="focus-target" />

    <!-- pressKey: a <button> (not a text input) so a real browser's native
         default action for a printable key press cannot insert text — jsdom
         never performs that default action (fireEvent isn't a trusted event),
         so a text target's value would diverge between engines. Observed via
         the same :focus selector probe, proving pressKey's documented "the
         element is focused first" behavior. -->
    <button type="button" data-testid="key-target">key target</button>

    <!-- enterText / typeText: empty inputs so append-vs-replace semantics are
         unambiguous (no pre-existing value to accidentally match a false positive). -->
    <input type="text" data-testid="enter-text-target" />
    <input type="text" data-testid="type-text-target" />

    <!-- setRangeValue: step=5 makes an off-step target (7) unambiguous — nearest
         valid steps are 5 and 10, and 7 is strictly closer to 5. -->
    <input type="range" data-testid="range-input" min="0" max="20" step="5" value="0" />

    <!-- selectOptionValue / multi-select getSelectValues+getSelectLabels: nothing
         pre-selected, so the initial read exercises the "select exists, nothing
         chosen -> []" convention (empty array, not undefined). -->
    <select data-testid="multi-select" multiple>
      <option value="a">Alpha</option>
      <option value="b">Bravo</option>
      <option value="c">Charlie</option>
    </select>

    <!-- setInputFiles: DOMInteractor never reads these bytes (wraps an empty File
         named by basename); PlaywrightInteractor's native setInputFiles reads the
         path from disk, so package-tests/internal-interactor-conformance-test/fixtures
         must contain real files with these basenames (see conformanceSuites.ts). -->
    <input type="file" data-testid="file-input" />
    <input type="file" data-testid="file-input-multiple" multiple />

    <!-- scrollIntoView / scrollBy: a fixed-height scroll container with a tall
         spacer pushing the target out of the initial view. jsdom has no layout,
         so both primitives are guarded no-ops there; only Playwright (hasLayout)
         asserts the resulting scroll position. -->
    <div data-testid="scroll-container" style="height: 100px; overflow-y: auto">
      <div style="height: 500px"></div>
      <div data-testid="scroll-target">scroll target</div>
    </div>

    <!-- getAttribute(..., true): three matches sharing data-group (present on
         all three, for the happy path) but data-flag only on the first two (for
         the isMultiple length-divergence finding — see conformanceSuites.ts). -->
    <div data-testid="attr-multi" data-flag="a" data-group="multi">one</div>
    <div data-testid="attr-multi" data-flag="b" data-group="multi">two</div>
    <div data-testid="attr-multi" data-group="multi">three</div>

    <!-- getStyleValue: a canonical (already rgb-form) color so no engine needs to
         normalize a keyword, removing that as a source of cross-engine drift. -->
    <div data-testid="style-target" style="color: rgb(255, 0, 0)">styled</div>

    <!-- getBoundingRect: explicit dimensions so a real layout engine (hasLayout)
         reports plausible, assertable width/height. -->
    <div data-testid="sized-box" style="width: 120px; height: 60px">sized</div>

    <!-- innerHTML: single-line markup so the expected string has no incidental
         template-literal indentation/whitespace baked into it. -->
    <div data-testid="inner-html-target"><span>hi</span></div>
  </main>
`;

/**
 * A trivial driver so the scene part can construct a {@link TestEngine}. The
 * conformance tests drive `engine().interactor` with raw locators rather than
 * this driver's methods, so it needs no behavior of its own.
 */
export class ConformanceProbeDriver extends ComponentDriver {
  get driverName(): string {
    return 'ConformanceProbeDriver';
  }
}

export const conformanceScenePart = {
  present: { locator: byDataTestId('present'), driver: ConformanceProbeDriver },
} satisfies ScenePart;
