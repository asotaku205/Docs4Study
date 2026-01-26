import express from 'express';
import { upload } from '../config/multer.js';
import { uploadSingle, uploadMultiple } from '../controller/Upload.controller.js';
import { verifyToken } from '../middleware/Auth.middleware.js';

const router = express.Router();

// Upload single image
router.post('/single', verifyToken, upload.single('image'), uploadSingle);

// Upload multiple images (max 10)
router.post('/multiple', verifyToken, upload.array('images', 10), uploadMultiple);

export default router;
