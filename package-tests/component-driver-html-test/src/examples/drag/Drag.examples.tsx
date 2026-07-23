import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback, useRef, useState } from 'react';

/** Payload carried through the native HTML5 DnD `DataTransfer` below. */
const HTML5_DRAG_PAYLOAD = 'atomic-testing-drag-payload';

/**
 * A pointer-draggable box plus a drop target.
 *
 * The box has an explicit size so {@link Interactor.getBoundingRect} has
 * plausible dimensions under a real layout engine. On `mousedown` it bumps an
 * interaction counter and starts tracking; `mousemove`/`mouseup` are attached to
 * `window` so the gesture is followed even when the pointer leaves the box. Each
 * move translates the box and writes its current offset as `"x,y"` text.
 *
 * jsdom has no layout, so the offset never actually changes there — only the
 * event wiring (the counter) is observable. Real movement is browser-only.
 *
 * `dragTo` is exercised with a separate, *static* `drag-source` rather than the
 * pointer-following box: under a real layout engine the box rides under the
 * cursor into the drop zone and would shadow the drop target at `mouseup` (the
 * hit-test would land on the box, not the target). A source that stays put keeps
 * the drop target topmost at release, so its `mouseup` handler fires in both
 * engines.
 *
 * A separate `html5-drag-source`/`html5-drop-target` pair covers the OTHER DnD
 * model: native HTML5 drag-and-drop (`draggable` + `ondragstart`/`ondragover`/
 * `ondrop`), wired through `drag*` events only — no mouse handlers — so it can
 * only pass if the interactor's HTML5 event synthesis (#922) is exercised, not
 * the pointer sequence above.
 */
export const DragExample = () => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [interactions, setInteractions] = useState<number>(0);
  const [dropStatus, setDropStatus] = useState<string>('');
  const [html5DragStartCount, setHtml5DragStartCount] = useState<number>(0);
  const [html5DragEndCount, setHtml5DragEndCount] = useState<number>(0);
  const [html5DropPayload, setHtml5DropPayload] = useState<string>('');

  // Live drag state held in refs so the window listeners read current values
  // without re-subscribing on every render.
  const draggingRef = useRef<boolean>(false);
  const startPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      setInteractions(count => count + 1);
      draggingRef.current = true;
      startPointerRef.current = { x: event.clientX, y: event.clientY };
      startOffsetRef.current = offset;

      const onMove = (moveEvent: MouseEvent) => {
        if (!draggingRef.current) {
          return;
        }
        const dx = moveEvent.clientX - startPointerRef.current.x;
        const dy = moveEvent.clientY - startPointerRef.current.y;
        setOffset({ x: startOffsetRef.current.x + dx, y: startOffsetRef.current.y + dy });
      };

      const onUp = () => {
        draggingRef.current = false;
        // Guard for jsdom older shims; window always exists in both engines.
        if (typeof window !== 'undefined') {
          window.removeEventListener('mousemove', onMove);
          window.removeEventListener('mouseup', onUp);
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      }
    },
    [offset]
  );

  const onDrop = useCallback(() => {
    setDropStatus('dropped');
  }, []);

  // Native HTML5 DnD: `draggable` + `ondragstart`/`ondragover`/`ondrop`, not
  // wired through mousedown/mousemove/mouseup at all — proves the interactor's
  // HTML5 event synthesis (#922), independent of the pointer-based gesture above.
  const onHtml5DragStart = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', HTML5_DRAG_PAYLOAD);
    setHtml5DragStartCount(count => count + 1);
  }, []);

  const onHtml5DragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // The real-browser opt-in signal that this target accepts the drop.
    event.preventDefault();
  }, []);

  const onHtml5Drop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHtml5DropPayload(event.dataTransfer.getData('text/plain'));
  }, []);

  const onHtml5DragEnd = useCallback(() => {
    setHtml5DragEndCount(count => count + 1);
  }, []);

  return (
    <React.Fragment>
      <div
        data-testid='drag-box'
        onMouseDown={onMouseDown}
        style={{
          width: 120,
          height: 60,
          background: '#cde',
          border: '1px solid #36c',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          userSelect: 'none',
          cursor: 'grab',
        }}>
        Drag me
      </div>
      {/* Reports the box's current translation offset as "x,y". */}
      <div data-testid='drag-position'>{`${offset.x},${offset.y}`}</div>
      {/* Counts mousedown gestures — observable in both engines (event wiring). */}
      <div data-testid='drag-interactions'>{String(interactions)}</div>
      {/* Static source for `dragTo`: it does not follow the pointer, so it never
          covers the drop target at release. */}
      <div
        data-testid='drag-source'
        style={{ width: 120, height: 60, background: '#fcd', border: '1px solid #c33', cursor: 'grab' }}>
        Drag source
      </div>
      <div
        data-testid='drop-target'
        onMouseUp={onDrop}
        style={{ width: 120, height: 60, background: '#efe', border: '1px solid #3c3' }}>
        Drop here
      </div>
      {/* Set to 'dropped' once a mouseup lands on the drop target. */}
      <div data-testid='drop-status'>{dropStatus}</div>
      {/* Native HTML5 DnD source: `draggable`, sets a dataTransfer payload in
          `ondragstart`. No mouse handlers — only drag* events drive it. */}
      <div
        data-testid='html5-drag-source'
        draggable
        onDragStart={onHtml5DragStart}
        onDragEnd={onHtml5DragEnd}
        style={{ width: 120, height: 60, background: '#fed', border: '1px solid #c93', cursor: 'grab' }}>
        HTML5 drag source
      </div>
      {/* Native HTML5 DnD target: accepts the drop via `preventDefault` in
          `ondragover` (the real-browser opt-in) and reads the payload in `ondrop`. */}
      <div
        data-testid='html5-drop-target'
        onDragOver={onHtml5DragOver}
        onDrop={onHtml5Drop}
        style={{ width: 120, height: 60, background: '#eef', border: '1px solid #33c' }}>
        HTML5 drop here
      </div>
      {/* Counts `dragstart` on the HTML5 source. */}
      <div data-testid='html5-drag-start-count'>{String(html5DragStartCount)}</div>
      {/* The `dataTransfer` payload read by the HTML5 target's `ondrop`. */}
      <div data-testid='html5-drop-payload'>{html5DropPayload}</div>
      {/* Counts `dragend` on the HTML5 source. */}
      <div data-testid='html5-drag-end-count'>{String(html5DragEndCount)}</div>
    </React.Fragment>
  );
};

export const dragUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Drag',
  ui: <DragExample />,
};
