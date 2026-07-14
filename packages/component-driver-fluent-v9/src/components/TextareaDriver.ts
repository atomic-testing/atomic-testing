import { HTMLTextAreaDriver } from '@atomic-testing/component-driver-html';

/**
 * Driver for the Fluent v9 `Textarea` component.
 *
 * DOM audit (@fluentui/react-components@9.74.3): the component root IS a real
 * native `<textarea class="fui-Textarea__textarea">`, same shape as
 * {@link InputDriver}'s `<input>` — full `HTMLTextAreaDriver` surface applies
 * unchanged.
 */
export class TextareaDriver extends HTMLTextAreaDriver {
  override get driverName(): string {
    return 'FluentV9TextareaDriver';
  }
}
