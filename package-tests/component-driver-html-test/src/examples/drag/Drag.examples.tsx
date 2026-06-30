import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useCallback, useRef, useState } from 'react';

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
 */
export const DragExample = () => {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [interactions, setInteractions] = useState<number>(0);
  const [dropStatus, setDropStatus] = useState<string>('');

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
    </React.Fragment>
  );
};

export const dragUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Drag',
  ui: <DragExample />,
};
