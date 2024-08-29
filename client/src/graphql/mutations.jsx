import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
  mutation LoginUser($email: String, $password: String) {
    loginUser(email: $email, password: $password) {
      message
      user {
        _id
        username
      }
    }
  }
`

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String, $email: String, $password: String) {
    registerUser(username: $username, email: $email, password: $password) {
      message
      user {
        _id
        username
      }
    }
  }
`

export const LOGOUT_USER = gql`
  mutation LogoutUser {
    logoutUser {
      message
    }
  }
`

export const ADD_PROMPT = gql`
  mutation AddTurtle($name: String, $weapon: String, $headbandColor: String) {
    addTurtle(name: $name, weapon: $weapon, headbandColor: $headbandColor) {
      name
      headbandColor
      weapon
    }
  }
`

export const DELETE_PROMPT = gql`
  mutation DeleteTurtle($turtle_id: ID) {
    deleteTurtle(turtle_id: $turtle_id) {
      message
    }
  }
`
export const GENERATE_IMAGE = gql`
  mutation GenerateImage($prompt: String!) {
    generateImage(prompt: $prompt) {
      imageUrl
    }
  }
`;