const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

const NOT_FOUND_ERR_CODE = 404;

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

// временное решение для авторизации для создания карточек
app.use((req, res, next) => {
  req.user = {
    _id: '625dabb165e46b13c85e6165',
  };

  next();
});

app.use(express.json());
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(NOT_FOUND_ERR_CODE).send({ message: `Путь ${req.path} не найден` });
});

// подключение к серверу mongo
async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

main();
