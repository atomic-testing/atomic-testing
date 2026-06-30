import { TextArea } from '@astryxdesign/core/TextArea';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx TextArea scene.
 *
 * TextArea renders a native `<textarea>` and forwards `data-testid` onto it, so
 * the scene anchors there. Controlled value so `setValue` round-trips; `rows`
 * sets the visible row count.
 */
export const TextAreaExample = () => {
  const [value, setValue] = useState('Hello');

  return <TextArea label='Description' value={value} onChange={v => setValue(v)} rows={4} data-testid='desc-area' />;
};

export const textAreaUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TextArea',
  ui: <TextAreaExample />,
};
