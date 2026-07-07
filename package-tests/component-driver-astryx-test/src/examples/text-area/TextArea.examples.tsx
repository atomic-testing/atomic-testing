import { TextArea } from '@astryxdesign/core/TextArea';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx TextArea scene.
 *
 * TextArea renders a native `<textarea>` and forwards `data-testid` onto it, so
 * the scene anchors there. Controlled value so `setValue` round-trips; `rows`
 * sets the visible row count.
 *
 * A second, disabled textarea carries a `disabledMessage`, exercising
 * `getDisabledMessage`'s resolution of the tooltip id out of the composed
 * `aria-describedby` list.
 */
export const TextAreaExample = () => {
  const [value, setValue] = useState('Hello');
  const [notes, setNotes] = useState('Submitted');

  return (
    <div>
      <TextArea label='Description' value={value} onChange={v => setValue(v)} rows={4} data-testid='desc-area' />
      <TextArea
        label='Notes'
        value={notes}
        onChange={v => setNotes(v)}
        data-testid='notes-area'
        isDisabled
        disabledMessage='Notes are locked after submission'
      />
    </div>
  );
};

export const textAreaUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TextArea',
  ui: <TextAreaExample />,
};
