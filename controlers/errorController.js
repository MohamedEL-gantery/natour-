const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}.Please use another value !`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = ` Invaild input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJwtError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJwtExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  //B) RENDERD WEBSITE
  console.error('Error 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Worng!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //B) programming or other unknown error:dont leek error details
    //1)log err
    console.error('Error💥', err);
    //2)send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }

  // B) RENDERD WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Worng!',
      msg: err.message,
    });
  }
  // B) programming or other unknown error:dont leek error details
  // 1) log err
  console.error('Error💥', err);
  // 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Worng!',
    msg: ' Please Try Agian Later ',
  });
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidatorErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJwtError();
    if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();

    sendErrorProd(error, req, res);
  }
};
