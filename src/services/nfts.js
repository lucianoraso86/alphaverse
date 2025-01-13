import { gql } from "@apollo/client";

const GET_TOKENS_QUERY = gql`
  query GetTokensQuery($filter: FilterQuery!) {
    tokens(filter: $filter) {
      cursor
      tokens {
        token_id
        display_name
        contract_address
        collection_code
        collection_name
        collection_symbol
        area_code
        purchased
        opensea_link
        image
        animation_url
        rarity
        price
        currency {
          name
          symbol
          image
        }
        available
      }
    }
  }
`;

export default GET_TOKENS_QUERY;