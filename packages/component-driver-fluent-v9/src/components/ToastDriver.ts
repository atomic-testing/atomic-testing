import {
  byCssClass,
  ContainerDriver,
  IContainerDriverOption,
  Interactor,
  PartLocator,
  ScenePart,
} from '@atomic-testing/core';

import { readOptionalDescendantText } from '../internal/optionalText';

const titleLocator = byCssClass('fui-ToastTitle');
const bodyLocator = byCssClass('fui-ToastBody');

/**
 * Driver for a single Fluent v9 `Toast` (`Toast`/`ToastTitle`/`ToastBody`),
 * anchored at the `fui-Toast` content element itself.
 *
 * DOM audit (@fluentui/react-components@9.74.3): `Toaster` wraps every
 * dispatched `Toast` in a `role="listitem"` `fui-ToastContainer` (a
 * Fluent-internal wrapper the `dispatchToast(<Toast>...</Toast>)` caller never
 * touches directly), one level above the `fui-Toast` the caller's JSX actually
 * renders. This driver's own locator resolves to that inner `fui-Toast`
 * element — where a consumer-forwarded `data-testid` on `<Toast>` lands —
 * whether reached directly (a scene part pointed at that test id) or via
 * `ToasterDriver`'s iteration (which descends through the `listitem` wrapper
 * for you). There is no built-in dismiss/action button by default (Fluent
 * leaves that to consumer-supplied content, e.g. a `ToastFooter`), so — like
 * `component-driver-mui-v9`'s `SnackbarDriver` — arbitrary action content is
 * reached through the declared `content` scene rather than a hardcoded part.
 *
 * **No `ScenePart` `parts` of its own** (title/body are read via direct
 * locator composition instead, the same technique `FieldDriver` uses) —
 * deliberately, so this driver's own base stays plain `ComponentDriver<{}>`
 * and remains usable as a `childListHelper` item from `ToasterDriver`. A
 * driver with non-empty own `parts` fails `childListHelper`'s `ItemT extends
 * ComponentDriver` structural constraint (`getMissingPartNames`'s return type
 * no longer matches the bare-`{}` shape) — the same "intentional variance" gap
 * CLAUDE.md documents, hit here by the item itself rather than the host.
 */
export class ToastDriver<ContentT extends ScenePart = {}> extends ContainerDriver<ContentT, {}> {
  constructor(locator: PartLocator, interactor: Interactor, option?: Partial<IContainerDriverOption<ContentT, {}>>) {
    super(locator, interactor, {
      ...option,
      parts: {},
      content: (option?.content ?? {}) as ContentT,
    });
  }

  /** The toast's title text, or `null` when `ToastTitle` is absent. */
  async getTitle(): Promise<string | null> {
    return (await readOptionalDescendantText(this.interactor, this.locator, titleLocator)) ?? null;
  }

  /** The toast's body text, or `null` when `ToastBody` is absent. */
  async getBodyText(): Promise<string | null> {
    return (await readOptionalDescendantText(this.interactor, this.locator, bodyLocator)) ?? null;
  }

  get driverName(): string {
    return 'FluentV9ToastDriver';
  }
}
