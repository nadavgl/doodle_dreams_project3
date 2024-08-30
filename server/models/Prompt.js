const { model, Schema } = require('mongoose');

const promptSchema = new Schema({
  animal_1: {
    type: String,
    required: true,
  },

  animal_2: {
    type: String,
    required: true
  },

  activity: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  weather: {
    type: String,
    required: true
  },
  imageUrl: {
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