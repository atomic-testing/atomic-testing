import React, { useCallback, JSX } from 'react';

import { IExampleUIUnit } from '@atomic-testing/core';

export const FocusEventExample = () => {
  const [showDetail, setShowDetail] = React.useState<string>('');

  const onFocus = useCallback(() => {
    setShowDetail('focus');
  }, []);

  const onBlur = useCallback(() => {
    setShowDetail('blur');
  }, []);

  return (
    <React.Fragment>
      <div>
        <input data-testid='focus-target' onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        {/* Blur aid is used to incur blur event on focus target by focusing on the aid element */}
        <input data-testid='blur-aid' />
      </div>
      <div data-testid='focus-detail'>{showDetail}</div>
    </React.Fragment>
  );
};

export const focusEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Focus event',
  ui: <FocusEventExample />,
};
