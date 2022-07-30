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
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => {
      next(new NotFound('Нет карточки по заданному id'));
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new Forbidden('Нельзя удалять чужие фильмы'));
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => {
            res.status(200).send({ data: deletedMovie });
          })
          .catch(next);
      }
    });
};
