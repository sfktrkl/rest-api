import User from "../models/users.js";
import { catchErrors } from "../utils/errorHandler.js";

export const getUserProfile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
