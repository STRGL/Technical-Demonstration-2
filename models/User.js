const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: String,
  location: String,
  spokenLanguages: Array,
});

module.exports = mongoose.model('Users', UserSchema);
