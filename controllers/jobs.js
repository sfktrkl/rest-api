export function getJobs(req, res, next) {
  res.status(200).json({
    success: true,
    message: "This route will display jobs.",
  });
}
