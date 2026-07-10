import { byDataTestId, ComponentDriver, ScenePart } from '@atomic-testing/core';

/**
 * Framework-agnostic DOM the conformance suite probes. It is plain HTML so the
 * SAME markup drives every interactor: the Jest leg mounts it via
 * `@atomic-testing/dom-core`, the Playwright leg loads it with `page.setContent`.
 *
 * Every element the suite queries lives here; the `absent` test ids are
 * deliberately NOT present so missing-element behavior can be asserted.
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
