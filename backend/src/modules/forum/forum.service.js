import prisma from '../../database/prisma.js';

export class ForumService {
  async getPosts({ page = 1, limit = 10, category, search, tag }) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const [total, posts] = await Promise.all([
      prisma.forumPost.count({ where }),
      prisma.forumPost.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  fullName: true,
                  major: true,
                  cohort: true,
                },
              },
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async createPost(userId, { title, content, category, tags = [] }) {
    return prisma.forumPost.create({
      data: {
        authorId: userId,
        title: title.trim(),
        content: content.trim(),
        category: category || 'GOC_HOC_TAP',
        tags: Array.isArray(tags) ? tags : [],
      },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
              },
            },
          },
        },
      },
    });
  }

  async getPostDetail(postId) {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
                major: true,
              },
            },
          },
        },
        comments: {
          where: { parentId: null },
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: {
                id: true,
                profile: {
                  select: {
                    fullName: true,
                    cohort: true,
                  },
                },
              },
            },
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                author: {
                  select: {
                    id: true,
                    profile: {
                      select: {
                        fullName: true,
                        cohort: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!post) {
      const error = new Error('Không tìm thấy bài viết');
      error.statusCode = 404;
      throw error;
    }

    await prisma.forumPost.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    });

    return post;
  }

  async addComment(userId, postId, { content, parentId }) {
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) {
      const error = new Error('Bài viết không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    if (parentId) {
      const parent = await prisma.forumComment.findUnique({ where: { id: parentId } });
      if (!parent || parent.postId !== postId) {
        const error = new Error('Bình luận cha không hợp lệ');
        error.statusCode = 404;
        throw error;
      }
    }

    return prisma.forumComment.create({
      data: {
        postId,
        authorId: userId,
        parentId: parentId || null,
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
              },
            },
          },
        },
      },
    });
  }

  async votePost(userId, postId, type) {
    const post = await prisma.forumPost.findUnique({ where: { id: postId } });
    if (!post) {
      const error = new Error('Bài viết không tồn tại');
      error.statusCode = 404;
      throw error;
    }

    await prisma.postVote.upsert({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
      update: { type },
      create: {
        postId,
        userId,
        type,
      },
    });

    const [upvotes, downvotes] = await Promise.all([
      prisma.postVote.count({ where: { postId, type: 'UPVOTE' } }),
      prisma.postVote.count({ where: { postId, type: 'DOWNVOTE' } }),
    ]);

    const updated = await prisma.forumPost.update({
      where: { id: postId },
      data: {
        upvotesCount: upvotes,
        downvotesCount: downvotes,
      },
    });

    return {
      postId,
      upvotesCount: updated.upvotesCount,
      downvotesCount: updated.downvotesCount,
    };
  }
}

export default new ForumService();
