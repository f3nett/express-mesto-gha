require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { cors } = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { wrongPathHandler, errHandler } = require('./middlewares/errhandler');
const { signinValidation, signupValidation } = require('./validation/signin');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(cors);

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// логгер запросов
app.use(requestLogger);

// рут для краш-теста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// руты, не требующие авторизации
app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

// авторизация
app.use(auth);

// руты, требующие авторизации
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// логгер ошибок
app.use(errorLogger);

// обработчики ошибок
app.use(wrongPathHandler);
app.use(errors());
app.use(errHandler);

// подключение к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
