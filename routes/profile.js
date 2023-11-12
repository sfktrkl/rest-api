import { Router } from "express";
import {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
  getPublishedJobs,
  getUsers,
  deleteUserAdmin,
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
    authorizationMiddleware("user", "admin"),
    getAppliedJobs
  );
router
  .route("/me/published")
  .get(
    authenticationMiddleware,
    authorizationMiddleware("employer", "admin"),
    getPublishedJobs
  );
router
  .route("/users")
  .get(authenticationMiddleware, authorizationMiddleware("admin"), getUsers);
router
  .route("/users/:id")
  .delete(
    authenticationMiddleware,
    authorizationMiddleware("admin"),
    deleteUserAdmin
  );

export default router;
