const Movie = require('../models/movies');
const NotFound = require('../errors/notFoundError');
const BadRequest = require('../errors/badRequest');
const Forbidden = require('../errors/forbidden');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        throw new BadRequest(error.message);
      }
      throw error;
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Нет карточки по заданному id');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new Forbidden('Нельзя удалять чужие фильмы');
      }
      movie.remove()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch(next);
};
