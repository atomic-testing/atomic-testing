import { IExampleUIUnit } from '@atomic-testing/core';
import React, { JSX, useCallback, useState } from 'react';

/**
 * Components whose accessible name is COMPUTED — not a literal `aria-label`
 * attribute — the case `findByRole` exists for (#923):
 *
 * - `Save`: name from plain visible TEXT CONTENT, the common case for a design
 *   system that labels controls with text rather than `aria-label`. No
 *   `aria-label` attribute exists on it at all, so a CSS `byAriaLabel` locator
 *   cannot find it — proving the two locators are NOT interchangeable.
 * - The icon-only `✕` button: name from `aria-labelledby`, pointing at a
 *   separate `<span>` ("Cancel") that is not itself inside the button.
 * - The email field: name from an associated `<label>` (`htmlFor`/`id`).
 * - Two same-named "Confirm" buttons in DIFFERENT containers: same-name
 *   siblings are disambiguated by SCOPING `findByRole` under each container's
 *   locator (`locatorUtil.append(containerLocator, findByRole(...))`), not by
 *   the name itself — proves the scope-splitting resolution, not just a bare
 *   top-level accname search.
 */
export const FindByRoleExample = () => {
  const [saveClicks, setSaveClicks] = useState(0);
  const [cancelClicks, setCancelClicks] = useState(0);
  const [outerConfirmClicks, setOuterConfirmClicks] = useState(0);
  const [innerConfirmClicks, setInnerConfirmClicks] = useState(0);

  const onSave = useCallback(() => setSaveClicks(count => count + 1), []);
  const onCancel = useCallback(() => setCancelClicks(count => count + 1), []);
  const onOuterConfirm = useCallback(() => setOuterConfirmClicks(count => count + 1), []);
  const onInnerConfirm = useCallback(() => setInnerConfirmClicks(count => count + 1), []);

  return (
    <React.Fragment>
      {/* Name computed from visible text content — no aria-label attribute. */}
      <button type='button' onClick={onSave}>
        Save
      </button>
      <div data-testid='save-click-count'>{String(saveClicks)}</div>

      {/* Name computed from aria-labelledby, pointing at a sibling span — the
          button's own text content ('✕') is NOT its accessible name. */}
      <span id='cancel-label'>Cancel</span>
      <button type='button' aria-labelledby='cancel-label' onClick={onCancel}>
        ✕
      </button>
      <div data-testid='cancel-click-count'>{String(cancelClicks)}</div>

      {/* Name computed from an associated <label>. */}
      <label htmlFor='email-field'>Email</label>
      <input id='email-field' type='text' data-testid='email-input' />

      {/* Two "Confirm" buttons, same computed name, different containers —
          only reachable unambiguously by scoping findByRole under each
          container's own locator. */}
      <div data-testid='outer-panel'>
        <button type='button' onClick={onOuterConfirm}>
          Confirm
        </button>
      </div>
      <div data-testid='outer-confirm-click-count'>{String(outerConfirmClicks)}</div>

      <div data-testid='inner-panel'>
        <button type='button' onClick={onInnerConfirm}>
          Confirm
        </button>
      </div>
      <div data-testid='inner-confirm-click-count'>{String(innerConfirmClicks)}</div>
    </React.Fragment>
  );
};

export const findByRoleUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'findByRole (computed accessible name)',
  ui: <FindByRoleExample />,
};
