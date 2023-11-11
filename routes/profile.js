import { Router } from "express";
import {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
} from "../controllers/profile.js";
import { authenticationMiddleware } from "../middlewares/auth.js";

const router = Router();
router.route("/me").get(authenticationMiddleware, getUserProfile);
router.route("/password/update").put(authenticationMiddleware, updatePassword);
router.route("/me/update").put(authenticationMiddleware, updateUser);
router.route("/me/delete").delete(authenticationMiddleware, deleteUser);

export default router;
