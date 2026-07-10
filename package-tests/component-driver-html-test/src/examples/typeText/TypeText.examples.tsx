import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback } from 'react';

export const TypeTextExample = () => {
  const [keydownCount, setKeydownCount] = React.useState<number>(0);
  const [editableText, setEditableText] = React.useState<string>('');
  const [editableInputEventCount, setEditableInputEventCount] = React.useState<number>(0);

  const onInputKeyDown = useCallback(() => setKeydownCount(count => count + 1), []);

  const onEditableInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    setEditableText(event.currentTarget.textContent ?? '');
    setEditableInputEventCount(count => count + 1);
  }, []);

  return (
    <React.Fragment>
      <div>
        <input data-testid='type-target' onKeyDown={onInputKeyDown} />
      </div>
      {/* Counts keydowns on the input so a test can assert typeText dispatched
          exactly one keystroke per character — the property enterText's
          value-fill path does not have. */}
      <div data-testid='type-keydown-count'>{keydownCount}</div>
      {/* A keystroke-driven editor: contenteditable has no `value` to fill, so
          its committed text only changes through real key/input events — the
          gap typeText exists to close. The explicit size keeps the empty
          element visible so the browser engine will focus and type into it,
          and tabIndex makes it focusable under jsdom, which does not treat a
          bare contenteditable as a focusable area (real editors — e.g. the MUI
          picker section spans — carry a tabindex for the same reason). */}
      <div
        data-testid='editable-target'
        contentEditable
        suppressContentEditableWarning
        tabIndex={0}
        onInput={onEditableInput}
        style={{ minHeight: 24, width: 200, border: '1px solid #999' }}
      />
      {/* Mirrors the contenteditable text out of React state, proving the typed
          characters arrived as input events the component could observe. */}
      <div data-testid='editable-mirror'>{editableText}</div>
      <div data-testid='editable-input-count'>{editableInputEventCount}</div>
    </React.Fragment>
  );
};

export const typeTextUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Type text',
  ui: <TypeTextExample />,
};
