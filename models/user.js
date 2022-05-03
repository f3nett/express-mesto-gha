const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { defaultUserName, defaultUserAbout, defaultUserAvatar } = require('../utils/constants');
const AuthError = require('../errors/auth-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUserName,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: defaultUserAbout,
  },
  avatar: {
    type: String,
    default: defaultUserAvatar,
    validate: {
      validator(val) {
        return /^(http|https):\/\/(\w+:{0,1})?(([\w-.~:/?#[\]@!$&'()*+,;=]*)+)/.test(val);
      },
      message: 'Ссылка имеет некорректный формат',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(val) {
        return validator.isEmail(val);
      },
      message: 'Email имеет некорректный формат',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильная почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
