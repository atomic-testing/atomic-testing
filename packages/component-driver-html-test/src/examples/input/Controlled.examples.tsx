import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const ControlledTextInputExample = () => {
  const [value, setValue] = React.useState('');
  const input_onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return (
    <React.Fragment>
      <input type='text' data-testid='controlled-text-input' value={value} onChange={input_onChange} />
    </React.Fragment>
  );
};

export const controlledTextInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Control text input',
  ui: <ControlledTextInputExample />,
};
