import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback } from 'react';

export const KeyboardEventExample = () => {
  const [lastKey, setLastKey] = React.useState<string>('');

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    setLastKey(event.key);
  }, []);

  return (
    <React.Fragment>
      <div>
        <input data-testid='key-target' onKeyDown={onKeyDown} />
      </div>
      {/* Records the `KeyboardEvent.key` of the most recent keydown so a test can
          assert that pressKey dispatched the expected key. */}
      <div data-testid='key-detail'>{lastKey}</div>
    </React.Fragment>
  );
};

export const keyboardEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Keyboard event',
  ui: <KeyboardEventExample />,
};
