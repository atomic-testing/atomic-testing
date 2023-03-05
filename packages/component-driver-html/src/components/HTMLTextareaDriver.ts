import { HTMLTextInputDriver } from './HTMLTextInputDriver';

export class HTMLTextAreaDriver extends HTMLTextInputDriver {
  override get driverName(): string {
    return 'HTMLTextArea';
  }
}
