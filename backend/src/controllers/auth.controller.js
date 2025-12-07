const jwt = require('jsonwebtoken');
const { User } = require('../models');

const APP_SECRET = process.env.APP_SECRET || 'supersecret';

const toPublicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
});

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ email, passwordHash: password, name });
    const token = jwt.sign({ sub: user.id }, APP_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user.id }, APP_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  res.json({ user: toPublicUser(req.user) });
};

module.exports = {
  register,
  login,
  me,
};

