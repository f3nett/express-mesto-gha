const jwt = require('jsonwebtoken');

const JWT_SECRET = 'lsmlkm234234nanc';

const getJwtToken = (userId) => jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn: '7d' });

module.exports = { JWT_SECRET, getJwtToken };
