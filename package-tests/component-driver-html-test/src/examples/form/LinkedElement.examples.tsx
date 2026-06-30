import { IExampleUIUnit } from '@atomic-testing/internal-test-runner';
import { JSX } from 'react';

export const LinkedElementExample = () => {
  return (
    <form>
      <label htmlFor='value-input' data-testid='input-label'>
        Input
      </label>
      <input type='text' defaultValue='Something' id='value-input' />
    </form>
  );
};

export const linkedElementUIExample: IExampleUIUnit<JSX.Element> = {
  title: 'Linked Element',
  ui: <LinkedElementExample />,
};
