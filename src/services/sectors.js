import { gql } from "@apollo/client";

const GET_SECTORS = gql`
  query GetSectors($district_code: String) {
    sectors(district_code: $district_code) {
      code
      category {
        code
        color
      }
      links {
        name
        url
      }
      cells {
        key
        x
        y
        level
      }
      open
      sold
      tokens {
        token_id
        contract_address
      }
    }
  }
`;

const POST_SECTOR = gql`
  mutation UpsertSector($input: SectorInput) {
    upsertSector(input: $input) {
      code
      category {
        code
        color
      }
      links {
        name
        url
      }
      cells {
        key
        x
        y
        level
      }
      open
      sold
      tokens {
        token_id
        contract_address
      }
    }
  }
`;

const DELETE_SECTOR = gql`
  mutation UpsertSector($input: genericDeleteInput) {
    deleteSector(input: $input) {
      deleted
    }
  }
`;

export { GET_SECTORS, POST_SECTOR, DELETE_SECTOR };
