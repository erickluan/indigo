const mongoose = require('mongoose');

module.exports = (() => {
  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 4,
    },
    avatar: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
      type: String,
      required: true,
    },
  });
  return mongoose.model('User', schema);
})();
