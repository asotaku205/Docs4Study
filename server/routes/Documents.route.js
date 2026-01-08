import express from "express";
import documentsController from "../controller/Documents.controller.js";

const router = express.Router();

router.get("/", documentsController.getAllDocuments);
router.get("/:id", documentsController.getDocumentById);
router.post("/", documentsController.createDocument);
router.put("/:id", documentsController.updateDocument);
router.delete("/:id", documentsController.deleteDocument);
router.post("/:id/restore", documentsController.restoreDocument);

export default router;
