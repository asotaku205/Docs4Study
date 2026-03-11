import express from 'express';
import { upload, uploadDocument } from '../config/multer.js';
import { uploadSingle, uploadMultiple, uploadDocumentFile } from '../controller/Upload.controller.js';
import { protectedRoute } from '../middleware/Auth.middleware.js';

const router = express.Router();

// Tải lên một ảnh
router.post('/single', protectedRoute, upload.single('image'), uploadSingle);

// Tải lên nhiều ảnh (tối đa 10)
router.post('/multiple', protectedRoute, upload.array('images', 10), uploadMultiple);

// Tải lên file tài liệu
router.post('/document', protectedRoute, uploadDocument.single('document'), uploadDocumentFile);

export default router;
