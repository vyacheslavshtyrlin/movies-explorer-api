const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFound = require('../errors/notFoundError');
const Conflict = require('../errors/conflictError');
const BadRequest = require('../errors/badRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { password, email } = req.body;
  User.findUserByCredentials(password, email)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Нет пользователя по заданному id');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((data) => {
      res.send({ name: data.name, about: data.email });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        throw new BadRequest(error.message);
      }
      throw error;
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .catch(next)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((data) => {
          res
            .send({
              name: data.name,
              email: data.email,
            });
        })
        .catch((error) => {
          if (error.code === 11000) {
            throw new Conflict(
              'Пользователь с таким e-mail уже зарегестрирован',
            );
          } else if (
            error.name === 'ValidationError'
            || error.name === 'CastError'
          ) {
            throw new BadRequest(error.message);
          }
          throw error;
        })
        .catch(next);
    });
};
