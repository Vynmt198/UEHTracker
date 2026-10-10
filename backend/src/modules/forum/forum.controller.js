import forumService from './forum.service.js';

export class ForumController {
  async getPosts(req, res, next) {
    try {
      const result = await forumService.getPosts(req.query, req.user?.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createPost(req, res, next) {
    try {
      const { title, content, category, tags } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Vui lòng nhập tiêu đề và nội dung bài viết',
        });
      }
      const result = await forumService.createPost(req.user.id, { title, content, category, tags });
      res.status(201).json({ statusCode: 201, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getPostDetail(req, res, next) {
    try {
      const result = await forumService.getPostDetail(req.params.id, req.user?.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { content, parentId } = req.body;
      if (!content) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Nội dung bình luận không được để trống',
        });
      }
      const result = await forumService.addComment(req.user.id, req.params.id, { content, parentId });
      res.status(201).json({ statusCode: 201, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async votePost(req, res, next) {
    try {
      const { type } = req.body;
      if (!type || !['UPVOTE', 'DOWNVOTE'].includes(type)) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Loại vote không hợp lệ (UPVOTE hoặc DOWNVOTE)',
        });
      }
      const result = await forumService.votePost(req.user.id, req.params.id, type);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default new ForumController();
