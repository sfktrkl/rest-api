import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter your name."],
  },
  email: {
    type: String,
    required: [true, "Enter your email address."],
    unique: true,
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  role: {
    type: String,
    enum: {
      values: ["user", "employer"],
      message: "Please select correct options.",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Enter a password."],
    minlength: [8, "Password must be at least 8 characters."],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
