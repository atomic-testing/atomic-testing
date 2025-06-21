import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

//#region Single checkbox
export const SingleCheckbox = () => {
  return (
    <React.Fragment>
      <form>
        <label>
          <input type='checkbox' name='single-checkbox' value='1' /> One
        </label>
      </form>
    </React.Fragment>
  );
};

export const singleCheckboxUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Single checkbox',
  ui: <SingleCheckbox />,
};
//#endregion
