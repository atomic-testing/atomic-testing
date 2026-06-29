import { FileInput } from '@astryxdesign/core/FileInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX } from 'react';

/**
 * Astryx FileInput scene.
 *
 * FileInput is a controlled component (`value` + `onChange` are required), so each
 * instance gets `value={null}` and a no-op `onChange`. Astryx forwards `data-testid`
 * onto the **hidden native `<input type="file">`** — where `accept`, `multiple`,
 * `aria-required`, `aria-invalid`, `disabled`, and the `aria-describedby` status link
 * all live — so the scene anchors there.
 *
 * Three instances cover the readable surface: a basic single-file input, a required
 * multi-file dropzone, and a disabled input carrying an error `status`.
 */
export const FileInputExample = () => (
  <div>
    <FileInput label='Resume' accept='.pdf,.doc' value={null} onChange={() => {}} data-testid='fi-basic' />
    <FileInput
      label='Attachments'
      mode='dropzone'
      isMultiple
      isRequired
      value={null}
      onChange={() => {}}
      data-testid='fi-multi'
    />
    <FileInput
      label='Document'
      isDisabled
      status={{ type: 'error', message: 'File too large' }}
      value={null}
      onChange={() => {}}
      data-testid='fi-error'
    />
  </div>
);

export const fileInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx FileInput',
  ui: <FileInputExample />,
};
