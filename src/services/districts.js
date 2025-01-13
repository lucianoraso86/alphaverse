import { gql } from "@apollo/client";

const GET_DISTRICTS = gql`
  query GetDistricts($district_type: String) {
    districts(district_type: $district_type) {
      name
      code
      logo
      sections {
        code
        name
        image
        areas {
          section_code
          name
          code
          open
          color
          type
          thumbnail
          order
          purchased_nfts
          nfts
          sectors {
            name
            code
            open
            area_code
            district_code
            nfts
            purchased_nfts
          }
        }
      }
    }
  }
`;

const GET_DISTRICT = gql`
  query distric_by_country_code_and_district_code($countryCode: String!, $districtCode: String!) {
    distric_by_country_code_and_district_code(country_code: $countryCode, district_code: $districtCode) {
      id
      name
      code
      map
      miniMap
      sold
      open
      rotation
      flipV
      flipH
      neighborhoods {
        id
        name
        color
        plots {
          key
          sold
          open
        }
      }
    }
  }
`;

const POST_DISTRICT = gql`
  mutation UpdateDistric($input: updateDistrict) {
    updateDistrict(input: $input) {
      id
      name
      code
    }
  }
`;

export { GET_DISTRICTS, GET_DISTRICT, POST_DISTRICT };
