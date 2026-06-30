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

// MUI encodes the anchor as a class on the paper element.
const anchorClassByAnchor: Record<DrawerAnchor, string> = {
  left: 'MuiDrawer-paperAnchorLeft',
  right: 'MuiDrawer-paperAnchorRight',
  top: 'MuiDrawer-paperAnchorTop',
  bottom: 'MuiDrawer-paperAnchorBottom',
};

// A temporary Drawer is a Modal rendered into a portal whose root carries
// role="presentation"; re-root to it like DialogDriver does.
const drawerRootLocator: PartLocator = byRole('presentation', 'Root');

/**
 * Driver for the Material UI v7 Drawer (and SwipeableDrawer) component.
 *
 * A temporary Drawer is a portal-rendered Modal: its root `role="presentation"`
 * holds a `.MuiBackdrop-root` and a `.MuiDrawer-paper` panel whose class encodes
 * the anchor. Open/close/backdrop behavior is inherited from {@link OverlayDriver};
 * this driver adds the anchor read and the portal re-rooting.
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

  static override overriddenParentLocator(): Optional<PartLocator> {
    return drawerRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  protected getSurfaceLocator(): PartLocator {
    return this.parts.paper.locator;
  }

  /**
   * The side the drawer is anchored to, read from the paper's anchor class, or
   * `undefined` when the drawer is closed/unmounted.
   */
  async getAnchor(): Promise<Optional<DrawerAnchor>> {
    const paper = this.parts.paper.locator;
    if (!(await this.interactor.exists(paper))) {
      return undefined;
    }
    for (const anchor of Object.keys(anchorClassByAnchor) as DrawerAnchor[]) {
      if (await this.interactor.hasCssClass(paper, anchorClassByAnchor[anchor])) {
        return anchor;
      }
    }
    return undefined;
  }

  get driverName(): string {
    return 'MuiV5DrawerDriver';
  }
}
