import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useEffect, useRef, useState } from 'react';

/**
 * A vertically scrollable container whose target sits far below the fold. An
 * `IntersectionObserver` rooted on the container reports whether the target is
 * currently intersecting, so an E2E test can prove that `scrollIntoView` /
 * `scrollBy` actually moved the target into view.
 *
 * jsdom has no layout engine and no `IntersectionObserver`, so the observer is
 * created only when the API exists; in jsdom the reporter stays at its initial
 * `'false'` and behavioral visibility is asserted in Playwright only.
 */
export const ScrollExample = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isTargetVisible, setIsTargetVisible] = useState<boolean>(false);

  useEffect(() => {
    // jsdom lacks IntersectionObserver — guard so the example renders there.
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const container = containerRef.current;
    const target = targetRef.current;
    if (container == null || target == null) {
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsTargetVisible(entry?.isIntersecting ?? false);
      },
      { root: container }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        data-testid='scroll-container'
        style={{ height: 200, overflow: 'auto', border: '1px solid #ccc' }}>
        {/* Tall spacer pushes the target well below the container's fold. */}
        <div style={{ height: 1000 }} />
        <div ref={targetRef} data-testid='scroll-target'>
          Target
        </div>
        <div style={{ height: 1000 }} />
      </div>
      {/* Reports whether the target currently intersects the container. */}
      <div data-testid='target-visibility'>{String(isTargetVisible)}</div>
    </React.Fragment>
  );
};

export const scrollUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Scroll',
  ui: <ScrollExample />,
};
