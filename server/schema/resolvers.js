const { User, Turtle } = require('../models');
const { sign } = require('jsonwebtoken');

const { GraphQLError } = require('graphql');

function createToken(user_id) {
  const token = sign({ user_id: user_id }, process.env.JWT_SECRET);

  return token;
}

const resolvers = {
  Query: {
    async getUser(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        return {
          user: null
        }
      }

      const user = await User.findById(user_id);

      if (!user) {
        return {
          user: null
        }
      }

      return {
        user
      };
    },

    async getUserTurtles(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError({
          message: 'Not Authorized'
        })
      }

      const user = await User.findById(user_id).populate('turtles');

      return user.turtles;
    },

    async getAllTurtles() {
      const turtles = await Turtle.find().populate('user');

      return turtles;
    }
  },

  Mutation: {
    async registerUser(_, args, context) {
      try {
        const user = await User.create(args);

        // Create a cookie and attach a JWT token
        const token = createToken(user._id);

        context.res.cookie('token', token, {
          httpOnly: true
        });

        return {
          message: 'User registered successfully!',
          user
        }
      } catch (error) {
        console.log('register error', error);

        if (error.code === 11000) {
          throw new GraphQLError('A user with that email address or username already exists')
        }

        throw new GraphQLError(error.message.split(':')[2].trim());
      }
    },

    async loginUser(_, args, context) {
      const user = await User.findOne({
        email: args.email
      });

      if (!user) {
        throw new GraphQLError('No user found by that email address.');
      }

      const valid_pass = await user.validatePassword(args.password);

      if (!valid_pass) {
        throw new GraphQLError('Password incorrect.');
      }

      const token = createToken(user._id); // Create a JWT

      context.res.cookie('token', token, {
        httpOnly: true
      }); // Send a cookie with the JWT attached

      return {
        message: 'Logged in successfully!',
        user
      }
    },

    logoutUser(_, args, context) {
      context.res.clearCookie('token');

      return {
        message: 'Logged out successfully'
      }
    },

    // Turtle Resolvers
    async addTurtle(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action')
      }

      const user = await User.findById(user_id);
      const turtle = await Turtle.create({
        ...args,
        user: user._id
      });

      user.turtles.push(turtle._id);
      await user.save();

      return turtle
    },

    async deleteTurtle(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action')
      }

      const user = await User.findById(user_id);

      if (!user.turtles.includes(args.turtle_id)) {
        throw new GraphQLError('You cannot delete a turtle that you did not add');
      }

      await Turtle.deleteOne({
        _id: args.turtle_id
      });

      user.turtles.pull(args.turtle_id);
      await user.save();

      return {
        message: 'Turtle deleted successfully'
      }
    }
  }
};

module.exports = resolvers;