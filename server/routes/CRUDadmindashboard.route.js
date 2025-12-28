import express from "express";
import adminBlogPostRoutes from "./adminBlogPost.route.js";
import adminCourseRoutes from "./adminCourse.route.js";
import adminDocumentRoutes from "./adminDocument.route.js";
import adminOrderRoutes from "./adminOrder.route.js";
import adminUserRoutes from "./adminUser.route.js";

const router = express.Router();

router.use("/", adminCourseRoutes);
router.use("/", adminUserRoutes);
router.use("/", adminOrderRoutes);
router.use("/", adminDocumentRoutes);
router.use("/", adminBlogPostRoutes);

export default router;
