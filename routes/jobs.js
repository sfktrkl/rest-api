import { Router } from "express";
import { getJobs, getJobsInRadius, postJobs } from "../controllers/jobs.js";

const router = Router();
router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs").post(postJobs);

export default router;
