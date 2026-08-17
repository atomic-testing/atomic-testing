import { ComplexSelector } from '@astryxdesign/core/ComplexSelector';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx ComplexSelector scene (Astryx 0.3.0).
 *
 * ComplexSelector is a *shell*: it owns the trigger and the `dialog` popup, and
 * the consumer renders the interior. That is why the scene's interesting part is
 * split in two — the driver covers the shell (trigger text, open state, validation
 * state), and the swatch grid inside the popup is reached through the driver's
 * `within(...)`, which resolves a caller-supplied `ScenePart` against the popup.
 *
 * The first selector is the ordinary case. The second is required, invalid and
 * carries a `description`, so the ARIA the driver reads (`aria-required`,
 * `aria-invalid`, the composed `aria-describedby`) is all exercised; the third is
 * disabled.
 */
const SWATCHES = ['Sunrise', 'Dusk', 'Midnight'] as const;

export const ComplexSelectorExample = () => {
  const [palette, setPalette] = useState<string>('Sunrise');
  const [density, setDensity] = useState<string>('Comfortable');

  return (
    <div>
      <ComplexSelector
        label='Palette'
        data-testid='palette'
        triggerLabel={palette}
        value={palette}
        onChange={setPalette}>
        {(value: string, commit: (next: string) => void) => (
          <div data-testid='palette-body'>
            {SWATCHES.map(swatch => (
              <button
                key={swatch}
                type='button'
                data-testid={`swatch-${swatch}`}
                aria-pressed={value === swatch}
                onClick={() => commit(swatch)}>
                {swatch}
              </button>
            ))}
          </div>
        )}
      </ComplexSelector>

      <ComplexSelector
        label='Density'
        data-testid='density'
        description='Controls row height across the table'
        triggerLabel={density}
        value={density}
        onChange={setDensity}
        isRequired
        status={{ type: 'error', message: 'Pick a density' }}>
        {() => <div data-testid='density-body'>rows</div>}
      </ComplexSelector>

      <ComplexSelector label='Locked' data-testid='locked' triggerLabel='Default' value='Default' isDisabled>
        {() => <div>nothing</div>}
      </ComplexSelector>
    </div>
  );
};

export const complexSelectorUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ComplexSelector',
  ui: <ComplexSelectorExample />,
};
