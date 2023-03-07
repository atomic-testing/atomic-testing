import React from 'react';
import { byName, IExampleUnit, ScenePart } from '@testzilla/core';
import { HTMLRadioButtonGroupDriver } from '@testzilla/component-driver-html';

export const UncontrolRadioButtonGroupExample = () => {
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

export const uncontrolRadioButtonGroupExampleScenePart = {
  input: {
    locator: byName('uncontrolled-group'),
    driver: HTMLRadioButtonGroupDriver,
  },
} satisfies ScenePart;

export const uncontrolledRadioButtonGroupExample: IExampleUnit<typeof uncontrolRadioButtonGroupExampleScenePart, JSX.Element> = {
  title: 'Uncontrolled radio button group',
  scene: uncontrolRadioButtonGroupExampleScenePart,
  ui: <UncontrolRadioButtonGroupExample />,
}

export const radioButtonGroupExamples = [
  uncontrolledRadioButtonGroupExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
