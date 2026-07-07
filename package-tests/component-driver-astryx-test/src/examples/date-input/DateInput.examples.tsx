import type { ISODateString } from '@astryxdesign/core/Calendar';
import { DateInput } from '@astryxdesign/core/DateInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

const BirthdayInput = () => {
  const [value, setValue] = useState<ISODateString | undefined>('2024-01-15');
  return <DateInput data-testid='birthday' label='Birthday' value={value} onChange={setValue} hasClear />;
};

const DeadlineInput = () => {
  const [value, setValue] = useState<ISODateString | undefined>(undefined);
  return <DateInput data-testid='deadline' label='Deadline' value={value} onChange={setValue} />;
};

const LockedInput = () => (
  <DateInput
    data-testid='locked'
    label='Event date'
    value={undefined}
    onChange={() => {}}
    isDisabled
    disabledMessage='You need the Editor role to change this'
  />
);

/**
 * Astryx DateInput scene.
 *
 * DateInput self-emits `data-testid`; the editable control is an
 * `<input role="combobox">` (value = display string) with an "Open calendar"
 * toggle. `birthday` is pre-filled with a clear control; `deadline` starts empty.
 * `locked` is disabled with a `disabledMessage`, so its `<input>` renders a
 * `role="tooltip"` layer reached through the composed `aria-describedby`.
 */
export const DateInputExample = () => (
  <>
    <BirthdayInput />
    <DeadlineInput />
    <LockedInput />
  </>
);

export const dateInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DateInput',
  ui: <DateInputExample />,
};
