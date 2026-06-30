import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useCallback } from 'react';

export const KeyboardEventExample = () => {
  const [lastKey, setLastKey] = React.useState<string>('');
  const [modifiers, setModifiers] = React.useState<string>('');
  const [plainEnterCount, setPlainEnterCount] = React.useState<number>(0);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    setLastKey(event.key);

    // Record which modifiers were held, in a stable order, so a test can assert
    // that pressKey's chord flags (ctrl/shift/alt/meta) arrived on the event.
    const held: string[] = [];
    if (event.ctrlKey) {
      held.push('ctrl');
    }
    if (event.shiftKey) {
      held.push('shift');
    }
    if (event.altKey) {
      held.push('alt');
    }
    if (event.metaKey) {
      held.push('meta');
    }
    setModifiers(held.join(','));

    // The "plain Enter" handler — e.g. a form-submit shortcut — fires ONLY for
    // an unmodified Enter. Shift+Enter (newline) must leave this count untouched,
    // which is the negative case proving modifiers reach the handler.
    if (event.key === 'Enter' && !event.shiftKey) {
      setPlainEnterCount(count => count + 1);
    }
  }, []);

  return (
    <React.Fragment>
      <div>
        <input data-testid='key-target' onKeyDown={onKeyDown} />
      </div>
      {/* Records the `KeyboardEvent.key` of the most recent keydown so a test can
          assert that pressKey dispatched the expected key. */}
      <div data-testid='key-detail'>{lastKey}</div>
      {/* Records the modifier keys held during the most recent keydown, joined as
          a stable ctrl,shift,alt,meta-ordered string. */}
      <div data-testid='key-modifiers'>{modifiers}</div>
      {/* Counts only unmodified-Enter keydowns; stays 0 for Shift+Enter. */}
      <div data-testid='plain-enter-count'>{plainEnterCount}</div>
    </React.Fragment>
  );
};

export const keyboardEventUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Keyboard event',
  ui: <KeyboardEventExample />,
};
