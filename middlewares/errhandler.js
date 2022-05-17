const NotFoundError = require('../errors/not-found-err');

// обработчик ошибки некорректного пути
const wrongPathHandler = (req, res, next) => {
  next(new NotFoundError(`Путь ${req.path} не найден`));
};

// централизованный обработчик
const errHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};

module.exports = { wrongPathHandler, errHandler };
