import adminCourseService from "../service/adminCourse.service.js";

const sendError = (res, err, fallbackStatus = 500) => {
  const status = err.status || fallbackStatus;
  const payload = err.payload || { error: err.message };
  return res.status(status).json(payload);
};

class AdminCourseController {
  async getAllCourses(req, res) {
    try {
      const result = await adminCourseService.getAllCourses(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await adminCourseService.getCourseById(req);
      res.status(200).json(course);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async createCourse(req, res) {
    try {
      const course = await adminCourseService.createCourse(req);
      res.status(201).json(course);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async updateCourse(req, res) {
    try {
      const course = await adminCourseService.updateCourse(req);
      res.status(200).json(course);
    } catch (err) {
      sendError(res, err, 400);
    }
  }

  async deleteCourse(req, res) {
    try {
      const result = await adminCourseService.deleteCourse(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }

  async restoreCourse(req, res) {
    try {
      const result = await adminCourseService.restoreCourse(req);
      res.status(200).json(result);
    } catch (err) {
      sendError(res, err, 500);
    }
  }
}

export default new AdminCourseController();
