import { IExampleUIUnit } from '@atomic-testing/core';
import { unstable_OneTimePasswordField as OneTimePasswordField } from 'radix-ui';
import React, { JSX } from 'react';

const LENGTH = 6;

/**
 * Radix OneTimePasswordField scene (Wave 4 — no Astryx/MUI precedent; DOM shape
 * verified directly against `@radix-ui/react-one-time-password-field`'s source
 * and rendered output, not assumed).
 *
 * Unlike PasswordToggleField, `OneTimePasswordField.Root` renders a real
 * `<div role="group">`, so the scene anchors on the forwarded `data-testid`
 * directly — no wrapping element needed.
 */
export const OneTimePasswordFieldExample = () => (
  <>
    <OneTimePasswordField.Root data-testid='otp' validationType='numeric'>
      {Array.from({ length: LENGTH }, (_, index) => (
        <OneTimePasswordField.Input key={index} />
      ))}
    </OneTimePasswordField.Root>
    <OneTimePasswordField.Root data-testid='otp-disabled' validationType='numeric' disabled>
      {Array.from({ length: LENGTH }, (_, index) => (
        <OneTimePasswordField.Input key={index} />
      ))}
    </OneTimePasswordField.Root>
  </>
);

export const oneTimePasswordFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix OneTimePasswordField',
  ui: <OneTimePasswordFieldExample />,
};
