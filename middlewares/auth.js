import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

export const authenticationMiddleware = catchErrors(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    return next(new ErrorHandler("Login to access this resource.", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

export function authorizationMiddleware(...roles) {
  return catchErrors(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role(${req.user.role}) is not allowed to access this resource.`,
          403
        )
      );
    }
    next();
  });
}
