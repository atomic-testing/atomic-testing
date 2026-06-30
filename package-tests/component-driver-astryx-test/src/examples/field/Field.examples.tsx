import { Field } from '@astryxdesign/core/Field';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX } from 'react';

/**
 * Astryx Field scene.
 *
 * Field forwards `data-testid` onto its root `<div>` and lays out the `<label>`,
 * a description `<span>`, the control, and (optionally) a status message. Astryx
 * encodes the optional/required state only as a visible label marker. Two fields:
 * one plain (clean label/description), one required with an error status.
 */
export const FieldExample = () => (
  <div>
    <Field label='Email' inputID='email-control' description='We never share it' data-testid='email-field'>
      <input id='email-control' />
    </Field>
    <Field
      label='Phone'
      inputID='phone-control'
      isRequired
      status={{ type: 'error', message: 'Phone is required' }}
      data-testid='phone-field'>
      <input id='phone-control' />
    </Field>
  </div>
);

export const fieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Field',
  ui: <FieldExample />,
};
