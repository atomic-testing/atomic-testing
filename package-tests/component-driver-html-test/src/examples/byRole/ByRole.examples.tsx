import { IExampleUIUnit } from '@atomic-testing/core';
import { JSX } from 'react';

export const ByRoleExample = () => {
  return (
    // The outer element carries role="group" so a `byRole('group', 'Root')`
    // locator can anchor to the root and prove the legacy positional `relative`
    // form still resolves after the overload change.
    <div role='group' aria-label='actions'>
      {/* Two same-role buttons distinguished ONLY by their verbatim aria-label.
          This is the disambiguation case: byRole('button', { name: 'Open' })
          and byRole('button', { name: 'Close' }) must each resolve to their own
          element via the [role][aria-label] selector. */}
      <button type='button' role='button' aria-label='Open'>
        first
      </button>
      <button type='button' role='button' aria-label='Close'>
        second
      </button>
      {/* A multi-word aria-label. Real Astryx labels are routinely multi-word
          ("Close dialog", "Next page"), and the [aria-label="..."] value is
          escaped (spaces → `\ `). This proves multi-word names resolve AND that
          the selector matches the EXACT full label — `Close dialog` must not be
          reached by the `Close` locator, nor vice versa. */}
      <button type='button' role='button' aria-label='Close dialog'>
        third
      </button>
    </div>
  );
};

export const byRoleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'byRole name',
  ui: <ByRoleExample />,
};
