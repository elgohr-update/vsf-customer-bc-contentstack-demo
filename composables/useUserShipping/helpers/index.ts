import type {
  UserShippingAddress as Address,
  UserShippingAddressSearchCriteria
} from '@vsf-enterprise/bigcommerce-api';

export const getAddresses = (
  addresses: Address,
  criteria?: UserShippingAddressSearchCriteria
): Address => {
  if (!criteria || !Object.keys(criteria).length) {
    return addresses;
  }

  const searchCriteriaEntries = Object.entries(criteria);

  return addresses.filter((address) =>
    searchCriteriaEntries.every(
      ([criteriaKey, criteria]) => address[criteriaKey] === criteria
    )
  );
};
