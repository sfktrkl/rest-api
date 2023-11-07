import { Router } from "express";
import {
  getJobs,
  getJobsInRadius,
  getJob,
  postJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobs.js";

const router = Router();
router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs/:id").get(getJob);
router.route("/jobs").post(postJobs);
router.route("/jobs/:id").put(updateJob).delete(deleteJob);

export default router;
