import crypto from "crypto";
import User from "../models/users.js";
import { sendEmail } from "../utils/email.js";
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

export const forgotPassword = catchErrors(async (req, res, next) => {
  const email = req.body.email;
  if (!email) return next(new ErrorHandler("Enter email address.", 400));

  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found.", 404));

  const token = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: `rest-api password recovery`,
      message: `Your password recovery link:\n\n
        ${req.protocol}://${req.get("host")}/api/v1/password/reset/${token}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email can not be sent."), 500);
  }
});

export const resetPassword = catchErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) return next(new ErrorHandler("Token is invalid.", 400));

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

export const logoutUser = catchErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out.",
  });
});
