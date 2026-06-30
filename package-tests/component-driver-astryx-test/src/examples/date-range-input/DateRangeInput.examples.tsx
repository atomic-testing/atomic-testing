import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

type Range = { start: string; end: string } | null;

const presets = [
  { label: 'Last 7 days', getRange: () => ({ start: '2024-01-09', end: '2024-01-15' }) },
  { label: 'Last 30 days', getRange: () => ({ start: '2023-12-17', end: '2024-01-15' }) },
];

const ReportRange = () => {
  const [value, setValue] = useState<Range>(null);
  return (
    <DateRangeInput
      data-testid='report'
      label='Report range'
      value={value as never}
      onChange={val => setValue(val as never)}
      presets={presets as never}
      hasClear
    />
  );
};

const BudgetRange = () => {
  const [value, setValue] = useState<Range>(null);
  return (
    <DateRangeInput
      data-testid='budget'
      label='Budget range'
      value={value as never}
      onChange={val => setValue(val as never)}
      presets={presets as never}
    />
  );
};

/**
 * Astryx DateRangeInput scene.
 *
 * DateRangeInput self-emits `data-testid`; the trigger is a
 * `<button aria-haspopup="dialog">` whose text is the display range and whose
 * `aria-controls` (when open) points at the popover holding preset options and a
 * range calendar. Two range inputs verify selector scoping.
 */
export const DateRangeInputExample = () => (
  <>
    <ReportRange />
    <BudgetRange />
  </>
);

export const dateRangeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx DateRangeInput',
  ui: <DateRangeInputExample />,
};
