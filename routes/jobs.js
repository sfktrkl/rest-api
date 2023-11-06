import { Router } from "express";
const router = Router();

router.get("/jobs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This route will display jobs.",
  });
});

export default router;
