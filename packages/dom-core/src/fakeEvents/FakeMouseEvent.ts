/**
 * Fake mouse event for testing.
 * @see https://github.com/testing-library/react-testing-library/issues/268
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
