/**
 * Fake mouse event used internally by `DOMInteractor` to synthesize positioned
 * mouse events. Exported for cross-package reuse within the monorepo, not part
 * of the stable 1.0 consumer API.
 *
 * `pageX`/`pageY` are getter-only accessors on the `MouseEvent` prototype in
 * real browsers (the Angular fixtures run DOM tests in Chromium, ADR-013), so
 * they are shadowed with own properties rather than assigned — plain
 * assignment throws where jsdom happened to tolerate it.
 *
 * @see https://github.com/testing-library/react-testing-library/issues/268
 * @internal
 */
export class FakeMouseEvent extends MouseEvent {
  constructor(type: string, overrides: Partial<MouseEvent> = {}) {
    super(type, overrides);
    Object.defineProperty(this, 'pageX', { value: overrides.pageX ?? 0, configurable: true });
    Object.defineProperty(this, 'pageY', { value: overrides.pageY ?? 0, configurable: true });
  }
}
