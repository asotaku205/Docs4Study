import express from "express";
import adminCourseController from "../controller/adminCourse.controller.js";

const router = express.Router();

router.get("/courses", (req, res) => adminCourseController.getAllCourses(req, res));
router.get("/courses/:id", (req, res) => adminCourseController.getCourseById(req, res));
router.post("/courses", (req, res) => adminCourseController.createCourse(req, res));
router.put("/courses/:id", (req, res) => adminCourseController.updateCourse(req, res));
router.delete("/courses/:id", (req, res) => adminCourseController.deleteCourse(req, res));
router.post("/courses/:id/restore", (req, res) => adminCourseController.restoreCourse(req, res));

export default router;
