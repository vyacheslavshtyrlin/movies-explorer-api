require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const routes = require('./routes');
const errorHeandler = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const allowedCors = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://moviesdiploma.nomoredomains.xyz',
];

const app = express();

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

const { PORT = 3001, NODE_ENV, DATA_BASE } = process.env;

mongoose.connect(
  NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesDb',
);

app.use(helmet());

app.use(bodyParser.json());

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errors());

app.use(errorLogger);

app.use(errorHeandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
