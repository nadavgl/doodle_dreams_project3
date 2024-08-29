const { model, Schema } = require('mongoose');

const promptSchema = new Schema({
  Animal_1: {
    type: String,
    required: true,
  },

  Animal_2: {
    type: String,
    required: true
  },

  Activity: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    required: true
  },
  Weather: {
    type: String,
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Prompt = model('Prompt', promptSchema);

module.exports = Prompt;