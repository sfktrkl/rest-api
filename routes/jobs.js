import { Router } from "express";
import { getJobs } from "../controllers/jobs.js";

const router = Router();
router.route("/jobs").get(getJobs);

export default router;
