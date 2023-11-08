import { ErrorHandler } from "../utils/errorHandler.js";

export function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errorMessage: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError")
      error = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 404);
    else if (err.name === "ValidationError")
      error = new ErrorHandler(
        Object.values(err.errors)
          .map((e) => e.message)
          .join(" "),
        400
      );
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}
