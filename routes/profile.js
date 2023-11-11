import { Router } from "express";
import { getUserProfile } from "../controllers/profile.js";
import { authenticationMiddleware } from "../middlewares/auth.js";

const router = Router();
router.route("/me").get(authenticationMiddleware, getUserProfile);

export default router;
