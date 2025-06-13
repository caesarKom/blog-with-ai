import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import {
  generateBlogPost,
  generateBlogPostIdeas,
  generateCommentReply,
  generatePostSummary,
} from "../controllers/aiController.js"

const router = express.Router()

router.post("/generate", protect, generateBlogPost)
router.post("/generate-ideas", protect, generateBlogPostIdeas)
router.post("/generate-reply", protect, generateCommentReply)
router.post("/generate-summary", protect, generatePostSummary)

export default router
