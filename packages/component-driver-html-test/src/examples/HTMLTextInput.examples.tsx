import React from 'react';
import { byDataTestId, IExampleUnit, ScenePart } from '@testzilla/core';
import { HTMLTextInputDriver } from '@testzilla/component-driver-html';

/**
 * Basic select example from MUI's website
 * @see https://mui.com/material-ui/react-select/#basic-select
 */
export const BasicTextInputExample = () => {
  return (
    <React.Fragment>
      <input type="text" data-testid="basic-text-input" />
    </React.Fragment>
    
  );
};

export const basicTextInputExampleScenePart = {
  select: {
    locator: byDataTestId('basic-text-input'),
    driver: HTMLTextInputDriver,
  },
} satisfies ScenePart;

export const selectExamples = [
  {
    title: 'Basic Text Input',
    scene: basicTextInputExampleScenePart,
    ui: <BasicTextInputExample />,
  },
] satisfies IExampleUnit<ScenePart, JSX.Element>[];
