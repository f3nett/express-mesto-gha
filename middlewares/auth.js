const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
