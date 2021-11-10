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
  technology: {
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
  time: { type: Number, default: new Date().getTime() },
});

module.exports = mongoose.model('conferences', ConferenceSchema);
