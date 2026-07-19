import {
  byCssClass,
  childListHelper,
  ComponentDriver,
  IComponentDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
} from '@atomic-testing/core';

import { ToastDriver } from './ToastDriver';

const toasterRootLocator: PartLocator = byCssClass('fui-Toaster', 'Root');
const toastContentSelector = '.fui-Toast';
const toastListItemSelector = '[role="listitem"]';

/**
 * Driver for the Fluent v9 `Toaster` — a queue of dispatched `Toast`s, not a
 * clickable trigger.
 *
 * **Portal re-root**: `Toaster` mounts into the same cloned
 * `FluentProvider`-on-`document.body` every Fluent overlay uses (DOM audit,
 * `@fluentui/react-components@9.74.3`), rendering `role="list"` with class
 * `fui-Toaster` — an exact structural analog of `DialogDriver`'s re-root, so
 * this driver re-roots the same way. Most apps mount a single global
 * `<Toaster toasterId={...}>`, so instance disambiguation matters less here
 * than for Dialog/Menu, but the same `data-testid`-compounding recipe applies
 * when a consumer does mount more than one.
 *
 * **Not a `ContainerDriver`**: toasts arrive dynamically via
 * `useToastController(toasterId).dispatchToast(...)`, not as a fixed scene the
 * caller declares up front, so items are read positionally/by-title through
 * `childListHelper` (each direct child is a `role="listitem"` wrapper Fluent
 * adds around the caller's `Toast`; `.fui-Toast` sits one level inside it —
 * the `groupSelector` recursion existing exactly for this "wrapped items"
 * shape) rather than a declared `content` part.
 */
export class ToasterDriver extends ComponentDriver<{}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IComponentDriverOption<{}>>) {
    super(locator, interactor, { ...option, parts: {} });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return toasterRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** The number of toasts currently queued in this toaster. */
  async getToastCount(): Promise<number> {
    return childListHelper.countMatchingChildren(
      this.interactor,
      this.locator,
      toastContentSelector,
      toastListItemSelector
    );
  }

  /** The toast at the given zero-based index (in display order), or `null` if out of range. */
  async getToastByIndex(index: number): Promise<ToastDriver | null> {
    let position = 0;
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      toastContentSelector,
      ToastDriver,
      toastListItemSelector
    )) {
      if (position === index) {
        return item;
      }
      position++;
    }
    return null;
  }

  /** The first toast whose title matches `title`, or `null` when absent. */
  async getToastByTitle(title: string): Promise<ToastDriver | null> {
    for await (const item of childListHelper.iterateMatchingChildren(
      this,
      this.locator,
      toastContentSelector,
      ToastDriver,
      toastListItemSelector
    )) {
      if ((await item.getTitle()) === title) {
        return item;
      }
    }
    return null;
  }

  get driverName(): string {
    return 'FluentV9ToasterDriver';
  }
}
