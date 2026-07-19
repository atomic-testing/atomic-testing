import { NavDriverBase } from './NavDriverBase';

/**
 * Driver for the Fluent v9 `Nav` — the un-chromed nav list (see
 * {@link NavDrawerDriver} for the portal-backed drawer-chromed sibling, and
 * {@link NavDriverBase} for the item-walk both share).
 *
 * DOM audit (@fluentui/react-components@9.4.2): `Nav`'s root is a plain
 * `<div class="fui-Nav">` with no ARIA role of its own — never portalled, so
 * the scene's own locator resolves it directly, no re-root needed.
 *
 * Per the Fluent package's own `README`, `@fluentui/react-nav`'s components
 * are explicitly pre-release ("not production-ready... APIs might change
 * before final release") — this driver targets the current shipped shape
 * and will need to track any breaking API change on a future Fluent bump.
 */
export class NavDriver extends NavDriverBase {
  get driverName(): string {
    return 'FluentV9NavDriver';
  }
}
