const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Unauthorized = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Введен некоректный Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [2, 'Пароль должен быть больше 2-ух символов'],

  },
  name: {
    type: String,
    minlength: [2, 'Введите корректное имя'],
    maxlength: [30, 'Введите корректное имя'],
    required: true,
    default: 'Жак-Ив Кусто',
  },
});
userSchema.statics.findUserByCredentials = function (password, email) {
  return this.findOne({ email }).select('+password')
    .orFail(() => {
      throw new Unauthorized('Неправильные почта или пароль');
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
