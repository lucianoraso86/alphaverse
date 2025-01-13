import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      name
      lastname
      cellphone
    }
  }
`;

export default LOGIN_MUTATION;
