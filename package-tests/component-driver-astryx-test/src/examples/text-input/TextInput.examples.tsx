import { TextInput } from '@astryxdesign/core/TextInput';
import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useState } from 'react';

/**
 * Astryx TextInput scene.
 *
 * Astryx forwards `data-testid` onto the inner `<input>`, so each control is
 * anchored there directly — value read/write operate on the real input. The
 * visible `<label for>` and the floating status message are wired by native a11y
 * links (`for`↔`id`, `aria-describedby`↔`id`), which is how the driver reaches
 * them — never via a StyleX-hashed class.
 *
 * Two inputs prove locator disambiguation; the second is required with both a
 * description and an error status so `isRequired`/`isInvalid` have something to
 * read and `getStatusMessage` must resolve the status from a multi-id
 * `aria-describedby` (description id + status id), not just a single id.
 */
export const TextInputExample = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <TextInput label='Name' data-testid='name-input' value={name} onChange={v => setName(v)} />
      <TextInput
        label='Email'
        data-testid='email-input'
        value={email}
        onChange={v => setEmail(v)}
        isRequired
        description='We never share it'
        status={{ type: 'error', message: 'Email is required' }}
      />
    </div>
  );
};

export const textInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TextInput',
  ui: <TextInputExample />,
};
