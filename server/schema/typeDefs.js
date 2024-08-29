const gql = String.raw;

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
  }

  type Turtle {
    _id: ID
    name: String
    weapon: String
    headbandColor: String
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
    getUserTurtles: [Turtle]
    getAllTurtles: [Turtle]
  }

  type Mutation {
    # User Mutations
    registerUser(username: String, email: String, password: String): AuthResponse
    loginUser(email: String, password: String): AuthResponse
    logoutUser: AuthResponse

    # Turtle Mutations
    addTurtle(name: String, weapon: String, headbandColor: String): Turtle
    deleteTurtle(turtle_id: ID): Response
  }
`;

module.exports = typeDefs;