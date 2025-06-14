import { AddressModel } from '../Address';

export function getGoodAddressMock(): AddressModel {
  return {
    address: '123 Main St.',
    city: 'Springfield',
    state: 'IL',
    zip: '53002'
  };
}

export function getGoodAlternateAddressMock(): AddressModel {
  return {
    address: '456 Elm St.',
    city: 'Springfield',
    state: 'IL',
    zip: '53002'
  };
}
