import syncService from './sync.service.js';

export class SyncController {
  async pushLocal(req, res, next) {
    try {
      const result = await syncService.pushLocal(req.user.id, req.body);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async pullCloud(req, res, next) {
    try {
      const result = await syncService.pullCloud(req.user.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default new SyncController();
