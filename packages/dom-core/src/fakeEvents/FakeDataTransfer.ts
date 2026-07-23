/**
 * Minimal `DataTransfer` implementation for synthesizing HTML5 drag-and-drop
 * events under jsdom, which implements neither `DragEvent` nor `DataTransfer`
 * (only `MouseEvent` — see {@link FakeMouseEvent}). `@testing-library/dom`'s
 * `fireEvent.drag*` helpers special-case a `dataTransfer` init value and attach
 * it to the dispatched event verbatim when `window.DataTransfer` is absent —
 * this is that value, shared across one gesture's `dragstart` → `dragenter` →
 * `dragover` → `drop` → `dragend` sequence so a `dragstart` handler's
 * `setData` is readable from `drop`'s `getData`.
 *
 * `files`/`items` are not supported — the drag primitives synthesize element
 * drag-and-drop, not OS file drops, which {@link DOMInteractor.setInputFiles}
 * already covers.
 *
 * @see https://github.com/jsdom/jsdom/issues/1568
 * @internal
 */
export class FakeDataTransfer implements DataTransfer {
  private readonly store = new Map<string, string>();

  dropEffect: DataTransfer['dropEffect'] = 'move';
  effectAllowed: DataTransfer['effectAllowed'] = 'all';
  readonly files: FileList = { length: 0, item: () => null, [Symbol.iterator]: [][Symbol.iterator] } as FileList;
  readonly items: DataTransferItemList = { length: 0 } as DataTransferItemList;

  get types(): readonly string[] {
    return Array.from(this.store.keys());
  }

  clearData(format?: string): void {
    if (format != null) {
      this.store.delete(format);
    } else {
      this.store.clear();
    }
  }

  getData(format: string): string {
    return this.store.get(format) ?? '';
  }

  setData(format: string, data: string): void {
    this.store.set(format, data);
  }

  /**
   * No-op: jsdom has no layout/paint, so a custom drag image has nothing to
   * render. (Overrides the inherited `DataTransfer.setDragImage` doc comment,
   * which embeds raw `<img>`/`<canvas>` markup that breaks MDX rendering on
   * the generated API reference page.)
   */
  setDragImage(_image: Element, _x: number, _y: number): void {
    // Intentionally empty — see the doc comment above.
  }
}
