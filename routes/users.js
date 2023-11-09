import { Router } from "express";
import { registerUser, loginUser } from "../controllers/users.js";

const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;
