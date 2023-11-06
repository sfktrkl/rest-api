import { Router } from "express";
import { getJobs, postJobs } from "../controllers/jobs.js";

const router = Router();
router.route("/jobs").get(getJobs);
router.route("/jobs").post(postJobs);

export default router;
