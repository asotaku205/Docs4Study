import express from "express";
import adminDocumentController from "../controller/adminDocument.controller.js";

const router = express.Router();

router.get("/documents", (req, res) => adminDocumentController.getAllDocuments(req, res));
router.get("/documents/:id", (req, res) => adminDocumentController.getDocumentById(req, res));
router.post("/documents", (req, res) => adminDocumentController.createDocument(req, res));
router.put("/documents/:id", (req, res) => adminDocumentController.updateDocument(req, res));
router.delete("/documents/:id", (req, res) => adminDocumentController.deleteDocument(req, res));
router.post("/documents/:id/restore", (req, res) => adminDocumentController.restoreDocument(req, res));

export default router;
