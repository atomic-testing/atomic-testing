import { byDataTestId, CssProperty } from '@atomic-testing/core';

import { DOMInteractor } from '../src/DOMInteractor';

/**
 * White-box guard for the `runInteraction` template-method seam (#1052).
 *
 * Seam contract: every `DOMInteractor` primitive that mutates the DOM — and both
 * wait conditions — routes through `runInteraction`, so a framework adapter that
 * overrides that ONE method (React's `act`, Vue's `nextTick`) flushes them all,
 * with no per-method override to forget. Reads must NOT route.
 *
 * Three layers guard the contract:
 *  1. Completeness — every method on `DOMInteractor.prototype` is classified
 *     below as a mutation, a wait, a read, or infra. A newly-added primitive
 *     that no bucket claims fails the completeness test, forcing the author to
 *     decide whether it routes through the seam. A hardcoded list alone cannot
 *     do this: a new mutating primitive could otherwise be added AND omitted
 *     from the guard, leaving React/Vue silently un-flushed (see #1052 review).
 *  2. Mutations route exactly once; wait conditions route at least once
 *     (`waitUntilComponentState` delegates to `interactorWaitUtil`, which calls
 *     `this.waitUntil`, so one call enters the seam more than once — hence
 *     `>= 1`, not an exact count).
 *  3. Reads never route.
 */
class CountingInteractor extends DOMInteractor {
  interactionCount = 0;

  protected override runInteraction<T>(fn: () => Promise<T>): Promise<T> {
    this.interactionCount += 1;
    return super.runInteraction(fn);
  }
}

type Invocation = (interactor: CountingInteractor) => Promise<unknown>;

// Mutating primitives: each routes through `runInteraction` EXACTLY once.
const mutatingPrimitives: ReadonlyArray<readonly [string, Invocation]> = [
  ['enterText', i => i.enterText(byDataTestId('text'), 'hello')],
  ['typeText', i => i.typeText(byDataTestId('text'), 'hello')],
  ['setRangeValue', i => i.setRangeValue(byDataTestId('range'), 5)],
  ['click', i => i.click(byDataTestId('box'))],
  ['hover', i => i.hover(byDataTestId('box'))],
  ['mouseMove', i => i.mouseMove(byDataTestId('box'))],
  ['mouseDown', i => i.mouseDown(byDataTestId('box'))],
  ['mouseUp', i => i.mouseUp(byDataTestId('box'))],
  ['mouseOver', i => i.mouseOver(byDataTestId('box'))],
  ['mouseOut', i => i.mouseOut(byDataTestId('box'))],
  ['mouseEnter', i => i.mouseEnter(byDataTestId('box'))],
  ['mouseLeave', i => i.mouseLeave(byDataTestId('box'))],
  ['focus', i => i.focus(byDataTestId('text'))],
  ['blur', i => i.blur(byDataTestId('text'))],
  ['pressKey', i => i.pressKey(byDataTestId('text'), 'Enter')],
  ['contextMenu', i => i.contextMenu(byDataTestId('box'))],
  ['activate', i => i.activate(byDataTestId('box'))],
  ['selectOptionValue', i => i.selectOptionValue(byDataTestId('select'), ['a'])],
  ['setInputFiles', i => i.setInputFiles(byDataTestId('file'), 'note.txt')],
  ['scrollIntoView', i => i.scrollIntoView(byDataTestId('box'))],
  ['scrollBy', i => i.scrollBy(byDataTestId('box'), { x: 0, y: 10 })],
  ['dragTo', i => i.dragTo(byDataTestId('box'), byDataTestId('target'))],
  ['drag', i => i.drag(byDataTestId('box'), { x: 5, y: 5 })],
];

// Wait conditions: also routed through the seam so a React/Vue flush wraps the
// whole probe loop. `waitUntilComponentState` nests `waitUntil` (via
// `interactorWaitUtil`), so a single call enters the seam more than once — assert
// `>= 1` rather than an exact count.
const waitConditions: ReadonlyArray<readonly [string, Invocation]> = [
  [
    'waitUntilComponentState',
    i => i.waitUntilComponentState(byDataTestId('box'), { condition: 'visible', timeoutMs: 1000 }),
  ],
  ['waitUntil', i => i.waitUntil({ probeFn: async () => true, terminateCondition: true, timeoutMs: 1000 })],
];

// Read primitives: observe state without mutating it, so they must NOT route.
const readPrimitives: ReadonlyArray<readonly [string, Invocation]> = [
  ['getAttribute', i => i.getAttribute(byDataTestId('box'), 'data-testid')],
  ['getStyleValue', i => i.getStyleValue(byDataTestId('box'), 'display' as CssProperty)],
  ['getInputValue', i => i.getInputValue(byDataTestId('text'))],
  ['getSelectValues', i => i.getSelectValues(byDataTestId('select'))],
  ['getSelectLabels', i => i.getSelectLabels(byDataTestId('select'))],
  ['getText', i => i.getText(byDataTestId('box'))],
  ['getBoundingRect', i => i.getBoundingRect(byDataTestId('box'))],
  ['exists', i => i.exists(byDataTestId('box'))],
  ['getElementCount', i => i.getElementCount(byDataTestId('box'))],
  ['isChecked', i => i.isChecked(byDataTestId('box'))],
  ['isDisabled', i => i.isDisabled(byDataTestId('box'))],
  ['isReadonly', i => i.isReadonly(byDataTestId('text'))],
  ['isRequired', i => i.isRequired(byDataTestId('text'))],
  ['isError', i => i.isError(byDataTestId('box'))],
  ['isVisible', i => i.isVisible(byDataTestId('box'))],
  ['hasCssClass', i => i.hasCssClass(byDataTestId('box'), 'x')],
  ['hasAttribute', i => i.hasAttribute(byDataTestId('box'), 'data-testid')],
  ['innerHTML', i => i.innerHTML(byDataTestId('box'))],
];

// Neither primitives nor wait conditions: the seam itself and internal
// query/geometry helpers. Excluded from the routing contract, but enumerated so
// the completeness test stays exhaustive.
const infraMethods: ReadonlySet<string> = new Set([
  'constructor',
  'runInteraction',
  'getElement',
  'calculateMousePosition',
  'dispatchMouse',
  'escapesToDocumentRoot',
]);

function domInteractorMethodNames(): string[] {
  return Object.getOwnPropertyNames(DOMInteractor.prototype).filter(name => {
    const descriptor = Object.getOwnPropertyDescriptor(DOMInteractor.prototype, name);
    return descriptor != null && typeof descriptor.value === 'function';
  });
}

describe('DOMInteractor runInteraction routing', () => {
  let interactor: CountingInteractor;

  beforeEach(() => {
    document.body.innerHTML = `
      <input data-testid="text" type="text" />
      <input data-testid="range" type="range" min="0" max="10" />
      <select data-testid="select">
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
      <input data-testid="file" type="file" />
      <div data-testid="box">box</div>
      <div data-testid="target">target</div>
    `;
    interactor = new CountingInteractor();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('classifies every DOMInteractor method as mutation, wait, read, or infra', () => {
    const classified = new Set<string>([
      ...mutatingPrimitives.map(([name]) => name),
      ...waitConditions.map(([name]) => name),
      ...readPrimitives.map(([name]) => name),
      ...infraMethods,
    ]);
    // An unclassified method means a primitive was added without deciding whether
    // it routes through the seam. Add a mutation to `mutatingPrimitives` (and
    // wrap its body in `runInteraction`), a read to `readPrimitives`, or a helper
    // to `infraMethods`.
    const unclassified = domInteractorMethodNames().filter(name => !classified.has(name));
    expect(unclassified).toEqual([]);
  });

  it('covers all 23 mutating primitives and both wait conditions', () => {
    expect(mutatingPrimitives).toHaveLength(23);
    expect(waitConditions).toHaveLength(2);
  });

  it.each(mutatingPrimitives)(
    'mutating primitive %s routes through runInteraction exactly once',
    async (_name, invoke) => {
      const before = interactor.interactionCount;
      // The seam increments on entry, before the body runs, so a jsdom-specific
      // failure inside the body cannot affect what this asserts: that the primitive
      // funnels through runInteraction exactly once. Each primitive's actual
      // behavior is covered by the interactor-conformance suite.
      await invoke(interactor).catch(() => undefined);
      expect(interactor.interactionCount - before).toBe(1);
    }
  );

  it.each(waitConditions)('wait condition %s routes through runInteraction at least once', async (_name, invoke) => {
    const before = interactor.interactionCount;
    await invoke(interactor).catch(() => undefined);
    expect(interactor.interactionCount - before).toBeGreaterThanOrEqual(1);
  });

  it.each(readPrimitives)('read primitive %s does not route through runInteraction', async (_name, invoke) => {
    const before = interactor.interactionCount;
    await invoke(interactor).catch(() => undefined);
    expect(interactor.interactionCount - before).toBe(0);
  });
});
