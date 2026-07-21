import {
  byCssClass,
  childListHelper,
  ComponentDriver,
  Interactor,
  locatorUtil,
  PartLocator,
} from '@atomic-testing/core';

import { ButtonDriver } from '../components/ButtonDriver';

const actionsLocator: PartLocator = byCssClass('fui-TableCellActions');
const actionButtonSelector = '.fui-Button';
const anyWrapperSelector = '*';

/**
 * Shared by `TableCellDriver`/`DataGridCellDriver` — both are separate
 * classes by design (see `TableCellDriver`'s class doc for why), so this
 * helper avoids duplicating the `TableCellActions` read logic between them.
 *
 * DOM audit (`@fluentui/react-table@9.19.17`): `TableCellActions` renders
 * `<div class="fui-TableCellActions">` as a plain descendant of the cell (the
 * spec's own usage example nests it directly inside `TableCell`/`DataGridCell`
 * content), with NO `role`/`aria-*` marking it as an actions region — so a
 * cell can only be found to have one via this stable structural class.
 */
function actionsLocatorOf(cellLocator: PartLocator): PartLocator {
  return locatorUtil.append(cellLocator, actionsLocator);
}

/**
 * The `Button`s rendered inside a cell's `TableCellActions`, in DOM order —
 * empty when the cell has no `TableCellActions` at all. Fluent's own docs
 * example nests `Button`s as DIRECT children of `TableCellActions`; the `'*'`
 * `groupSelector` additionally tolerates one layer of wrapping (e.g. a
 * `Tooltip` trigger span) without losing buttons nested inside it, mirroring
 * `CarouselDriver.getCarouselButtons`'s same tolerance.
 */
export function collectActionButtons(host: ComponentDriver, cellLocator: PartLocator): Promise<ButtonDriver[]> {
  return childListHelper.getMatchingChildren(
    host,
    actionsLocatorOf(cellLocator),
    actionButtonSelector,
    ButtonDriver,
    anyWrapperSelector
  );
}

/**
 * Whether the cell's `TableCellActions` are currently visible.
 *
 * `TableCellActions` ships NO default hover/focus CSS of its own — DOM/source
 * audit of `useTableCellActionsStyles_unstable` shows visibility is 100%
 * driven by the component's own `visible` boolean PROP (an opacity-0 base
 * class vs. an opacity-1 "visible" variant class, the latter applied only
 * when `visible` is true) with no `:hover`/`:focus-within` selector anywhere
 * in its stylesheet — a consuming app must wire that prop itself from
 * whatever hover/focus state it tracks (row-level `onMouseEnter`/`onFocus`,
 * typically). Delegates to {@link Interactor.isVisible}, the package-wide
 * `opacity`/`display`/`visibility` policy (#1053) shared verbatim by every
 * interactor — the exact portability guarantee this needs, without a
 * Fluent-local reimplementation of it.
 */
export function readActionsVisible(interactor: Interactor, cellLocator: PartLocator): Promise<boolean> {
  return interactor.isVisible(actionsLocatorOf(cellLocator));
}
