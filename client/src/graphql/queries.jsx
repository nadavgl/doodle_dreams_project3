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
      animal_1
      animal_2
      activity
      location
      weather
    }
  }
`

export const GET_ALL_TURTLES = gql`
  query GetAllTurtles {
    getAllTurtles {
      _id
      animal_1
      animal_2
      activity
      location
      weather
      user {
        username
      }
    }
  }
`