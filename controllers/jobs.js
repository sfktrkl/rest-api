import Job from "../models/jobs.js";
import geocoder from "../utils/geocoder.js";
import { ErrorHandler } from "../utils/errorHandler.js";

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

export async function getJob(req, res, next) {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
    });

    if (job) {
      res.status(200).json({
        success: true,
        data: job,
      });
    } else return next(new ErrorHandler("Job not found", 404));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job id is not valid",
    });
  }
}

export async function postJobs(req, res, next) {
  const job = await Job.create(req.body);
  res.status(201).json({
    success: true,
    message: "Job created",
    data: job,
  });
}

export async function updateJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (job) {
      res.status(200).json({
        success: true,
        message: "Job updated",
        data: job,
      });
    } else return next(new ErrorHandler("Job not found", 404));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job id is not valid",
    });
  }
}

export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id, {
      useFindAndModify: false,
    });

    if (job) {
      res.status(200).json({
        success: true,
        message: "Job deleted",
        data: job,
      });
    } else return next(new ErrorHandler("Job not found", 404));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Job id is not valid",
    });
  }
}

export async function jobStats(req, res, next) {
  try {
    const stats = await Job.aggregate([
      {
        $match: { $text: { $search: '"' + req.params.topic + '"' } },
      },
      {
        $group: {
          _id: { $toUpper: "$experience" },
          totalJobs: { $sum: 1 },
          avgSalary: { $avg: "$salary" },
          minSalary: { $min: "$salary" },
          maxSalary: { $max: "$salary" },
        },
      },
    ]);

    if (stats && stats.length > 0) {
      res.status(200).json({
        success: true,
        data: stats,
      });
    } else
      return next(
        new ErrorHandler(`No stats found for ${req.params.topic}`, 404)
      );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching job statistics",
    });
  }
}
