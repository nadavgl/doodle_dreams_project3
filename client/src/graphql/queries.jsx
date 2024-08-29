import { gql } from '@apollo/client'

export const GET_USER = gql`
  query GetUser {
    getUser {
      message
      user {
        _id
        username
      }
    }
  }
`

export const GET_USER_PROMPTS = gql`
  query GetUserPrompts {
    getUserPrompts {
      _id
      headbandColor
      name
      weapon
    }
  }
`

export const GET_ALL_PROMPTS = gql`
  query GetAllTurtles {
    getAllTurtles {
      _id
      headbandColor
      name
      user {
        username
      }
      weapon
    }
  }
`