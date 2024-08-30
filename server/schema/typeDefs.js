const gql = String.raw;

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
  }

  type Prompt {
    _id: ID
    animal_1: String
    animal_2: String
    activity: String
    location: String
    weather: String
    user: User
  }

  type Response {
    message: String
  }

  type AuthResponse {
    message: String
    user: User
  }

  type ImageResponse {
    imageUrl: String
  }

  type Query {
    getUser: AuthResponse
    getUserPrompts: [Prompt]
    getAllPrompts: [Prompt]
  }

  type Mutation {
    # User Mutations
    registerUser(username: String, email: String, password: String): AuthResponse
    loginUser(email: String, password: String): AuthResponse
    logoutUser: AuthResponse

    # Prompt Mutations
    addPrompt(animal_1: String, animal_2: String, activity: String, location: String, weather: String): Prompt
    deletePrompt(prompt_id: ID): Response

    # DALL-E Image Generation Mutation
    generateImage(prompt: String!): ImageResponse
  }
`;

module.exports = typeDefs;
