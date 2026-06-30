/**
 * Fake mouse event used internally by `DOMInteractor` to synthesize positioned
 * mouse events in jsdom. Exported for cross-package reuse within the monorepo,
 * not part of the stable 1.0 consumer API.
 *
 * @see https://github.com/testing-library/react-testing-library/issues/268
 * @internal
 */
export class FakeMouseEvent extends MouseEvent {
  constructor(type: string, overrides: Partial<MouseEvent> = {}) {
    super(type, overrides);
    Object.assign(this, {
      pageX: overrides.pageX ?? 0,
      pageY: overrides.pageY ?? 0,
    });
  }
}
