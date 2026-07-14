import { byCssSelector, Interactor, locatorUtil, Optional, PartLocator } from '@atomic-testing/core';

const requiredMarkerLocator = byCssSelector('.fui-Label__required');

/**
 * Read a Fluent `<label>`'s visible text, stripping the trailing
 * `fui-Label__required` marker span Fluent injects for required controls
 * (`aria-hidden="true"`, typically `*`) — e.g. a required `Checkbox` labeled
 * "Accept terms" renders `<label>Accept terms<span class="fui-Label__required">*</span></label>`,
 * and plain `textContent` cannot exclude a nested element's text from its
 * ancestor's read. Returns `undefined` when the label itself doesn't exist
 * (`getText` already resolves that way for every interactor).
 */
export async function readLabelText(interactor: Interactor, labelLocator: PartLocator): Promise<Optional<string>> {
  const text = await interactor.getText(labelLocator);
  if (!text) {
    return text;
  }
  const markerText = await interactor.getText(locatorUtil.append(labelLocator, requiredMarkerLocator));
  if (markerText && text.endsWith(markerText)) {
    return text.slice(0, text.length - markerText.length).trimEnd() || undefined;
  }
  return text;
}
