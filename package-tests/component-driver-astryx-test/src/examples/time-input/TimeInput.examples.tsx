import { TimeInput } from '@astryxdesign/core/TimeInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx TimeInput scene.
 *
 * TimeInput renders a plain `<input type="text">` whose value is a formatted
 * display string (not ISO). It does NOT forward `data-testid`, so the example
 * wraps it in a testid'd container and the scene scopes to the inner text input.
 * The "locked" instance is disabled with a `disabledMessage`, so its `<input>`
 * renders a `role="tooltip"` layer reached through the composed
 * `aria-describedby`.
 */
export const TimeInputExample = () => {
  // TimeInput's value is a branded ISO time string; cast the controlled state.
  const [time, setTime] = useState<string>('09:30');

  return (
    <>
      <div data-testid='time-wrap'>
        <TimeInput label='Start time' value={time as never} onChange={v => setTime((v as string) ?? '')} />
      </div>
      <div data-testid='locked-wrap'>
        <TimeInput
          label='End time'
          value={undefined}
          onChange={() => {}}
          isDisabled
          disabledMessage='You need the Editor role to change this'
        />
      </div>
    </>
  );
};

export const timeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TimeInput',
  ui: <TimeInputExample />,
};
