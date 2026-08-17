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
 *
 * A third input is disabled with a `disabledMessage`, exercising
 * `getDisabledMessage`'s resolution of the tooltip id out of that same
 * multi-id `aria-describedby` list (Astryx composes the disabled-message
 * tooltip alongside description/status ids). Because showing that message
 * requires the field to stay focusable, Astryx renders it `aria-disabled` +
 * `readonly` rather than natively `disabled` — the case `isReadOnly` must not
 * mistake for read-only.
 *
 * The fourth input is Astryx 0.4.0's genuine `isReadOnly`, and the fifth carries
 * `statusVariant="tooltip"` (0.2.0), whose message lives in a `role="tooltip"`
 * layer with no `data-type` severity marker — the shape `getStatusMessage` needs
 * its fallback for.
 */
export const TextInputExample = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [owner, setOwner] = useState('Alice');

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
      <TextInput
        label='Owner'
        data-testid='owner-input'
        value={owner}
        onChange={v => setOwner(v)}
        isDisabled
        disabledMessage='You need the Editor role to change this'
      />
      <TextInput label='Workspace' data-testid='workspace-input' value='acme-prod' onChange={() => {}} isReadOnly />
      <TextInput
        label='Slug'
        data-testid='slug-input'
        value='my slug'
        onChange={() => {}}
        status={{ type: 'error', message: 'Slugs cannot contain spaces' }}
        statusVariant='tooltip'
      />
    </div>
  );
};

export const textInputUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx TextInput',
  ui: <TextInputExample />,
};
