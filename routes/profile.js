import { Router } from "express";
import {
  getUserProfile,
  updatePassword,
  updateUser,
} from "../controllers/profile.js";
import { authenticationMiddleware } from "../middlewares/auth.js";

const router = Router();
router.route("/me").get(authenticationMiddleware, getUserProfile);
router.route("/password/update").put(authenticationMiddleware, updatePassword);
router.route("/me/update").put(authenticationMiddleware, updateUser);

export default router;
