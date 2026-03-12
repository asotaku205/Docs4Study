import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lưu file vào bộ nhớ tạm, sau đó controller tự upload lên Cloudinary
const memStorage = multer.memoryStorage();

// Bộ lọc file cho ảnh
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Bộ lọc file cho tài liệu
const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-zip-compressed',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported!'), false);
  }
};

export const upload = multer({
  storage: memStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
});

export const uploadDocument = multer({
  storage: memStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Helper: upload buffer lên Cloudinary, trả về Promise
export function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

