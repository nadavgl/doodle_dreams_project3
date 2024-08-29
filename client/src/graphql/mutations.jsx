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
  mutation AddPrompt($animal_1: String, $animal_2: String, $activity: String, $location: String, $weather: String) {
    addPrompt(animal_1: $animal_1, animal_2: $animal_2, activity:$activity, location: $location, weather: $weather) {
      animal_1
      animal_2
      activity
      location
      weather
    }
  }
`
//basically written over the DELETE_TURTLE
export const DELETE_PROMPT = gql`
  mutation DeletePrompt($prompt_id: ID) {
    deletePrompt(prompt_id: $prompt_id) {
      message
    }
  }
`