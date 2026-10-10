import authService from './auth.service.js';

export class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, fullName, studentId, cohort, major } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Vui lòng cung cấp đầy đủ email, mật khẩu và họ tên',
        });
      }
      const result = await authService.register({ email, password, fullName, studentId, cohort, major });
      res.status(201).json({
        statusCode: 201,
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Vui lòng nhập email và mật khẩu',
        });
      }
      const result = await authService.login({ email, password });
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          statusCode: 400,
          success: false,
          message: 'Thiếu refreshToken',
        });
      }
      const tokens = await authService.refreshToken(refreshToken);
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await authService.logout(req.user.id);
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
