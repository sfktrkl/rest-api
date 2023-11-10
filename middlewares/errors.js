import { ErrorHandler } from "../utils/errorHandler.js";

const errors = {
  CastError: {
    default: {
      statusCode: 404,
      message: (err) => {
        return `Resource not found. Invalid: ${err.path}`;
      },
    },
  },
  ValidationError: {
    default: {
      statusCode: 400,
      message: (err) => {
        return Object.values(err.errors)
          .map((e) => e.message)
          .join(" ");
      },
    },
  },
  MongoServerError: {
    11000: {
      statusCode: 400,
      message: (err) => {
        return `Duplicate ${Object.keys(err.keyValue)}.`;
      },
    },
    default: {
      statusCode: 500,
      message: (err) => {
        return `Mongo server errror.`;
      },
    },
  },
  JsonWebTokenError: {
    default: {
      statusCode: 500,
      message: (err) => {
        return "JSON Web token is invalid.";
      },
    },
  },
  TokenExpiredError: {
    default: {
      statusCode: 500,
      message: (err) => {
        return "JSON Web token is expired.";
      },
    },
  },
};

function createError(err) {
  if (errors.hasOwnProperty(err.name)) {
    let { statusCode, message } = errors[err.name]["default"];
    if (errors[err.name].hasOwnProperty(err.code)) {
      statusCode = errors[err.name][err.code].statusCode;
      message = errors[err.name][err.code].message;
    }
    return new ErrorHandler(message(err), statusCode);
  }
  return new ErrorHandler(
    err.message || "Internal server error",
    err.statusCode
  );
}

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
    const error = createError(err);
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
}
