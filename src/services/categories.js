import { gql } from "@apollo/client";

const GET_CATEGORIES = gql`
  query {
    categories {
      code
      name
      description
      color
    }
  }
`;

const POST_CATEGORY = gql`
  mutation UpsertCategory($input: CategoryInput) {
    upsertCategory(input: $input) {
      code
      color
      description
      name
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($input: genericDeleteInput) {
    deleteCategory(input: $input) {
      deleted
    }
  }
`;

export { GET_CATEGORIES, POST_CATEGORY, DELETE_CATEGORY };
