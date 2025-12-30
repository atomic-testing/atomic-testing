import { ComponentDriver } from '../drivers';

export class ErrorBase extends Error {
  constructor(
    message: string,
    public readonly driver: ComponentDriver<any>
  ) {
    super(message);
  }
}
