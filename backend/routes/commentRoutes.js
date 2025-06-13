import express from "express"
import {
  addComment,
  getCommentsByPost,
  deleteComment,
  getAllComments,
} from "../controllers/commentController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/:postId", protect, addComment)
router.get("/:postId", getCommentsByPost)
router.get("/", getAllComments)
router.delete("/:commentId", protect, deleteComment)

export default router
