import { DateTimeInput, type ISODateTimeString } from '@astryxdesign/core/DateTimeInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

const MeetingInput = () => {
  // ISODateTimeString is a branded type; cast the seed literal once.
  const [value, setValue] = useState<ISODateTimeString | undefined>('2024-01-15T10:30' as ISODateTimeString);
  return <DateTimeInput data-testid='meeting' label='Meeting' value={value} onChange={setValue} />;
};

const ReminderInput = () => {
  const [value, setValue] = useState<ISODateTimeString | undefined>(undefined);
  return <DateTimeInput data-testid='reminder' label='Reminder' value={value} onChange={setValue} />;
};

/**
 * Astryx DateTimeInput scene.
 *
 * DateTimeInput self-emits `data-testid` and pairs a date `<input role="combobox">`
 * (with a calendar popover) and a time `<input aria-label="Time">`. `meeting` is
 * pre-filled; `reminder` starts empty.
 */
export const DateTimeInputExample = () => (
  <>
    <MeetingInput />
    <ReminderInput />
  </>
);

export const dateTimeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DateTimeInput',
  ui: <DateTimeInputExample />,
};
