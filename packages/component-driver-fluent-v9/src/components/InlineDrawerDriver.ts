import { ScenePart } from '@atomic-testing/core';

import { DrawerDriverBase } from './DrawerDriverBase';

/**
 * Driver for the Fluent v9 `InlineDrawer` — the in-tree `Drawer` variant (see
 * `OverlayDrawerDriver` for the portal-rendered sibling).
 *
 * **No portal, no re-root**: verified against rendered DOM
 * (`@fluentui/react-components@9.74.3`) — `InlineDrawer` renders its
 * `fui-InlineDrawer` root as an ordinary descendant of wherever the consumer
 * places it (it pushes/reflows sibling content instead of overlaying it), so
 * the scene's declared locator resolves the normal descendant way; no static
 * portal hooks are needed here, unlike every other driver in this wave.
 */
export class InlineDrawerDriver<ContentT extends ScenePart> extends DrawerDriverBase<ContentT> {
  get driverName(): string {
    return 'FluentV9InlineDrawerDriver';
  }
}
