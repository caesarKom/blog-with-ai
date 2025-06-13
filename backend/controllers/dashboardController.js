import db from "../lib/db.js"

// @desc    Dashboard summary
// @route   POST /api/dashboard-summary
// @access  Private (Admin only)
export const getDashboardSummary = async (req, res) => {
  try {
    // Basic counts
    const [totalPosts, drafts, published, totalComments, aiGenerated] =
      await Promise.all([
        db.blogPost.count(),
        db.blogPost.count({ where: { isDraft: true } }),
        db.blogPost.count({ where: { isDraft: false } }),
        db.comment.count(),
        db.blogPost.count({ where: { generatedByAI: true } }),
      ])

    const totalViewsResult = await db.blogPost.aggregate({
      _sum: {
        views: true,
      },
    })

    const totalLikesResult = await db.blogPost.aggregate({
      _sum: {
        likes: true,
      },
    })

    const totalViews = totalViewsResult._sum.views || 0
    const totalLikes = totalLikesResult._sum.likes || 0

    // Top performing posts
    const topPosts = await db.blogPost.findMany({
      where: { isDraft: false },
      select: {
        title: true,
        coverImageUrl: true,
        views: true,
        likes: true,
      },
      orderBy: [{ views: "desc" }, { likes: "desc" }],
      take: 5,
    })

    // Recent comments
    const recentComments = await db.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        author: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
        post: {
          select: {
            title: true,
            coverImageUrl: true,
          },
        },
      },
    })

    // Tag usage - get all posts with tags first, then process in JavaScript
    const postsWithTags = await db.blogPost.findMany({
      select: { tags: true },
      where: { tags: { isEmpty: false } },
    })

    const tagUsage = {}
    postsWithTags.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => {
          tagUsage[tag] = (tagUsage[tag] || 0) + 1
        })
      }
    })

    const tagUsageArray = Object.entries(tagUsage)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)

    res.json({
      stats: {
        totalPosts,
        drafts,
        published,
        totalViews,
        totalLikes,
        totalComments,
        aiGenerated,
      },
      topPosts,
      recentComments,
      tagUsage: tagUsageArray,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    })
  }
}
