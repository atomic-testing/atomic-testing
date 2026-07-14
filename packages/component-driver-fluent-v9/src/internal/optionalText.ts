import { Interactor, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

/**
 * Resolve the text of an optional descendant part, or `undefined` when the
 * part isn't rendered. `Interactor.getText` already resolves to `undefined`
 * for a locator that matches nothing (every interactor implements this), so
 * this is a plain descendant read — no separate existence probe needed.
 */
export function readOptionalDescendantText(
  interactor: Interactor,
  rootLocator: PartLocator,
  partLocator: PartLocator
): Promise<Optional<string>> {
  return interactor.getText(locatorUtil.append(rootLocator, partLocator));
}
