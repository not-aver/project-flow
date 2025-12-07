const notFound = (req, res, next) => {
  // Return 404 for unmatched routes without calling next() to avoid double responses
  res.status(404).json({ message: 'Resource not found' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  // Basic logging for dev purposes
  console.error(err);
  res.status(status).json({ message });
};

module.exports = {
  notFound,
  errorHandler,
};

