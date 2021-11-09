const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConferenceSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  ticketsLeft: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('post', ConferenceSchema);
