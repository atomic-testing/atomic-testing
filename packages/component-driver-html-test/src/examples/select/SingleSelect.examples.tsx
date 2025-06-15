import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const SingleSelectExample = () => {
  return (
    <React.Fragment>
      <form>
        <select name='single-select'>
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

export const singleSelectUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Single Select',
  ui: <SingleSelectExample />,
};
