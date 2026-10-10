import drlService from './drl.service.js';

export class DrlController {
  async getRecords(req, res, next) {
    try {
      const result = await drlService.getRecords(req.user.id, req.query.semesterId);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createRecord(req, res, next) {
    try {
      const result = await drlService.createRecord(req.user.id, req.body);
      res.status(201).json({ statusCode: 201, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async deleteRecord(req, res, next) {
    try {
      const result = await drlService.deleteRecord(req.user.id, req.params.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getSummary(req, res, next) {
    try {
      const result = await drlService.getDrlSummary(req.user.id, req.query.semesterId);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default new DrlController();
