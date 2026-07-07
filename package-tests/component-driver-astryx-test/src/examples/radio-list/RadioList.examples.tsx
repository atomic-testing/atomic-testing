import { RadioList, RadioListItem } from '@astryxdesign/core/RadioList';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx RadioList scene.
 *
 * RadioList self-emits `data-testid` on its OUTER `<div>`; inside, native
 * `<input type="radio" value>` controls live under a `role="radiogroup"`. Anchor
 * the outer testid and read/select by radio `value`.
 *
 * The second group is disabled with a group-level `disabledMessage`: the
 * tooltip's `aria-describedby` link composes onto the inner
 * `role="radiogroup"` div, not onto any individual radio.
 */
export const RadioListExample = () => {
  const [pref, setPref] = useState('email');

  return (
    <div>
      <RadioList label='Notification preference' value={pref} onChange={setPref} data-testid='prefs'>
        <RadioListItem label='Email' value='email' />
        <RadioListItem label='SMS' value='sms' />
        <RadioListItem label='Push' value='push' />
      </RadioList>
      <RadioList
        label='Locked preference'
        value='email'
        onChange={() => {}}
        isDisabled
        disabledMessage='Preference is managed by your administrator'
        data-testid='locked-prefs'>
        <RadioListItem label='Email' value='email' />
        <RadioListItem label='SMS' value='sms' />
      </RadioList>
    </div>
  );
};

export const radioListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx RadioList',
  ui: <RadioListExample />,
};
