import React, { JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const UncontrolledTextInputExample = () => {
  return (
    <React.Fragment>
      <div>
        Text input: <input type='text' data-testid='uncontrolled-text-input' />
      </div>
      <div>
        Number: <input type='number' data-testid='uncontrolled-number-input' />
      </div>
      <div>
        Date: <input type='date' data-testid='uncontrolled-date-input' />
      </div>
      <div>
        Datetime-local: <input type='datetime-local' data-testid='uncontrolled-datetime-local-input' />
      </div>
      <div>
        Time: <input type='time' data-testid='uncontrolled-time-input' />
      </div>
    </React.Fragment>
  );
};

export const uncontrolledTextInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Uncontrolled text input',
  ui: <UncontrolledTextInputExample />,
};
