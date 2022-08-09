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

const corsOptions = {
  origin: ['http://localhost:3001', 'http://moviesdiploma.nomoredomains.xyz'],
};

const app = express();
app.use(cors(corsOptions));

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
