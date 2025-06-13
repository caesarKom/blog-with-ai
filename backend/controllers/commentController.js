import db from "../lib/db.js"

// @desc    Add a comment to a blog post
// @route   POST /api/comments/:postId
// #access  Private
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params
    const { content, parentComment } = req.body

    // Ensure blog post exists
    const post = await db.blogPost.findUnique({ where: { id: postId } })
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (parentComment) {
      const parentExists = await db.comment.findUnique({
        where: { id: parentComment },
      })
      if (!parentExists) {
        return res.status(404).json({ message: "Parent comment not found" })
      }

      const reply = await db.parentComment.create({
        data: {
          author: {
            connect: { id: req.user.id },
          },
          post: {
            connect: { id: postId },
          },
          content,
          comments: {
            connect: { id: parentComment },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            },
          },
          comments: true,
        },
      })

      res.status(201).json(reply)
    } else {
      // Create Comment
      const comment = await db.comment.create({
        data: {
          post: {
            connect: { id: postId },
          },
          author: {
            connect: { id: req.user.id },
          },
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            },
          },
        },
      })

      res.status(201).json(comment)
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message })
  }
}

// @desc    Get all comments
// @route   GET /api/comments
// #access  Public
export const getAllComments = async (req, res) => {
  try {
    // Fetch all comments with author and post populated
    const comments = await db.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
        parentComment: {
          select: {
            id: true,
            commentId: true,
            content: true,
            author: true,
            post: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    // Create a map for commentId -> comment object
    const commentMap = {}
    comments.forEach((comment) => {
      const commentObj = { ...comment, replies: [] }
      commentMap[comment.id] = commentObj
    })

    // Nest replies under their parentComment
    const nestedComments = []
    comments.forEach((comment) => {
      if (comment.parentComment.length > 0) {
        comment.parentComment.forEach((item) => {
          const parent = commentMap[item.commentId]

          if (parent) {
            parent.replies.push(item)
          }
        })
      }
      nestedComments.push(commentMap[comment.id])
    })

    res.json(nestedComments)
  } catch (error) {
    console.error("Error in getAllComments:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch all comments", error: error.message })
  }
}

// @desc    Get all comments for a blog post
// @route   GET /api/comments/:postId
// #access  Public
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params

    const comments = await db.comment.findMany({
      where: { postId: postId },
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
        parentComment: {
          select: {
            id: true,
            commentId: true,
            content: true,
            author: true,
            post: true,
          },
        },
      },
    })

    const commentMap = {}
    comments?.forEach((comment) => {
      const commentObj = { ...comment, replies: [] }
      commentMap[comment.id] = commentObj
    })

    // Nest replies under their parentComment
    const nestedComments = []
    comments.forEach((comment) => {
      if (comment.parentComment.length > 0) {
        comment.parentComment.forEach((item) => {
          const parent = commentMap[item.commentId]

          if (parent) {
            parent.replies.push(item)
          }
        })
      }
      nestedComments.push(commentMap[comment.id])
    })

    res.json(nestedComments)
    //
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch By post comment",
      error: error.message,
    })
  }
}

// @desc    Delete a comment and its replies (author or admin only)
// @route   DELETE /api/comments/:commentId
// #access  Private
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params

    const comment = await db.comment.findUnique({ where: { id: commentId } })
    const commentParent = await db.parentComment.findFirst({
      where: { id: commentId },
    })
    if (comment) {
      await db.comment.delete({ where: { id: commentId } })
      return res.json({
        message: "Comment deleted successfully",
      })
    } else if (commentParent) {
      await db.parentComment.deleteMany({ where: { id: commentId } })
      return res.json({
        message: "Comment replies deleted successfully",
      })
    } else if (!comment || !commentParent) {
      return res.status(404).json({ message: "Comment not found" })
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message })
  }
}
