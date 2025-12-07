const jwt = require('jsonwebtoken');
const { User } = require('../models');

const APP_SECRET = process.env.APP_SECRET || 'supersecret';

const authRequired = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [, token] = header.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const payload = jwt.verify(token, APP_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authRequired;

