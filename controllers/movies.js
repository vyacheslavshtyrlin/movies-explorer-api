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
    trailerLink,
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
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequest(error.message));
      }
      next(error);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.moviesId)
    .orFail(() => {
      next(new NotFound('Нет карточки по заданному id'));
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new Forbidden('Нельзя удалять чужие фильмы'));
      }
      movie.remove()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch(next);
};
