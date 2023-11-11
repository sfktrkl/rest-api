import path from "path";
import Job from "../models/jobs.js";
import geocoder from "../utils/geocoder.js";
import { Filters } from "../utils/filters.js";
import { ErrorHandler, catchErrors } from "../utils/errorHandler.js";

const EARTH_RADIUS_KM = 6371;

export const getJobs = catchErrors(async (req, res, next) => {
  const filters = new Filters(Job.find(), req.query)
    .filter()
    .sort()
    .fields()
    .search()
    .pagination();
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

export const postJob = catchErrors(async (req, res, next) => {
  req.body.user = req.user.id;
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

export const applyJob = catchErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id).select("+applicantsApplied");
  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (job.lastDate < new Date(Date.now()))
    return next(new ErrorHandler("Can not apply. Date is over", 400));
  for (let applicant of job.applicantsApplied) {
    if (applicant.id === req.user.id)
      return next(new ErrorHandler("Already applied for this job.", 400));
  }

  if (!req.files) return next(new ErrorHandler("Upload file", 400));

  const file = req.files.file;
  const supportedFiles = /.docx|.pdf/;
  if (!supportedFiles.test(path.extname(file.name)))
    return next(new ErrorHandler("Upload document file", 400));
  if (file.size > process.env.MAX_FILE_SIZE)
    return next(new ErrorHandler("Upload file less than 2MB", 400));

  const extension = path.parse(file.name).ext;
  file.name = `${req.user.name.replace(" ", "_")}_${job._id}${extension}`;

  file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) return next(new ErrorHandler("Upload failed", 500));

    await Job.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          applicantsApplied: {
            id: req.user.id,
            resume: file.name,
          },
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Applied to Job",
      data: file.name,
    });
  });
});
