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
 * Four instances cover the readable surface: a basic single-file input, a required
 * multi-file dropzone, a disabled input carrying an error `status`, and a disabled
 * input carrying a `disabledMessage`. The last exercises `getDisabledMessage`,
 * which — unlike the other reads above — resolves through the focusable
 * `div[role="button"]` wrapper's `aria-describedby`, not the hidden input's (Astryx
 * 0.1.3 moved that link onto the wrapper).
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
    <FileInput
      label='Contract'
      isDisabled
      disabledMessage='Uploads are locked until your profile is verified'
      value={null}
      onChange={() => {}}
      data-testid='fi-disabled-message'
    />
  </div>
);

export const fileInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx FileInput',
  ui: <FileInputExample />,
};
