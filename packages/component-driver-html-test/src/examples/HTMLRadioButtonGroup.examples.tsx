import React from 'react';
import { byName, IExampleUnit, ScenePart } from '@testzilla/core';
import { HTMLRadioButtonGroupDriver } from '@testzilla/component-driver-html';

export const UncontrolTextInputExample = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type="radio" name="uncontrolled-group" value="1" /> One
        </label>
        <br />
        <label>
          <input type="radio" name="uncontrolled-group" value="2" /> Two
        </label>
        <br />
        <label>
          <input type="radio" name="uncontrolled-group" value="3" /> Three
        </label>
      </form>
    </React.Fragment>
  );
};

export const uncontrolTextInputExampleScenePart = {
  input: {
    locator: byName('uncontrolled-group'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export const uncontrolledRadioButtonGroupExample: IExampleUnit<typeof uncontrolTextInputExampleScenePart, JSX.Element> = {
  title: 'Uncontrolled radio button group',
  scene: uncontrolTextInputExampleScenePart,
  ui: <UncontrolTextInputExample />,
}

export const radioButtonGroupExamples = [
  uncontrolledRadioButtonGroupExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
