import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const MultipleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name='multiple-select' multiple size={5}>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
          <option value='4'>Four</option>
          <option value='5'>Five</option>
        </select>
      </form>
    </React.Fragment>
  );
};

export const multipleSelectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Multiple Select',
  ui: <MultipleSelectExample />,
};
