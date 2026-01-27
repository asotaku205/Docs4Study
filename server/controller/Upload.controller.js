import { upload, uploadDocument } from '../config/multer.js';

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

// Upload document file
export const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file type from extension
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    let fileType = 'other';
    if (ext === 'pdf') fileType = 'pdf';
    else if (ext === 'doc') fileType = 'doc';
    else if (ext === 'docx') fileType = 'docx';
    else if (ext === 'ppt') fileType = 'ppt';
    else if (ext === 'pptx') fileType = 'pptx';
    else if (ext === 'txt') fileType = 'txt';

    // Format file size
    const fileSizeInBytes = req.file.size;
    let fileSize = '';
    if (fileSizeInBytes < 1024) {
      fileSize = fileSizeInBytes + ' B';
    } else if (fileSizeInBytes < 1024 * 1024) {
      fileSize = (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
      fileSize = (fileSizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ 
      message: 'Document uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: fileType,
      fileSize: fileSize
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading document', error: error.message });
  }
};
