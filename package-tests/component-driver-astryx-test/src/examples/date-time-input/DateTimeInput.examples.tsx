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

const LockedInput = () => (
  <DateTimeInput
    data-testid='locked'
    label='Meeting time'
    value={undefined}
    onChange={() => {}}
    isDisabled
    disabledMessage='You need the Editor role to change this'
  />
);

/**
 * Astryx DateTimeInput scene.
 *
 * DateTimeInput self-emits `data-testid` and pairs a date `<input role="combobox">`
 * (with a calendar popover) and a time `<input>`. Astryx 0.1.3 no longer gives the
 * time field a fixed `aria-label="Time"` — it defaults to `"{label} time"` and is
 * overridable via `timeLabel`, so DateTimeInputDriver reaches it structurally
 * instead (whichever input isn't the date combobox). `meeting` is
 * pre-filled; `reminder` starts empty. `locked` is disabled with a
 * `disabledMessage`: Astryx wires its `aria-describedby` onto the date field only,
 * so its `role="tooltip"` layer is reached through that field's composed
 * `aria-describedby`.
 */
export const DateTimeInputExample = () => (
  <>
    <MeetingInput />
    <ReminderInput />
    <LockedInput />
  </>
);

export const dateTimeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DateTimeInput',
  ui: <DateTimeInputExample />,
};
