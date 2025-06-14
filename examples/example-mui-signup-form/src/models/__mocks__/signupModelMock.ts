import { CredentialFormValue } from '../../components/credentialForm/CredentialFormDriver';
import { userInterests } from '../../data/userInterests';
import { BillingModel, InterestModel, ShippingModel } from '../SignupModel';
import { getGoodAddressMock, getGoodAlternateAddressMock } from './addressMock';

export function getGoodCredentialMock(): CredentialFormValue {
  return {
    email: 'someone@somesite.com',
    password: 'H0wdy123!',
    confirmPassword: 'H0wdy123!',
    birthday: '2002-02-02'
  };
}

export function getGoodShippingMock(): ShippingModel {
  return {
    firstName: 'Jack',
    lastName: 'Simon',
    address: getGoodAddressMock()
  };
}

export function getGoodBillingMock(): BillingModel {
  return {
    sameAsShipping: false,
    address: getGoodAlternateAddressMock()
  };
}

export function getGoodInterestMock(): InterestModel {
  return {
    interestIds: [userInterests[0].id, userInterests[2].id]
  };
}
