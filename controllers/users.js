import User from "../models/users.js";
import { sendToken } from "../utils/jwtToken.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

export const registerUser = catchErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendToken(user, 200, res);
});

export const loginUser = catchErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return next(new ErrorHandler("Enter email address.", 400));
  if (!password) return next(new ErrorHandler("Enter password.", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("User not found.", 404));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Wrong password.", 401));

  sendToken(user, 200, res);
});
