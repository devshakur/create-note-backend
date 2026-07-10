export const AppError = class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? "error" : "fail";
    this.isOperational = true;
  }
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with that unique field already exists";
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  if (process.env.NODE_ENV?.trim() !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message:
      statusCode >= 500 && process.env.NODE_ENV?.trim() === "production"
        ? "Internal server error"
        : message,
  });
};
