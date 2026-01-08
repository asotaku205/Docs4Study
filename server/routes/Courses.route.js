import express from "express";
import coursesController from "../controller/Courses.controller.js";

const router = express.Router();

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getCourseById);
router.post("/", coursesController.createCourse);
router.put("/:id", coursesController.updateCourse);
router.delete("/:id", coursesController.deleteCourse);
router.post("/:id/restore", coursesController.restoreCourse);

export default router;
