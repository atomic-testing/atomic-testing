import { ComponentDriver, ItemNotFoundError } from '@atomic-testing/core';

export const TagPickerOptionNotFoundErrorId = 'TagPickerOptionNotFoundError';

/**
 * Thrown by {@link TagPickerDriver.selectByLabel} when no open-list option
 * matches the given label, and by {@link TagPickerDriver.removeSelected} when
 * no currently-selected tag matches it — the same "no matching item" shape
 * reused across a composite driver's several lookups, mirroring
 * `MenuItemNotFoundError`'s reuse across `Menu`'s plain/checkbox/radio items.
 */
export class TagPickerOptionNotFoundError extends ItemNotFoundError {
  constructor(
    public readonly label: string,
    driver: ComponentDriver<any>
  ) {
    super(label, driver, `Cannot find tag picker option/selected tag with label: ${label}`);
    this.name = TagPickerOptionNotFoundErrorId;
  }
}
