import { HTMLTextInputDriver } from '@atomic-testing/component-driver-html';
import { byDataTestId, IExampleUnit, ScenePart } from '@atomic-testing/core';
import React from 'react';

export const UncontrolledTextInputExample = () => {
  return (
    <React.Fragment>
      <input type="text" data-testid="uncontrolled-text-input" />
    </React.Fragment>
  );
};

export const uncontrolledTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('uncontrolled-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const uncontrolledTextInputExample: IExampleUnit<typeof uncontrolledTextInputExampleScenePart, JSX.Element> = {
  title: 'Uncontrol text input',
  scene: uncontrolledTextInputExampleScenePart,
  ui: <UncontrolledTextInputExample />,
};

export const ControlledTextInputExample = () => {
  const [value, setValue] = React.useState('');
  const input_onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return (
    <React.Fragment>
      <input type="text" data-testid="controlled-text-input" value={value} onChange={input_onChange} />
    </React.Fragment>
  );
};

export const controlledTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('controlled-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const controlledTextInputExample: IExampleUnit<typeof uncontrolledTextInputExampleScenePart, JSX.Element> = {
  title: 'Control text input',
  scene: controlledTextInputExampleScenePart,
  ui: <ControlledTextInputExample />,
};

export const textInputExamples = [uncontrolledTextInputExample, controlledTextInputExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
