import { ComponentDriver } from '../drivers';

export class ErrorBase extends Error {
  constructor(
    message: string,
    public readonly drive: ComponentDriver<any>
  ) {
    super(message);
  }
}
