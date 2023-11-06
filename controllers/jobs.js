import Job from "../models/jobs.js";

export function getJobs(req, res, next) {
  res.status(200).json({
    success: true,
    message: "This route will display jobs.",
  });
}

export async function postJobs(req, res, next) {
  const job = await Job.create(req.body);
  res.status(201).json({
    success: true,
    message: "Job created",
    data: job,
  });
}
