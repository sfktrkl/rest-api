import { Router } from "express";
import {
  getJobs,
  getJobsInRadius,
  getJob,
  postJobs,
  updateJob,
  deleteJob,
  jobStats,
} from "../controllers/jobs.js";
import { authenticationMiddleware } from "../middlewares/auth.js";

const router = Router();
router.route("/jobs").get(authenticationMiddleware, getJobs);
router
  .route("/jobs/:zipcode/:distance")
  .get(authenticationMiddleware, getJobsInRadius);
router.route("/jobs/:id").get(authenticationMiddleware, getJob);
router.route("/jobs").post(authenticationMiddleware, postJobs);
router
  .route("/jobs/:id")
  .put(authenticationMiddleware, updateJob)
  .delete(authenticationMiddleware, deleteJob);
router.route("/stats/:topic").get(authenticationMiddleware, jobStats);

export default router;
