import { CheckboxList, CheckboxListItem } from '@astryxdesign/core/CheckboxList';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx CheckboxList scene.
 *
 * CheckboxList self-emits `data-testid` on its outer `<div>`; inside is a
 * `<ul role="list">` of `<li aria-checked>` rows. The per-item value is a React
 * key (not emitted to the DOM), so rows are addressed by their visible label.
 */
export const CheckboxListExample = () => {
  const [selected, setSelected] = useState<string[]>(['email']);

  return (
    <CheckboxList label='Notifications' value={selected} onChange={setSelected} data-testid='notifs'>
      <CheckboxListItem label='Email' value='email' />
      <CheckboxListItem label='SMS' value='sms' />
      <CheckboxListItem label='Push' value='push' />
    </CheckboxList>
  );
};

export const checkboxListUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx CheckboxList',
  ui: <CheckboxListExample />,
};
