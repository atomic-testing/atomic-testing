import { CheckboxList, CheckboxListItem } from '@astryxdesign/core/CheckboxList';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx CheckboxList scene.
 *
 * CheckboxList self-emits `data-testid` on its outer `<div>`; inside is a
 * `<ul role="list">` of `<li aria-checked>` rows. The per-item value is a React
 * key (not emitted to the DOM), so rows are addressed by their visible label.
 *
 * The second group is disabled with a group-level `disabledMessage`: the
 * tooltip's `aria-describedby` link composes onto the inner `role="group"`
 * div, not onto any individual row.
 */
export const CheckboxListExample = () => {
  const [selected, setSelected] = useState<string[]>(['email']);

  return (
    <div>
      <CheckboxList label='Notifications' value={selected} onChange={setSelected} data-testid='notifs'>
        <CheckboxListItem label='Email' value='email' />
        <CheckboxListItem label='SMS' value='sms' />
        <CheckboxListItem label='Push' value='push' />
      </CheckboxList>
      <CheckboxList
        label='Locked notifications'
        value={['email']}
        onChange={() => {}}
        isDisabled
        disabledMessage='Notifications are managed by your administrator'
        data-testid='locked-notifs'>
        <CheckboxListItem label='Email' value='email' />
        <CheckboxListItem label='SMS' value='sms' />
      </CheckboxList>
    </div>
  );
};

export const checkboxListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CheckboxList',
  ui: <CheckboxListExample />,
};
