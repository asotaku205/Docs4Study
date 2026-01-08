import coursesService from "../Service/Courses.service.js";

class CoursesController {
  sendError(res, err, fallbackStatus = 500) {
    const status = err.status || fallbackStatus;
    const payload = err.payload || { error: err.message };
    return res.status(status).json(payload);
  }

  async getAllCourses(req, res) {
    try {
      const result = await coursesService.getAllCourses(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await coursesService.getCourseById(req);
      res.status(200).json(course);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async createCourse(req, res) {
    try {
      const course = await coursesService.createCourse(req);
      res.status(201).json(course);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async updateCourse(req, res) {
    try {
      const course = await coursesService.updateCourse(req);
      res.status(200).json(course);
    } catch (err) {
      this.sendError(res, err, 400);
    }
  }

  async deleteCourse(req, res) {
    try {
      const result = await coursesService.deleteCourse(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }

  async restoreCourse(req, res) {
    try {
      const result = await coursesService.restoreCourse(req);
      res.status(200).json(result);
    } catch (err) {
      this.sendError(res, err, 500);
    }
  }
}

export default new CoursesController();
