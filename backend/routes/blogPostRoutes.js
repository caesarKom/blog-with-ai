import express from "express"
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostByTag,
  searchPosts,
  incrementView,
  likePost,
  getTopPosts,
} from "../controllers/blogPostController.js"
import { protect } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Admin-only middelware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role == "ADMIN") {
    next()
  } else {
    res.status(403).json({ message: "Admin access only" })
  }
}

router.post("/", protect, adminOnly, createPost)
router.get("/", getAllPosts)
router.get("/slug/:slug", getPostBySlug)
router.put("/:id", protect, adminOnly, updatePost)
router.delete("/:id", protect, adminOnly, deletePost)
router.get("/tag/:tag", getPostByTag)
router.get("/search", searchPosts)
router.post("/:id/view", incrementView)
router.post("/:id/like", protect, likePost)
router.get("/trending", getTopPosts)

export default router
