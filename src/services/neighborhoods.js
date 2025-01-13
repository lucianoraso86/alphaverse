import { gql } from "@apollo/client";

const GET_NEIGHBORHOODS = gql`
  query getNeighborhoods($countryId: String!, $districtId: String!) {
    neighborhoods(country_id: $countryId, district_id: $districtId) {
      color
      id
      name
      plots {
        key
      }
    }
  }
`;

const POST_NEIGHBORHOODS = gql`
  mutation updateNeighborhoodName($input: updateNeighborhoodInput) {
    updateNeighborhoodName(input: $input) {
      id
      name
      color
    }
  }
`;

export { GET_NEIGHBORHOODS, POST_NEIGHBORHOODS };
