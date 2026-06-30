import { Outline } from '@astryxdesign/core/Outline';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

/**
 * Astryx Outline scene.
 *
 * Outline self-emits `data-testid` on the `<nav>` landmark and renders each entry
 * as `<li role="listitem">` wrapping an `<a data-level href="#id">`; the active
 * entry is marked `aria-current="true"`. Two outlines with explicit `activeId`s
 * make the active entry deterministic in jsdom (scroll-spy is E2E-only) and verify
 * selector scoping.
 */
export const OutlineExample = () => (
  <>
    <Outline
      data-testid='doc-toc'
      activeId='features'
      items={[
        { id: 'intro', label: 'Introduction', level: 1 },
        { id: 'features', label: 'Features', level: 2 },
        { id: 'api', label: 'API', level: 1 },
      ]}
    />
    <Outline
      data-testid='guide-toc'
      activeId='install'
      items={[
        { id: 'install', label: 'Install', level: 1 },
        { id: 'usage', label: 'Usage', level: 1 },
      ]}
    />
  </>
);

export const outlineUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Outline',
  ui: <OutlineExample />,
};
