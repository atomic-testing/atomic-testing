import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

//#region Checkbox group
export const CheckboxGroup = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type='checkbox' name='checkbox-group' value='1' /> One
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='2' /> Two
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='3' /> Three
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='4' /> Four
        </label>
        <br />
        <label>
          <input type='checkbox' name='checkbox-group' value='5' /> Five
        </label>
        <br />
      </form>
    </React.Fragment>
  );
};

export const checkboxGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Checkbox group',
  ui: <CheckboxGroup />,
};
//#endregion
