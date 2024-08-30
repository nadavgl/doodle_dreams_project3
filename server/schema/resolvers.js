const { User, Prompt } = require('../models');
const { sign } = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const fal = require('@fal-ai/serverless-client'); // Import Fal AI client

function createToken(user_id) {
  return sign({ user_id }, process.env.JWT_SECRET);
}

// Initialize Fal AI client
fal.config({
  credentials: process.env.FAL_KEY // Ensure this matches the environment variable
});

const resolvers = {
  Query: {
    async getUser(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        return { user: null };
      }

      const user = await User.findById(user_id);
      return { user: user || null };
    },

    async getUserPrompts(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('Not Authorized');
      }

      const user = await User.findById(user_id).populate('prompts');
      return user.prompts;
    },

    async getAllPrompts() {
      return await Prompt.find().populate('user');
    }
  },

  Mutation: {
    async registerUser(_, args, context) {
      try {
        const user = await User.create(args);
        const token = createToken(user._id);

        context.res.cookie('token', token, {
          httpOnly: true
        });

        return { message: 'User registered successfully!', user };
      } catch (error) {
        console.error('Register error:', error);

        if (error.code === 11000) {
          throw new GraphQLError('A user with that email address or username already exists');
        }

        throw new GraphQLError(error.message.split(':')[2]?.trim() || 'Registration error');
      }
    },

    async loginUser(_, args, context) {
      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new GraphQLError('No user found by that email address.');
      }

      const valid_pass = await user.validatePassword(args.password);

      if (!valid_pass) {
        throw new GraphQLError('Password incorrect.');
      }

      const token = createToken(user._id);
      context.res.cookie('token', token, { httpOnly: true });

      return { message: 'Logged in successfully!', user };
    },

    logoutUser(_, args, context) {
      context.res.clearCookie('token');
      return { message: 'Logged out successfully' };
    },

    async addPrompt(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action');
      }

      const user = await User.findById(user_id);
      console.log(args)
      const prompt = await Prompt.create({
        ...args,
        user: user._id
      })

      user.prompts.push(prompt._id)

      await user.save()

      return prompt;
    },

    async deletePrompt(_, args, context) {
      const user_id = context.user_id;

      if (!user_id) {
        throw new GraphQLError('You are not authorized to perform that action');
      }

      const user = await User.findById(user_id);

      if (!user.prompts.includes(args.prompt_id)) {
        throw new GraphQLError('You cannot delete a prompt that you did not add');
      }

      await Prompt.deleteOne({ _id: args.prompt_id });

      user.prompts.pull(args.prompt_id);
      await user.save();

      return { message: 'Prompt deleted successfully' };
    },

    async generateImage(_, { prompt }, context) {
      if (!context.user_id) {
        throw new GraphQLError('You are not authorized to perform that action');
      }

      try {
        const response = await fal.subscribe("fal-ai/flux", {
          input: {
            prompt: prompt,
            size: {
              width: 512,
              height: 512,
            },
            // Add other options if needed
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          }
        });

        const imageUrl = response.images[0].url; // Adjust this based on the response structure

        return { imageUrl };
      } catch (error) {
        console.error('Error generating image:', error);
        throw new GraphQLError('Failed to generate image');
      }
    }
  }
};

module.exports = resolvers;
