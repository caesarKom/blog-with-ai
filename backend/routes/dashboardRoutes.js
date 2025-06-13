import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { getDashboardSummary } from "../controllers/dashboardController.js"

const router = express.Router()

// Admin-only middelware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "ADMIN") {
    next()
  } else {
    res.status(403).json({ message: "Admin access only" })
  }
}

router.get("/", protect, adminOnly, getDashboardSummary)

export default router
