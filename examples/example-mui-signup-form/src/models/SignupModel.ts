import { DeepPartial } from 'react-hook-form';
import { AddressModel } from './Address';

export interface CredentialModel {
  email: string;
  password: string;
  birthday: string;
}

export interface ShippingModel {
  lastName: string;
  firstName: string;
  address: AddressModel;
}

export interface BillingModel {
  sameAsShipping: boolean;
  address: AddressModel;
}

export interface InterestModel {
  interestIds: string[];
}

export interface SignupModel {
  credential: CredentialModel;
  shipping: ShippingModel;
  billing: BillingModel;
  interest: InterestModel;
}

export const emptySignupModel: Readonly<DeepPartial<SignupModel>> = {} as const;
