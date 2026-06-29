import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx CheckboxInput scene.
 *
 * The accessible control is the native `<input type="checkbox">`; the root is a
 * plain `<div>` and Astryx does NOT forward `data-testid`, so each instance is
 * wrapped in a testid'd container and the scene scopes to the inner checkbox. The
 * "All" instance is rendered indeterminate (`aria-checked="mixed"`).
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
    </div>
  );
};

export const checkboxInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CheckboxInput',
  ui: <CheckboxInputExample />,
};
