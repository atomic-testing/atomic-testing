export interface IInputDriver<T> {
  getValue(): Promise<T>;
  setValue(value: T): Promise<boolean>;
}
