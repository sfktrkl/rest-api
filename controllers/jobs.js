import Job from "../models/jobs.js";

export async function getJobs(req, res, next) {
  const jobs = await Job.find();
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
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
