import usersService from './users.service.js';

export class UsersController {
  async getMyProfile(req, res, next) {
    try {
      const result = await usersService.getProfile(req.user.id);
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMyProfile(req, res, next) {
    try {
      const result = await usersService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getFaculties(req, res, next) {
    try {
      const result = await usersService.listFaculties();
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

export default new UsersController();
