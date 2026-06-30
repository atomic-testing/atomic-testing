import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

export const TextInputCapabilitiesExample = () => {
  return (
    <React.Fragment>
      <div>
        Plain: <input type='text' data-testid='capability-plain-input' />
      </div>
      <div>
        Disabled: <input type='text' data-testid='capability-disabled-input' disabled />
      </div>
      <div>
        Readonly: <input type='text' data-testid='capability-readonly-input' readOnly defaultValue='read only' />
      </div>
      <div>
        Required: <input type='text' data-testid='capability-required-input' required />
      </div>
      <div>
        Invalid: <input type='text' data-testid='capability-invalid-input' aria-invalid='true' />
      </div>
    </React.Fragment>
  );
};

export const textInputCapabilitiesUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Text input capabilities',
  ui: <TextInputCapabilitiesExample />,
};
