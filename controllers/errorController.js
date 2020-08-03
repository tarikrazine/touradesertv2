const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handelDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: " ${value} " Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors)
    .map((el) => el.message)
    .join(', ');
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // Api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Log error
  console.error('Error!!! 🚨', err);

  // Rendered website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // Api
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    }
    // Log error
    console.error('Error!!! 🚨', err);

    // Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // Rendered website
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message,
      code: err.statusCode,
    });

    // Programming or other unknown error: don't leak error details
  }
  // Log error
  console.error('Error!!!', err);

  // Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try later again!',
  });
};

const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.codeName === 'DuplicateKey')
      error = handelDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrorProd(error, req, res);
  }
};

module.exports = errorController;
