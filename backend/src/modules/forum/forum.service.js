import prisma from '../../database/prisma.js';

export class ForumService {
  async getPosts({ page = 1, limit = 10, category, search, tag, sortBy = 'newest' }, currentUserId = null) {
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category && category !== 'ALL') {
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

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = [{ upvotesCount: 'desc' }, { createdAt: 'desc' }];
    } else if (sortBy === 'views') {
      orderBy = [{ viewsCount: 'desc' }, { createdAt: 'desc' }];
    }

    const [total, rawPosts] = await Promise.all([
      prisma.forumPost.count({ where }),
      prisma.forumPost.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              email: true,
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
          ...(currentUserId
            ? {
                votes: {
                  where: { userId: currentUserId },
                  select: { type: true },
                },
              }
            : {}),
        },
      }),
    ]);

    const posts = rawPosts.map((post) => {
      const userVote = post.votes && post.votes.length > 0 ? post.votes[0].type : null;
      const { votes, ...rest } = post;
      return {
        ...rest,
        userVote,
      };
    });

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
            email: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
                major: true,
              },
            },
          },
        },
      },
    });
  }

  async getPostDetail(postId, currentUserId = null) {
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
                major: true,
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

    // Tăng lượt xem
    await prisma.forumPost.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    });

    // Lấy tất cả comment của bài viết để dựng cây phân cấp (Nested Tree)
    const allComments = await prisma.forumComment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
                major: true,
              },
            },
          },
        },
      },
    });

    const commentMap = new Map();
    allComments.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] });
    });

    const rootComments = [];
    allComments.forEach((c) => {
      const item = commentMap.get(c.id);
      if (c.parentId && commentMap.has(c.parentId)) {
        commentMap.get(c.parentId).replies.push(item);
      } else {
        rootComments.push(item);
      }
    });

    let userVote = null;
    if (currentUserId) {
      const vote = await prisma.postVote.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: currentUserId,
          },
        },
      });
      userVote = vote?.type || null;
    }

    return {
      ...post,
      viewsCount: post.viewsCount + 1,
      comments: rootComments,
      userVote,
    };
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
            email: true,
            profile: {
              select: {
                fullName: true,
                cohort: true,
                major: true,
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

    const existingVote = await prisma.postVote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    let userVote = null;
    if (existingVote && existingVote.type === type) {
      // Nhấn lại cùng loại vote -> Huỷ vote (Toggle)
      await prisma.postVote.delete({
        where: { id: existingVote.id },
      });
      userVote = null;
    } else {
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
      userVote = type;
    }

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
      userVote,
    };
  }
}

export default new ForumService();
