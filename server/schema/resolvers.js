const { User, Prompt } = require('../models');
const { sign } = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const axios = require('axios');


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

    async getUserPrompts(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError({
          message: 'Not Authorized'
        })
      }

      const user = await User.findById(user_id).populate('prompts');

      return user.prompts;
    },

    async getAllPrompts() {
      const prompts = await Prompt.find().populate('user');

      return prompts;
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

    // Prompt Resolvers
    async addPrompt(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action')
      }

      const user = await User.findById(user_id);
      const prompt = await Prompt.create({
        ...args,
        user: user._id
      });

      user.prompts.push(prompt._id);
      await user.save();

      return prompt
    },

    async deletePrompt(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action')
      }

      const user = await User.findById(user_id);

      if (!user.prompts.includes(args.prompt_id)) {
        throw new GraphQLError('You cannot delete a prompt that you did not add');
      }

      await Prompt.deleteOne({
        _id: args.prompt_id
      });

      user.prompts.pull(args.prompt_id);
      await user.save();

      return {
        message: 'Prompt deleted successfully'
      }
    },
    async generateImage(_, { prompt }, context) {
      if (!context.user_id) {
        throw new GraphQLError('You are not authorized to perform that action');
      }

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            prompt: prompt,
            n: 1,
            size: '1024x1024',
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const imageUrl = response.data.data[0].url;
        return { imageUrl };
      } catch (error) {
        console.error('Error generating image:', error.response.data);
        throw new GraphQLError('Failed to generate image');
      }
    }
  }
};

module.exports = resolvers;