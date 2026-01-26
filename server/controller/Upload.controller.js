import { upload } from '../config/multer.js';

// Upload single image
export const uploadSingle = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

// Upload multiple images
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));

    res.status(200).json({ 
      message: 'Files uploaded successfully',
      files: fileUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
};
