import Job from "../models/jobs.js";
import geocoder from "../utils/geocoder.js";
import { Filters } from "../utils/filters.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

const EARTH_RADIUS_KM = 6371;

export const getJobs = catchErrors(async (req, res, next) => {
  const filters = new Filters(Job.find(), req.query).filter().sort().fields();
  const jobs = await filters.query;
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
});

export const getJobsInRadius = catchErrors(async (req, res, next) => {
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
});

export const getJob = catchErrors(async (req, res, next) => {
  const job = await Job.findOne({
    _id: req.params.id,
  });

  if (job) {
    res.status(200).json({
      success: true,
      data: job,
    });
  } else next(new ErrorHandler("Job not found", 404));
});

export const postJobs = catchErrors(async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(201).json({
    success: true,
    message: "Job created",
    data: job,
  });
});

export const updateJob = catchErrors(async (req, res, next) => {
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
  } else next(new ErrorHandler("Job not found", 404));
});

export const deleteJob = catchErrors(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id, {
    useFindAndModify: false,
  });

  if (job) {
    res.status(200).json({
      success: true,
      message: "Job deleted",
      data: job,
    });
  } else next(new ErrorHandler("Job not found", 404));
});

export const jobStats = catchErrors(async (req, res, next) => {
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
  } else next(new ErrorHandler(`No stats found for ${req.params.topic}`, 404));
});
