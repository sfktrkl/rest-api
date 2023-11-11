import User from "../models/users.js";
import { sendToken } from "../utils/jwtToken.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

export const getUserProfile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updatePassword = catchErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword)
    return next(new ErrorHandler("Enter current password.", 400));
  if (!newPassword) return next(new ErrorHandler("Enter new password.", 400));

  const user = await User.findById(req.user.id).select("+password");
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) return next(new ErrorHandler("Password is incorrect.", 401));

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res);
});

export const updateUser = catchErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
