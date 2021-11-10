const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  purchasedTickets: [
    {
      conferenceId: {
        type: Schema.Types.ObjectId,
        ref: 'conferences',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Users', UserSchema);
