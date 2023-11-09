import User from "../models/users.js";
import { catchErrors } from "../utils/errorHandler.js";

export const registerUser = catchErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getJWTToken();
  res.status(201).json({
    success: true,
    message: "User created",
    token,
  });
});
