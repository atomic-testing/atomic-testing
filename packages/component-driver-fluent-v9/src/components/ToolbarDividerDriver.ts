import { DividerDriver } from './DividerDriver';

/**
 * Driver for the Fluent v9 `ToolbarDivider` component.
 *
 * DOM audit (@fluentui/react-components@9.8.3): `ToolbarDivider` delegates
 * entirely to `@fluentui/react-divider`'s divider primitive — identical DOM
 * to a plain `Divider` (`role="separator"`, class `fui-Divider`; no separate
 * `fui-ToolbarDivider` class is exported), so this driver extends
 * {@link DividerDriver} wholesale rather than reimplementing it.
 *
 * **Orientation is INVERTED relative to the toolbar**: verified against
 * source (`useToolbarDivider` sets `vertical: !toolbarContext.vertical`) — in
 * a horizontal toolbar (the default) the divider itself renders
 * `aria-orientation="vertical"` (a vertical bar), and vice versa in a
 * vertical toolbar. {@link getOrientation} (inherited) reports the
 * DIVIDER's own axis, not the toolbar's.
 */
export class ToolbarDividerDriver extends DividerDriver {
  override get driverName(): string {
    return 'FluentV9ToolbarDividerDriver';
  }
}
