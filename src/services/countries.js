import { gql } from "@apollo/client";

const GET_COUNTRIES = gql`
  query Countries {
    countries {
      name
      enable
      code
    }
  }
`;

const GET_COUNTRY = gql`
  query Country($countryCode: String!) {
    country(country_code: $countryCode) {
      id
      code
      name
      map
      miniMap
      districts {
        id
        name
        code
        neighborhoodAvailability
        neighborhoodSize
        sold
        open
      }
    }
  }
`;

export { GET_COUNTRIES, GET_COUNTRY };
