import fs from "fs";
import Job from "../models/jobs.js";
import User from "../models/users.js";
import { sendToken } from "../utils/jwtToken.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

export const getUserProfile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "jobsPublished",
    select: "title postingDate",
  });

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

async function deleteUserData(user, role) {
  if (role === "employer") await Job.deleteMany({ user: user });

  if (role === "user") {
    const jobs = await Job.find({ "applicantsApplied.id": user }).select(
      "+applicantsApplied"
    );

    for (let i = 0; i < jobs.length; i++) {
      let obj = jobs[i].applicantsApplied.find((o) => o.id === user);
      let filepath = `${process.env.UPLOAD_PATH}/${obj.resume}`;
      fs.unlink(filepath, (err) => {
        if (err) return console.log(err);
      });

      jobs[i].applicantsApplied.splice(
        jobs[i].applicantsApplied.indexOf(obj.id)
      );

      await jobs[i].save();
    }
  }
}

export const deleteUser = catchErrors(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  await deleteUserData(req.user.id, req.user.role);

  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Account has been deleted.",
  });
});

export const getAppliedJobs = catchErrors(async (req, res, next) => {
  const jobs = await Job.find({ "applicantsApplied.id": req.user.id }).select(
    "+applicantsApplied"
  );

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});
