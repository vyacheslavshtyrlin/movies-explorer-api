const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const errorHeandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
require('dotenv').config();

const allowedCors = ['http://localhost:3001', 'http://localhost:3000'];

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesDb');

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(helmet());

app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errors());

app.use(errorLogger);

app.use(errorHeandler);

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
