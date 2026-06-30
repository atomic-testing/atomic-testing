import { Button } from '@astryxdesign/core/Button';
import { ButtonGroup } from '@astryxdesign/core/ButtonGroup';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx ButtonGroup scene.
 *
 * ButtonGroup renders a `role="group"` root that self-emits `data-testid` and
 * carries the accessible name + orientation; its children are plain `<button>`s
 * addressed by their visible text. A click counter on Copy proves `clickButton`
 * reaches the right child's handler.
 */
export const ButtonGroupExample = () => {
  const [copies, setCopies] = useState(0);

  return (
    <div>
      <ButtonGroup label='Text actions' data-testid='text-actions'>
        <Button label='Copy' onClick={() => setCopies(c => c + 1)} />
        <Button label='Cut' />
        <Button label='Paste' />
      </ButtonGroup>
      <span data-testid='copy-count'>{copies}</span>
    </div>
  );
};

export const buttonGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx ButtonGroup',
  ui: <ButtonGroupExample />,
};
