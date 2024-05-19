import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
  mutation SignUp($input: SignUpInput!) {
    signup(input: $input) {
      name
      username
      password
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      name
      username
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
