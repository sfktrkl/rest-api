import { Router } from "express";
import {
  getJobs,
  getJobsInRadius,
  getJob,
  postJob,
  updateJob,
  deleteJob,
  jobStats,
  applyJob,
} from "../controllers/jobs.js";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middlewares/auth.js";

const router = Router();
router.route("/jobs").get(authenticationMiddleware, getJobs);
router
  .route("/jobs/:zipcode/:distance")
  .get(authenticationMiddleware, getJobsInRadius);
router.route("/jobs/:id").get(authenticationMiddleware, getJob);
router
  .route("/jobs")
  .post(authenticationMiddleware, authorizationMiddleware("employer"), postJob);
router
  .route("/jobs/:id")
  .put(authenticationMiddleware, authorizationMiddleware("employer"), updateJob)
  .delete(
    authenticationMiddleware,
    authorizationMiddleware("employer"),
    deleteJob
  );
router
  .route("/jobs/:id/apply")
  .put(authenticationMiddleware, authorizationMiddleware("user"), applyJob);
router.route("/stats/:topic").get(authenticationMiddleware, jobStats);

export default router;
