import React from 'react';
import { byDataTestId, IExampleUnit, ScenePart } from '@testzilla/core';
import { HTMLTextInputDriver } from '@testzilla/component-driver-html';

export const UncontrolTextInputExample = () => {
  return (
    <React.Fragment>
      <input type="text" data-testid="basic-text-input" />
    </React.Fragment>
  );
};

export const uncontrolTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('basic-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const uncontrolTextInputExample: IExampleUnit<typeof uncontrolTextInputExampleScenePart, JSX.Element> = {
  title: 'Uncontrol text input',
  scene: uncontrolTextInputExampleScenePart,
  ui: <UncontrolTextInputExample />,
}



export const ControlTextInputExample = () => {
  const [value, setValue] = React.useState('');
  const input_onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);
  return (
    <React.Fragment>
      <input type="text" data-testid="basic-text-input" value={value} onChange={input_onChange} />
    </React.Fragment>
  );
};

export const controlTextInputExampleScenePart = {
  input: {
    locator: byDataTestId('basic-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const controlTextInputExample: IExampleUnit<typeof uncontrolTextInputExampleScenePart, JSX.Element> = {
  title: 'Control text input',
  scene: controlTextInputExampleScenePart,
  ui: <ControlTextInputExample />,
}




export const textInputExamples = [
  uncontrolTextInputExample,
  controlTextInputExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
