import { IconButton } from '@astryxdesign/core/IconButton';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx IconButton scene.
 *
 * IconButton is always icon-only, so Astryx always emits an explicit `aria-label`
 * (the visible content is the icon) and forwards `data-testid` onto the native
 * `<button>` — the scene anchors there. A click counter proves the driver's click
 * reaches the handler; a disabled instance exercises `isDisabled`.
 */
export const IconButtonExample = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <div>
      <IconButton
        label='Settings'
        icon={<span>S</span>}
        data-testid='settings-button'
        onClick={() => setClicks(c => c + 1)}
      />
      <span data-testid='icon-click-count'>{clicks}</span>

      <IconButton label='Delete' icon={<span>D</span>} data-testid='delete-button' isDisabled />
    </div>
  );
};

export const iconButtonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx IconButton',
  ui: <IconButtonExample />,
};
