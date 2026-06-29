import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback } from 'react';

// Two independent step=1 range inputs, each echoing its value into a sibling
// <div>. The echo proves a change event actually fired (the controlled state
// updated), not merely that the value attribute was poked; two instances catch a
// too-broad locator that would drive the wrong slider.
export const RangeInputExample = () => {
  const [primary, setPrimary] = React.useState(20);
  const [secondary, setSecondary] = React.useState(10);

  const primary_onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimary(Number(e.target.value));
  }, []);
  const secondary_onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondary(Number(e.target.value));
  }, []);

  return (
    <React.Fragment>
      <input
        data-testid='range-primary'
        type='range'
        min={0}
        max={100}
        step={1}
        value={primary}
        onChange={primary_onChange}
      />
      <div data-testid='range-primary-value'>{primary}</div>
      <input
        data-testid='range-secondary'
        type='range'
        min={0}
        max={100}
        step={1}
        value={secondary}
        onChange={secondary_onChange}
      />
      <div data-testid='range-secondary-value'>{secondary}</div>
    </React.Fragment>
  );
};

export const rangeInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Range input (slider)',
  ui: <RangeInputExample />,
};
