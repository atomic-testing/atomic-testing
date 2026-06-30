import { TimeInput } from '@astryxdesign/core/TimeInput';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx TimeInput scene.
 *
 * TimeInput renders a plain `<input type="text">` whose value is a formatted
 * display string (not ISO). It does NOT forward `data-testid`, so the example
 * wraps it in a testid'd container and the scene scopes to the inner text input.
 */
export const TimeInputExample = () => {
  // TimeInput's value is a branded ISO time string; cast the controlled state.
  const [time, setTime] = useState<string>('09:30');

  return (
    <div data-testid='time-wrap'>
      <TimeInput label='Start time' value={time as never} onChange={v => setTime((v as string) ?? '')} />
    </div>
  );
};

export const timeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TimeInput',
  ui: <TimeInputExample />,
};
