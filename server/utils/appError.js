class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // this is so that the errors which we create will have an isOperational tag
    // while the errors which are generated by node will not have this and we can easily identify which is which

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;