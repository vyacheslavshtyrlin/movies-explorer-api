const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введите корректную ссылку',
    },
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введите корректную ссылку',
    },
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Введите корректную ссылку',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
