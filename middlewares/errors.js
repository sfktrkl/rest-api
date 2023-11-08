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
    res.status(err.statusCode).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
}
