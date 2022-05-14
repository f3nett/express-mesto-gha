const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// подключаем логгер запросов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http|https):\/\/(\w+:{0,1})?(([\w-.~:/?#[\]@!$&'()*+,;=]*)+)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// авторизация
app.use(auth);

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// подключаем логгер ошибок
app.use(errorLogger);

// обработчики ошибок
app.use((req, res, next) => {
  next(new NotFoundError(`Путь ${req.path} не найден`));
});

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

// подключение к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
