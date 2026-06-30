import { Calendar, type DateRange, type ISODateString } from '@astryxdesign/core/Calendar';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

const SingleCalendar = () => {
  const [value, setValue] = useState<ISODateString>('2024-01-15');
  return <Calendar data-testid='single-cal' mode='single' value={value} onChange={val => setValue(val)} />;
};

const RangeCalendar = () => {
  const [value, setValue] = useState<DateRange>({ start: '2024-01-10', end: '2024-01-20' });
  return <Calendar data-testid='range-cal' mode='range' value={value} onChange={val => setValue(val)} />;
};

/**
 * Astryx Calendar scene.
 *
 * Calendar self-emits `data-testid` and `data-mode` on the root `<div>`. Day cells
 * are `[data-date]` buttons; the visible month is the grid's `aria-label`. A
 * single-select and a range calendar verify both modes and selector scoping.
 */
export const CalendarExample = () => (
  <>
    <SingleCalendar />
    <RangeCalendar />
  </>
);

export const calendarUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Calendar',
  ui: <CalendarExample />,
};
