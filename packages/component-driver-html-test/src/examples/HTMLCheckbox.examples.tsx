import { HTMLCheckboxDriver, HTMLCheckboxGroupDriver } from '@atomic-testing/component-driver-html';
import { byName, IExampleUnit, ScenePart } from '@atomic-testing/core';
import React from 'react';

//#region Multiple checkbox
export const SingleCheckbox = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type="checkbox" name="single-checkbox" value="1" /> One
        </label>
      </form>
    </React.Fragment>
  );
};

export const singleCheckboxScenePart = {
  toggle: {
    locator: byName('single-checkbox'),
    driver: HTMLCheckboxDriver,
  },
} satisfies ScenePart;

export const singleCheckboxExample: IExampleUnit<typeof singleCheckboxScenePart, JSX.Element> = {
  title: 'Single checkbox',
  scene: singleCheckboxScenePart,
  ui: <SingleCheckbox />,
};
//#endregion

//#region Checkbox group
export const CheckboxGroup = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type="checkbox" name="checkbox-group" value="1" /> One
        </label>
        <br />
        <label>
          <input type="checkbox" name="checkbox-group" value="2" /> Two
        </label>
        <br />
        <label>
          <input type="checkbox" name="checkbox-group" value="3" /> Three
        </label>
        <br />
        <label>
          <input type="checkbox" name="checkbox-group" value="4" /> Four
        </label>
        <br />
        <label>
          <input type="checkbox" name="checkbox-group" value="5" /> Five
        </label>
        <br />
      </form>
    </React.Fragment>
  );
};

export const checkboxGroupScenePart = {
  toggles: {
    locator: byName('checkbox-group'),
    driver: HTMLCheckboxGroupDriver,
  },
} satisfies ScenePart;

export const checkboxGroupExample: IExampleUnit<typeof checkboxGroupScenePart, JSX.Element> = {
  title: 'Checkbox group',
  scene: checkboxGroupScenePart,
  ui: <CheckboxGroup />,
};
//#endregion

export const checkboxExamples = [singleCheckboxExample, checkboxGroupExample] satisfies IExampleUnit<
  ScenePart,
  JSX.Element
>[];
