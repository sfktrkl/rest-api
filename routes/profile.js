import { Router } from "express";
import {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
} from "../controllers/profile.js";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middlewares/auth.js";

const router = Router();
router.route("/me").get(authenticationMiddleware, getUserProfile);
router.route("/password/update").put(authenticationMiddleware, updatePassword);
router.route("/me/update").put(authenticationMiddleware, updateUser);
router.route("/me/delete").delete(authenticationMiddleware, deleteUser);
router
  .route("/me/applied")
  .get(
    authenticationMiddleware,
    authorizationMiddleware("user"),
    getAppliedJobs
  );

export default router;
