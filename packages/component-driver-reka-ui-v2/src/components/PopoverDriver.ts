import {
  byLinkedElement,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

const defaultTransitionDuration = 250;

/**
 * Driver for a Reka UI `Popover` (`PopoverRoot`/`PopoverContent` from `reka-ui`),
 * anchored at the TRIGGER, like `component-driver-radix-v1`'s `PopoverDriver` —
 * not at the portalled content via static re-root hooks.
 *
 * **Why NOT the static `overriddenParentLocator` portal re-root** `DialogDriver`
 * uses: verified live (see DOM audit below) that `PopoverContent` renders
 * `role="dialog"` — the IDENTICAL role `DialogDriver`'s `DialogContent` uses.
 * The static hooks carry no per-instance data, so a generic `byRole('dialog',
 * 'Root')` re-root cannot tell "the popover" apart from "a simultaneously-open
 * modal dialog" — same collision `component-driver-radix-v1`'s driver documents,
 * confirmed unchanged in Reka. Reka already solves this instance-scoping problem
 * itself: `PopoverTrigger` carries `aria-controls` pointing at `PopoverContent`'s
 * id. So this driver is constructed from the SCENE-supplied TRIGGER locator (an
 * ordinary in-tree element, not portalled) and derives the portalled content
 * locator by following that link with `byLinkedElement`, re-resolved fresh on
 * every interaction.
 *
 * DOM audit (reka-ui@2.10.1, SSR-rendered, verified live via `createTestEngine`
 * with two independent `PopoverRoot`/`PopoverTrigger`/`PopoverPortal`/
 * `PopoverContent` instances): `PopoverContent` renders a single `<div
 * role="dialog" data-state="open"/"closed" aria-labelledby>` as a direct child
 * of `document.body` while open, and unmounts entirely (no DOM output at all,
 * confirmed via `Presence`'s `present.value ? ... : null` render) while closed —
 * matching `component-driver-radix-v1`'s documented contract for `isOpen()`
 * (simple existence is the open signal).
 *
 * **One confirmed, non-cosmetic delta from radix-v1**: Radix's driver documents
 * `aria-controls` as ABSENT on the trigger while closed (so `byLinkedElement`
 * throws, which is why `exists()` below is overridden). Reka's compiled
 * `PopoverTrigger` binds `"aria-controls": rootContext.contentId` unconditionally
 * from its very first render — verified live: immediately after mount, BEFORE
 * ever opening, the trigger already carries `aria-controls=""` (an empty string,
 * not an absent attribute — `rootContext.contentId` starts as `""` and is a
 * plain, non-reactive object property, so the trigger's first render captures it
 * before `PopoverContent`'s own `setup()` — which runs after the trigger's,
 * Vue's mount order being depth-first in author order — assigns the real id).
 * After the FIRST open, `aria-controls` permanently holds `PopoverContent`'s real
 * `id` (Reka never clears it back to `""` on close) — but since the id'd element
 * itself unmounts on close (per `Presence` above), `byLinkedElement`'s derived
 * `[id="<value>"]` selector matches zero elements either way, so
 * `interactor.exists()` naturally resolves `false` without ever throwing for
 * THIS specific "closed" case. The only path that still legitimately throws is
 * the one radix-v1's `exists()` override was written to catch in general: an
 * unresolvable match target (e.g. `aria-controls` never rendered at all because
 * the driver's own trigger locator doesn't resolve). The override is kept as-is
 * for that defensive parity, not because Reka reproduces Radix's absent-attribute
 * mechanism.
 *
 * Escape is handled globally: Reka's `DismissableLayer` attaches its handler to
 * `window` (confirmed live — dispatching `Escape` either on the trigger or
 * directly on the content element closes the popover), the same "handled
 * globally" behavior `component-driver-radix-v1`'s driver relies on.
 */
export class PopoverDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  protected readonly triggerLocator: PartLocator;

  constructor(
    triggerLocator: PartLocator,
    interactor: Interactor,
    option?: Partial<IContainerDriverOption<ContentT, {}>>
  ) {
    const contentLocator: PartLocator = byLinkedElement('Root')
      .onLinkedElement(triggerLocator)
      .extractAttribute('aria-controls')
      .toMatchMyAttribute('id');
    super(contentLocator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
    this.triggerLocator = triggerLocator;
  }

  override async exists(): Promise<boolean> {
    try {
      return await super.exists();
    } catch {
      return false;
    }
  }

  async isOpen(): Promise<boolean> {
    return this.exists();
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.interactor.click(this.triggerLocator);
    }
  }

  async waitForOpen(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: true,
      timeoutMs,
    });
    return isOpened === true;
  }

  async waitForClose(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    const isOpened = await this.interactor.waitUntil({
      probeFn: () => this.isOpen(),
      terminateCondition: false,
      timeoutMs,
    });
    return isOpened === false;
  }

  async closeByEscape(timeoutMs: number = defaultTransitionDuration): Promise<boolean> {
    if (await this.isOpen()) {
      await this.interactor.pressKey(this.locator, 'Escape');
    }
    return this.waitForClose(timeoutMs);
  }

  get driverName(): string {
    return 'RekaUiV2PopoverDriver';
  }
}
