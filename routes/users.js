import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
} from "../controllers/users.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);

export default router;
