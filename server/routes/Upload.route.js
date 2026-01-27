import express from 'express';
import { upload, uploadDocument } from '../config/multer.js';
import { uploadSingle, uploadMultiple, uploadDocumentFile } from '../controller/Upload.controller.js';
import { protectedRoute } from '../middleware/Auth.middleware.js';

const router = express.Router();

// Upload single image
router.post('/single', protectedRoute, upload.single('image'), uploadSingle);

// Upload multiple images (max 10)
router.post('/multiple', protectedRoute, upload.array('images', 10), uploadMultiple);

// Upload document file
router.post('/document', protectedRoute, uploadDocument.single('document'), uploadDocumentFile);

export default router;
