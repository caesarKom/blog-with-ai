import db from "../lib/db.js"

export const createPost = async (req, res) => {
  try {
    const { title, content, coverImageUrl, tags, isDraft, generatedByAI } =
      req.body
    const slug = title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

    const newPost = await db.blogPost.create({
      data: {
        title,
        slug,
        content,
        coverImageUrl,
        tags,
        isDraft,
        generatedByAI,
        authorId: req.user.id,
      },
    })

    res.status(201).json(newPost)
    //
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message })
  }
}

export const updatePost = async (req, res) => {
  try {
    const post = await db.blogPost.findUnique({ where: { id: req.params.id } })
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }
    if (post.authorId !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" })
    }
    const updateData = req.body
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
    }
    const updatedPost = await db.blogPost.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
      },
    })
    res.json(updatedPost)
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const deletePost = async (req, res) => {
  try {
    const post = await db.blogPost.findUnique({ where: { id: req.params.id } })

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }
    await db.blogPost.delete({ where: { id: post.id } })

    res.json({ message: "Post deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const status = req.query.status || "published"
    const page = parseInt(req.query.page) || 1
    const limit = 5
    const skip = (page - 1) * limit

    // Determine filter for main posts response
    let where = {}
    if (status === "published") where.isDraft = false
    else if (status === "draft") where.isDraft = true

    // Fetch paginated posts with author data
    const posts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
    })

    // Count totals for pagination and tab counts
    const [totalCount, allCount, publishedCount, draftCount] =
      await Promise.all([
        db.blogPost.count({ where }), // for pagination of current tab
        db.blogPost.count(),
        db.blogPost.count({ where: { isDraft: false } }),
        db.blogPost.count({ where: { isDraft: true } }),
      ])

    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      counts: {
        all: allCount,
        published: publishedCount,
        draft: draftCount,
      },
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const getPostBySlug = async (req, res) => {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug: req.params.slug },
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
      },
    })

    if (!post) return res.status(404).json({ message: "Post not found" })

    res.json(post)
    //
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const getPostByTag = async (req, res) => {
  try {
    const tag = req.params.tag

    if (!tag)
      return res.status(400).json({ message: "Tag parameter is required" })

    const post = await db.blogPost.findMany({
      where: {
        tags: {
          hasSome: [tag],
        },
        isDraft: false,
      },
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
      },
    })

    res.json(post)
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const searchPosts = async (req, res) => {
  try {
    const q = req.query.q
    const post = await db.blogPost.findMany({
      where: {
        isDraft: false,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
      },
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const incrementView = async (req, res) => {
  try {
    await db.blogPost.update({
      where: { id: req.params.id },
      data: { views: { increment: 1 } },
    })

    res.json({ message: "View count incremented" })
    //
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const likePost = async (req, res) => {
  try {
    await db.blogPost.update({
      where: { id: req.params.id },
      data: { likes: { increment: 1 } },
    })

    res.json({ message: "Like added" })
    //
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}

export const getTopPosts = async (req, res) => {
  try {
    // Top performing posts
    const posts = await db.blogPost.findMany({
      where: { isDraft: false },
      orderBy: [{ views: "desc" }, { likes: "desc" }],
      take: 5,
    })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message })
  }
}
