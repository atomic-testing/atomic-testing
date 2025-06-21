import React from 'react';
import { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

//#region Uncontrolled radio button group example
export const UncontrolledRadioButtonGroupExample = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type='radio' name='uncontrolled-group' value='1' /> One
        </label>
        <br />
        <label>
          <input type='radio' name='uncontrolled-group' value='2' /> Two
        </label>
        <br />
        <label>
          <input type='radio' name='uncontrolled-group' value='3' /> Three
        </label>
      </form>
    </React.Fragment>
  );
};

export const uncontrolledRadioButtonGroupUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Uncontrolled radio button group',
  ui: <UncontrolledRadioButtonGroupExample />,
};
//#endregion
