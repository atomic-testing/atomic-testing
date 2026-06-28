import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byCssClass,
  byRole,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { OverlayDriver } from './OverlayDriver';

export const drawerParts = {
  paper: {
    locator: byCssClass('MuiDrawer-paper'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

// In Material UI v9 the anchor class lives on the drawer root (`.MuiDrawer-root`,
// the role="presentation" element), not on the paper as in v7.
const anchorClassByAnchor: Record<DrawerAnchor, string> = {
  left: 'MuiDrawer-anchorLeft',
  right: 'MuiDrawer-anchorRight',
  top: 'MuiDrawer-anchorTop',
  bottom: 'MuiDrawer-anchorBottom',
};

// A temporary Drawer is a Modal rendered into a portal whose root carries
// role="presentation"; re-root to it like DialogDriver does.
const drawerRootLocator: PartLocator = byRole('presentation', 'Root');

/**
 * Driver for the Material UI v9 Drawer (and SwipeableDrawer) component.
 *
 * A temporary Drawer is a portal-rendered Modal: its root `role="presentation"`
 * (`.MuiDrawer-root`) carries the anchor class and holds a `.MuiBackdrop-root` plus
 * the `.MuiDrawer-paper` panel. Open/close/backdrop behavior is inherited from
 * {@link OverlayDriver}; this driver adds the anchor read and the portal re-rooting.
 * @see https://mui.com/material-ui/react-drawer/
 */
export class DrawerDriver<ContentT extends ScenePart> extends OverlayDriver<ContentT, typeof drawerParts> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: drawerParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  override overriddenParentLocator(): Optional<PartLocator> {
    return drawerRootLocator;
  }

  override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  protected getSurfaceLocator(): PartLocator {
    return this.parts.paper.locator;
  }

  /**
   * The side the drawer is anchored to, read from the portal root's anchor class, or
   * `undefined` when the drawer is closed/unmounted.
   *
   * The anchor class sits on the `role="presentation"` root itself, so it is read
   * directly off {@link drawerRootLocator} rather than through a part (parts resolve
   * as descendants of that root, but the class is on the root).
   */
  async getAnchor(): Promise<Optional<DrawerAnchor>> {
    if (!(await this.interactor.exists(drawerRootLocator))) {
      return undefined;
    }
    for (const anchor of Object.keys(anchorClassByAnchor) as DrawerAnchor[]) {
      if (await this.interactor.hasCssClass(drawerRootLocator, anchorClassByAnchor[anchor])) {
        return anchor;
      }
    }
    return undefined;
  }

  get driverName(): string {
    return 'MuiV9DrawerDriver';
  }
}
