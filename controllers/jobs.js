import Job from "../models/jobs.js";
import geocoder from "../utils/geocoder.js";

const EARTH_RADIUS_KM = 6371;

export async function getJobs(req, res, next) {
  const jobs = await Job.find();
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
}

export async function getJobsInRadius(req, res, next) {
  const { zipcode, distance } = req.params;

  const location = await geocoder.geocode(zipcode);
  const latitude = location[0].latitude;
  const longitude = location[0].longitude;

  const radius = distance / EARTH_RADIUS_KM;
  const jobs = await Job.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });
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
