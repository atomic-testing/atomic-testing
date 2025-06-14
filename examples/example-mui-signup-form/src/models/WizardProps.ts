import { DeepPartial } from 'react-hook-form';
import { SignupModel } from './SignupModel';
import { HasDataTestId } from './types';

export interface WizardProps<T = DeepPartial<SignupModel>> extends HasDataTestId {
  onPreviousStep?: (data: Readonly<T>) => void;
  onNextStep?: (data: Readonly<T>) => void;
  data: Readonly<T>;
}
