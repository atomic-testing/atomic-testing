import React from 'react';
import { byName, IExampleUnit, ScenePart } from '@testzilla/core';
import { HTMLSelectDriver } from '@testzilla/component-driver-html';

export const SingleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name="single-select">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
          <option value="5">Five</option>
        </select>
      </form>
    </React.Fragment>
  );
};

export const singleSelectExampleScenePart = {
  select: {
    locator: byName('single-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const singleSelectExample: IExampleUnit<typeof singleSelectExampleScenePart, JSX.Element> = {
  title: 'Single Select',
  scene: singleSelectExampleScenePart,
  ui: <SingleSelectExample />,
}


export const MultipleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name="multiple-select" multiple size={5}>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          <option value="4">Four</option>
          <option value="5">Five</option>
        </select>
      </form>
    </React.Fragment>
  );
};

export const multipleSelectExampleScenePart = {
  select: {
    locator: byName('multiple-select'),
    driver: HTMLSelectDriver,
  },
} satisfies ScenePart;

export const multipleSelectExample: IExampleUnit<typeof multipleSelectExampleScenePart, JSX.Element> = {
  title: 'Multiple Select',
  scene: multipleSelectExampleScenePart,
  ui: <MultipleSelectExample />,
}



export const selectExamples = [
  singleSelectExample,
  multipleSelectExample,
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
