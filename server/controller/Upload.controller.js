import { uploadToCloudinary } from '../config/multer.js';

// Tải lên một ảnh
export const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'docs4study/images',
      transformation: [{ quality: 'auto' }],
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      filename: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Tải lên nhiều ảnh
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const results = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, {
          folder: 'docs4study/images',
          transformation: [{ quality: 'auto' }],
        })
      )
    );

    res.status(200).json({
      message: 'Files uploaded successfully',
      files: results.map((r) => ({ url: r.secure_url, filename: r.public_id })),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};

// Tải lên file tài liệu
export const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const fileType = ['pdf','doc','docx','ppt','pptx','txt'].includes(ext) ? ext : 'other';

    const fileSizeInBytes = req.file.size;
    let fileSize;
    if (fileSizeInBytes < 1024) fileSize = fileSizeInBytes + ' B';
    else if (fileSizeInBytes < 1024 * 1024) fileSize = (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    else fileSize = (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'docs4study/documents',
      resource_type: 'raw',
      public_id: `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`,
      format: ext,
    });

    res.status(200).json({
      message: 'Document uploaded successfully',
      url: result.secure_url,
      filename: result.public_id,
      originalName: req.file.originalname,
      fileType,
      fileSize,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};

