const SALT_ROUNDS = 10;
// Значение для заголовка Access-Control-Allow-Methods по умолчанию
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://mesto.f3nett.nomoreparties.sbs',
  'http://mesto.f3nett.nomoreparties.sbs',
  'localhost:3000',
];

const defaultUserName = 'Жак-Ив Кусто';
const defaultUserAbout = 'Исследователь';
const defaultUserAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

module.exports = {
  SALT_ROUNDS,
  DEFAULT_ALLOWED_METHODS,
  allowedCors,
  defaultUserName,
  defaultUserAbout,
  defaultUserAvatar,
};
