import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx CheckboxInput scene.
 *
 * The accessible control is the native `<input type="checkbox">`; the root is a
 * plain `<div>` and Astryx does NOT forward `data-testid`, so each instance is
 * wrapped in a testid'd container and the scene scopes to the inner checkbox. The
 * "All" instance is rendered indeterminate (read via the native `:indeterminate`
 * pseudo-class — Astryx 0.1.3 dropped `aria-checked="mixed"`). The
 * "Locked" instance is disabled with a `disabledMessage`, so its native
 * `<input>` renders a `role="tooltip"` layer reached through the composed
 * `aria-describedby`.
 */
export const CheckboxInputExample = () => {
  const [accept, setAccept] = useState(true);
  const [subscribe, setSubscribe] = useState(false);

  return (
    <div>
      <div data-testid='accept-wrap'>
        <CheckboxInput label='Accept terms' value={accept} onChange={c => setAccept(c)} />
      </div>
      <div data-testid='subscribe-wrap'>
        <CheckboxInput label='Subscribe' value={subscribe} onChange={c => setSubscribe(c)} />
      </div>
      <div data-testid='all-wrap'>
        <CheckboxInput label='All' value='indeterminate' onChange={() => {}} />
      </div>
      <div data-testid='locked-wrap'>
        <CheckboxInput
          label='Locked'
          value={false}
          onChange={() => {}}
          isDisabled
          disabledMessage='Managed by your administrator'
        />
      </div>
    </div>
  );
};

export const checkboxInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CheckboxInput',
  ui: <CheckboxInputExample />,
};
