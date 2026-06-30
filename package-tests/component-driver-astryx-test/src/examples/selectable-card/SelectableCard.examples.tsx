import { SelectableCard } from '@astryxdesign/core/SelectableCard';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx SelectableCard scene.
 *
 * The card surface is a plain `<div>` that forwards `data-testid` onto its root;
 * the accessible toggle is a visually-hidden `<input type="checkbox" aria-label>`
 * inside it. Anchor the root; the driver delegates to the inner checkbox.
 */
export const SelectableCardExample = () => {
  const [premium, setPremium] = useState(false);

  return (
    <div>
      <SelectableCard label='Premium plan' isSelected={premium} onChange={setPremium} data-testid='premium-card'>
        Premium
      </SelectableCard>
      <SelectableCard label='Basic plan' isSelected={false} onChange={() => {}} isDisabled data-testid='basic-card'>
        Basic
      </SelectableCard>
    </div>
  );
};

export const selectableCardUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx SelectableCard',
  ui: <SelectableCardExample />,
};
