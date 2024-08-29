const { model, Schema } = require('mongoose');

const turtleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  weapon: {
    type: String,
    required: true
  },

  headbandColor: {
    type: String,
    required: true
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Turtle = model('Turtle', turtleSchema);

module.exports = Turtle;