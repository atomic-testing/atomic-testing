import { Button } from '@astryxdesign/core/Button';
import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import React, { JSX, useState } from 'react';

/**
 * Astryx Button scene.
 *
 * Astryx renders `<Button>` as a native `<button>` and forwards unknown props
 * (`data-testid`, `role`, `aria-label`) onto it, so:
 * - the plain buttons are anchored by `data-testid` (the stable, idiomatic
 *   handle — never the StyleX-hashed class);
 * - the `Open`/`Close` pair carries explicit `role="button"` + `aria-label` so
 *   `byRole` composed with `byAriaLabel` (verbatim) can disambiguate two
 *   same-role siblings (mirrors the html-test ByRole example; computed/text-name
 *   resolution is the deferred `findByRole`, see #923).
 *
 * No `<Theme>` wrapper here on purpose — the example renders identically in
 * jsdom and the browser; theming is applied at the browser app shell.
 */
export const ButtonExample = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <div>
      <Button label='Save' data-testid='save-button' onClick={() => setClicks(c => c + 1)} />
      {/* Records that the driver's click reached the Astryx onClick handler. */}
      <span data-testid='click-count'>{clicks}</span>

      <Button label='Disabled' data-testid='disabled-button' isDisabled />

      {/* Two same-role buttons told apart purely by verbatim aria-label. The
          explicit role='button' on a native <button> is deliberately redundant:
          byRole resolves to the CSS `[role="button"]`, which cannot match an
          implicit ARIA role — only the literal attribute. Do not let an ARIA
          linter "fix" it away. */}
      <Button label='Open' role='button' aria-label='Open' data-testid='open-button' />
      <Button label='Close' role='button' aria-label='Close' data-testid='close-button' />
    </div>
  );
};

export const buttonUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Astryx Button',
  ui: <ButtonExample />,
};
