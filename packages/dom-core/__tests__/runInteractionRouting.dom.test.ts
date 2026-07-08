import { byDataTestId } from '@atomic-testing/core';

import { DOMInteractor } from '../src/DOMInteractor';

/**
 * White-box guard for the `runInteraction` template-method seam (#1052).
 *
 * Every mutating primitive on `DOMInteractor` must route through
 * `runInteraction` exactly once, so a framework adapter that overrides that one
 * method (React's `act`, Vue's `nextTick`) flushes them all — a new primitive
 * added to the base can no longer slip through unwrapped. This counts seam
 * entries directly, the mechanical verification the interactor-conformance suite
 * reserved as future work.
 */
class CountingInteractor extends DOMInteractor {
  interactionCount = 0;

  protected override runInteraction<T>(fn: () => Promise<T>): Promise<T> {
    this.interactionCount += 1;
    return super.runInteraction(fn);
  }
}

type Invocation = (interactor: CountingInteractor) => Promise<unknown>;

// The 22 mutating primitives, each pointed at a fixture element that lets it run
// under jsdom. Order and count mirror the seam's contract in DOMInteractor.
const mutatingPrimitives: ReadonlyArray<readonly [string, Invocation]> = [
  ['enterText', i => i.enterText(byDataTestId('text'), 'hello')],
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

// Representative reads: they observe state without mutating it, so they must NOT
// route through the seam.
const readPrimitives: ReadonlyArray<readonly [string, Invocation]> = [
  ['getText', i => i.getText(byDataTestId('box'))],
  ['exists', i => i.exists(byDataTestId('box'))],
  ['getElementCount', i => i.getElementCount(byDataTestId('box'))],
  ['getAttribute', i => i.getAttribute(byDataTestId('box'), 'data-testid')],
  ['isVisible', i => i.isVisible(byDataTestId('box'))],
];

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

  it('exercises all 22 mutating primitives', () => {
    expect(mutatingPrimitives).toHaveLength(22);
  });

  it.each(mutatingPrimitives)('%s routes through runInteraction exactly once', async (_name, invoke) => {
    const before = interactor.interactionCount;
    // The seam increments on entry, before the interaction body runs, so a
    // jsdom-specific failure inside the body cannot affect what this asserts:
    // that the primitive funnels through runInteraction exactly once. Each
    // primitive's actual behavior is covered by the interactor-conformance suite.
    await invoke(interactor).catch(() => undefined);
    expect(interactor.interactionCount - before).toBe(1);
  });

  it.each(readPrimitives)('read primitive %s does not route through runInteraction', async (_name, invoke) => {
    const before = interactor.interactionCount;
    await invoke(interactor).catch(() => undefined);
    expect(interactor.interactionCount - before).toBe(0);
  });
});
