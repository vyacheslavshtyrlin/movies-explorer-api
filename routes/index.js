const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./user');
const movieRouter = require('./movie');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundErr = require('../errors/notFoundError');

router.all('/', auth);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, movieRouter);

router.all('/*', auth, () => {
  throw new NotFoundErr('Ошибка 404');
});

module.exports = router;
