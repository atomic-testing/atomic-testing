import { useLocation } from '@docusaurus/router';
import clsx from 'clsx';
import React, { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

// Keep these in sync with the pre-hydration init script in docusaurus.config.ts
// (the `sidebar-width-init` plugin) so a stored width is clamped identically
// before and after hydration.
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 300; // Docusaurus' stock --doc-sidebar-width
const KEYBOARD_STEP = 16;
const STORAGE_KEY = 'docSidebarWidth';

// Stable Docusaurus theme class on the doc sidebar <aside>, and the breakpoint
// below which that sidebar becomes a mobile drawer (no resizing there).
const SIDEBAR_SELECTOR = '.theme-doc-sidebar-container';
const DESKTOP_MIN_WIDTH = 997;
// Below this rendered width the sidebar is collapsed/hidden — hide the handle.
const COLLAPSED_THRESHOLD = 60;

const RESIZING_CLASS = 'at-sidebar-resizing';

function clampWidth(px: number): number {
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(px)));
}

function applyWidth(px: number): void {
  document.documentElement.style.setProperty('--doc-sidebar-width', `${px}px`);
}

function persistWidth(px: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(px));
  } catch {
    // Private mode / storage disabled — width just won't survive reloads.
  }
}

function readStoredWidth(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? clampWidth(n) : null;
  } catch {
    return null;
  }
}

/**
 * A draggable divider pinned to the doc sidebar's right edge. Dragging it
 * updates `--doc-sidebar-width` (which the stock sidebar consumes) and persists
 * the value. Rendered only on desktop doc pages that actually have a sidebar.
 */
export default function DocSidebarResizer(): ReactNode {
  const { pathname } = useLocation();
  const handleRef = useRef<HTMLDivElement | null>(null);
  const widthRef = useRef<number>(DEFAULT_WIDTH);
  // Left offset (px) at which to pin the handle; null means "hide it".
  const [handleLeft, setHandleLeft] = useState<number | null>(null);

  // Re-measure the sidebar's right edge and decide whether the handle applies.
  const sync = useCallback(() => {
    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR);
    if (sidebar == null || window.innerWidth < DESKTOP_MIN_WIDTH) {
      setHandleLeft(null);
      return;
    }
    const rect = sidebar.getBoundingClientRect();
    if (rect.width < COLLAPSED_THRESHOLD || rect.right < COLLAPSED_THRESHOLD) {
      setHandleLeft(null); // sidebar collapsed via the native toggle
      return;
    }
    widthRef.current = clampWidth(rect.width);
    setHandleLeft(rect.right);
  }, []);

  // Apply the stored width, then keep the handle aligned as layout changes
  // (window resize, native collapse/expand, navigation swapping the node).
  useEffect(() => {
    const stored = readStoredWidth();
    if (stored != null) {
      widthRef.current = stored;
      applyWidth(stored);
    }
    sync();

    const onResize = (): void => sync();
    window.addEventListener('resize', onResize);

    const sidebar = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR);
    const observer = sidebar != null && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => sync()) : null;
    observer?.observe(sidebar as Element);

    return () => {
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
    };
  }, [sync, pathname]);

  const commit = useCallback(
    (width: number) => {
      const w = clampWidth(width);
      widthRef.current = w;
      applyWidth(w);
      persistWidth(w);
      const handle = handleRef.current;
      if (handle != null) {
        handle.setAttribute('aria-valuenow', String(w));
      }
      sync();
    },
    [sync]
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      const sidebar = document.querySelector<HTMLElement>(SIDEBAR_SELECTOR);
      if (sidebar == null) return;
      event.preventDefault();

      const originLeft = sidebar.getBoundingClientRect().left;
      const handle = handleRef.current;
      document.documentElement.classList.add(RESIZING_CLASS);
      handle?.classList.add(styles.dragging);

      const onMove = (moveEvent: PointerEvent): void => {
        const width = clampWidth(moveEvent.clientX - originLeft);
        widthRef.current = width;
        applyWidth(width);
        // Move the handle imperatively during the drag to avoid a React render per
        // pointer event; React state is reconciled on pointer-up via commit().
        if (handle != null) handle.style.left = `${originLeft + width}px`;
      };

      const onUp = (): void => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        document.documentElement.classList.remove(RESIZING_CLASS);
        handle?.classList.remove(styles.dragging);
        commit(widthRef.current);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [commit]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowLeft':
          commit(widthRef.current - KEYBOARD_STEP);
          break;
        case 'ArrowRight':
          commit(widthRef.current + KEYBOARD_STEP);
          break;
        case 'Home':
          commit(MIN_WIDTH);
          break;
        case 'End':
          commit(MAX_WIDTH);
          break;
        default:
          return;
      }
      event.preventDefault();
    },
    [commit]
  );

  // Double-click restores the stock width.
  const onDoubleClick = useCallback(() => {
    widthRef.current = DEFAULT_WIDTH;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    document.documentElement.style.removeProperty('--doc-sidebar-width');
    sync();
  }, [sync]);

  if (handleLeft == null) return null;

  return (
    <div
      ref={handleRef}
      className={clsx(styles.handle)}
      style={{ left: `${handleLeft}px` }}
      role='separator'
      aria-orientation='vertical'
      aria-label='Resize sidebar'
      aria-valuenow={widthRef.current}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onDoubleClick={onDoubleClick}
    />
  );
}
