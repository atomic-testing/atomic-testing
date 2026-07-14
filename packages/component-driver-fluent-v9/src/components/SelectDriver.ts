import { HTMLSelectDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `Select` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): renders a real native
 * `<select class="fui-Select__select">` as the component root (wrapped by a
 * `<span class="fui-Select">` styling shell that also hosts the decorative
 * chevron icon), with `disabled`/`required` as native attributes on the
 * `<select>` itself. Full `HTMLSelectDriver` surface applies unchanged.
 */
export class SelectDriver extends HTMLSelectDriver {
  override get driverName(): string {
    return 'FluentV9SelectDriver';
  }
}
