import { HTMLElementDriver } from '@atomic-testing/component-driver-html';
import {
  byAttribute,
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  type LocatorRelativePosition,
  Optional,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

export const teachingPopoverParts = {
  header: {
    locator: byCssClass('fui-TeachingPopoverHeader'),
    driver: HTMLElementDriver,
  },
  title: {
    locator: byCssClass('fui-TeachingPopoverTitle'),
    driver: HTMLElementDriver,
  },
  body: {
    locator: byCssClass('fui-TeachingPopoverBody'),
    driver: HTMLElementDriver,
  },
  footer: {
    locator: byCssClass('fui-TeachingPopoverFooter'),
    driver: HTMLElementDriver,
  },
  dismissButton: {
    locator: byAttribute('aria-label', 'dismiss'),
    driver: HTMLElementDriver,
  },
} satisfies ScenePart;

const teachingPopoverSurfaceRootLocator: PartLocator = byCssClass('fui-TeachingPopoverSurface', 'Root');
const defaultTransitionDuration = 1000;

/**
 * Driver for the Fluent v9 `TeachingPopover` (`TeachingPopoverTrigger` +
 * `TeachingPopoverSurface`/`Header`/`Title`/`Body`/`Footer`).
 *
 * **Portal re-root**: `TeachingPopoverSurface` reuses `PopoverSurface`
 * internally (DOM audit, `@fluentui/react-components@9.74.3`: it renders
 * `class="fui-PopoverSurface fui-TeachingPopoverSurface"`, `role="dialog"
 * aria-modal="true"` — stricter than a plain `Popover`, which renders
 * `role="group"`). Since it carries its OWN specific `fui-TeachingPopoverSurface`
 * class (unlike plain `Popover`, whose `fui-PopoverSurface` class it shares),
 * this driver re-roots on that more specific class rather than
 * `PopoverDriver`'s shared one — no ambiguity with a plain open `Popover`.
 *
 * **Built-in dismiss button**: `TeachingPopoverHeader` always renders a
 * dismiss `<button aria-label="dismiss">`, unlike plain `Dialog`/`Popover`
 * (which leave dismissal entirely to consumer-supplied actions or Escape).
 */
export class TeachingPopoverDriver<ContentT extends ScenePart = {}> extends ContainerDriver<
  ContentT,
  typeof teachingPopoverParts
> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption>) {
    super(locator, interactor, {
      ...option,
      parts: teachingPopoverParts,
      content: (option?.content ?? {}) as ContentT,
    });
  }

  static override overriddenParentLocator(): Optional<PartLocator> {
    return teachingPopoverSurfaceRootLocator;
  }

  static override overrideLocatorRelativePosition(): Optional<LocatorRelativePosition> {
    return 'Same';
  }

  /** The header's text (icon excluded — it renders no text node), or `null` when `TeachingPopoverHeader` is absent. */
  async getHeaderText(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.header.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.header.getText()) ?? null;
  }

  /** The popover's title text, or `null` when `TeachingPopoverTitle` is absent. */
  async getTitle(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.title.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.title.getText()) ?? null;
  }

  /** The popover's body text, or `null` when `TeachingPopoverBody` is absent. */
  async getBodyText(): Promise<string | null> {
    const exists = await this.interactor.exists(this.parts.body.locator);
    if (!exists) {
      return null;
    }
    return (await this.parts.body.getText()) ?? null;
  }

  /** Whether the popover's surface is mounted. */
  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  /** Wait for the popover to open (its surface to mount). */
  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  /** Wait for the popover to close (its surface to unmount). */
  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  /** Dismiss by clicking the built-in dismiss button, then wait for the close transition. */
  async dismiss(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    await this.enforcePartExistence('dismissButton');
    await this.parts.dismissButton.click();
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'FluentV9TeachingPopoverDriver';
  }
}
