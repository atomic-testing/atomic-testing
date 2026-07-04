import { IExampleUIUnit } from '@atomic-testing/core';
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui';
import React, { JSX } from 'react';

/**
 * Radix PasswordToggleField scene (Wave 4 — no Astryx/MUI precedent; DOM shape
 * verified directly against `@radix-ui/react-password-toggle-field`'s source and
 * rendered output, not assumed).
 *
 * `PasswordToggleField.Root` renders no DOM node of its own (a pure context
 * provider), so each instance's driver root anchors on an explicit wrapping
 * `<div data-testid>` instead — see `PasswordToggleFieldDriver`'s doc comment.
 * The toggle button is left without visible content so Radix's automatic
 * `aria-label` ("Show password" / "Hide password") applies, giving
 * `getToggleLabel` something portable to read.
 */
export const PasswordToggleFieldExample = () => (
  <>
    <div data-testid='password-toggle-field'>
      <PasswordToggleField.Root>
        <PasswordToggleField.Input data-testid='password-toggle-field-input' />
        <PasswordToggleField.Toggle data-testid='password-toggle-field-toggle' />
      </PasswordToggleField.Root>
    </div>
    <div data-testid='password-toggle-field-disabled'>
      <PasswordToggleField.Root>
        <PasswordToggleField.Input data-testid='password-toggle-field-disabled-input' disabled />
        <PasswordToggleField.Toggle data-testid='password-toggle-field-disabled-toggle' />
      </PasswordToggleField.Root>
    </div>
  </>
);

export const passwordToggleFieldUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Radix PasswordToggleField',
  ui: <PasswordToggleFieldExample />,
};
