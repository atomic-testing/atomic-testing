import { byCssSelector, PartLocator } from '@atomic-testing/core';

/**
 * Anchors for the CDK overlay DOM that Material's overlay components (dialog,
 * menu, snackbar — and, on Material 20, the select panel) render into. The
 * overlay lives under a `.cdk-overlay-container` div appended to
 * `document.body`, outside both the component's own subtree and the test
 * engine's root, so overlay drivers re-root there via
 * `overriddenParentLocator()` — the same portal technique as the mui-v7
 * Dialog/Menu drivers, which anchor on MUI's `role="presentation"` portal
 * root. The two `.cdk-*` classes below are the CDK's own containment contract
 * and the one sanctioned exception to the no-library-classes locator rule;
 * everything inside the overlay is still located by ARIA role/attribute.
 */

/**
 * The overlay container `document.body` child (`.cdk-overlay-container`) that
 * hosts every overlay pane. `Root`-relative: it replaces the engine-root
 * scope when a driver re-roots to it.
 */
export const overlayContainerLocator: PartLocator = byCssSelector('.cdk-overlay-container', 'Root');

/**
 * The click-blocking backdrop CDK renders behind a modal overlay. On v20 it
 * is a sibling of the overlay pane's wrapper; on v21/v22 (native-popover
 * overlays) it renders inside the popover host — in both layouts it stays a
 * descendant of the overlay container, which is what this locator relies on.
 */
export const overlayBackdropLocator: PartLocator = byCssSelector(
  '.cdk-overlay-container .cdk-overlay-backdrop',
  'Root'
);
