const gql = String.raw;

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
  }

  type Prompt {
    _id: ID
    Animal_1: String
    Animal_2: String
    Activity: String
    Location: String
    Weather: String
    user: User
  }

  type Response {
    message: String
  }

  type AuthResponse {
    message: String
    user: User
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
    addPrompt(Animal_1: String, Animal_2: String, Activity: String, Location: String, Weather: String): Prompt
    deletePrompt(prompt_id: ID): Response
  }
`;

module.exports = typeDefs;