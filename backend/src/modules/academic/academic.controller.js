import academicService from './academic.service.js';

export class AcademicController {
  async getSummary(req, res, next) {
    try {
      const result = await academicService.getAcademicSummary(req.user.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // Semesters
  async getSemesters(req, res, next) {
    try {
      const result = await academicService.getSemesters(req.user.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createSemester(req, res, next) {
    try {
      const result = await academicService.createSemester(req.user.id, req.body);
      res.status(201).json({ statusCode: 201, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async deleteSemester(req, res, next) {
    try {
      const result = await academicService.deleteSemester(req.user.id, req.params.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  // Courses
  async getCourses(req, res, next) {
    try {
      const result = await academicService.getCourses(req.user.id, req.query.semesterId);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async createCourse(req, res, next) {
    try {
      const result = await academicService.createCourse(req.user.id, req.body);
      res.status(201).json({ statusCode: 201, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateCourseGrades(req, res, next) {
    try {
      const result = await academicService.updateCourseGrades(req.user.id, req.params.id, req.body);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async deleteCourse(req, res, next) {
    try {
      const result = await academicService.deleteCourse(req.user.id, req.params.id);
      res.status(200).json({ statusCode: 200, success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

export default new AcademicController();
