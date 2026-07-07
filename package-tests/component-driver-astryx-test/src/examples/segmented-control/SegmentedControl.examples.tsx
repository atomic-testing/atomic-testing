import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx SegmentedControl scene.
 *
 * SegmentedControl renders a `role="radiogroup"` root with its accessible name in
 * `aria-label` and does NOT forward `data-testid`, so the scene anchors the root
 * by `byRole('radiogroup')` composed with the verbatim `aria-label` — the
 * role/name-first path. Each segment is a `role="radio"` button whose identity is
 * its `data-value` (not the visible label or a StyleX class).
 *
 * Two controls (distinct `aria-label`s) prove the anchor is not too broad.
 *
 * The "Locked view" control is disabled with a whole-group `disabledMessage`,
 * reaching a `role="tooltip"` layer through the root radiogroup's composed
 * `aria-describedby` — distinct from the "table" item's per-segment
 * `isDisabled` (no message) above.
 */
export const SegmentedControlExample = () => {
  const [view, setView] = useState('grid');
  const [density, setDensity] = useState('comfortable');

  return (
    <div>
      <SegmentedControl value={view} onChange={setView} label='View mode'>
        <SegmentedControlItem value='grid' label='Grid' />
        <SegmentedControlItem value='list' label='List' />
        <SegmentedControlItem value='table' label='Table' isDisabled />
      </SegmentedControl>

      <SegmentedControl value={density} onChange={setDensity} label='Density'>
        <SegmentedControlItem value='compact' label='Compact' />
        <SegmentedControlItem value='comfortable' label='Comfortable' />
      </SegmentedControl>

      <SegmentedControl
        value='grid'
        onChange={() => {}}
        label='Locked view'
        isDisabled
        disabledMessage='View mode is fixed for this workspace'>
        <SegmentedControlItem value='grid' label='Grid' />
        <SegmentedControlItem value='list' label='List' />
      </SegmentedControl>
    </div>
  );
};

export const segmentedControlUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx SegmentedControl',
  ui: <SegmentedControlExample />,
};
