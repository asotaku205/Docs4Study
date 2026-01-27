import { useState, useRef } from "react";
import { uploadService } from "../../services/uploadService";
import TipTapEditor from "../ui/TipTapEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function DocumentForm({ 
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  isAdmin = false
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category?._id || initialData?.category || "",
    status: initialData?.status || "pending",
    content: initialData?.content || "",
    fileUrl: initialData?.fileUrl || "",
    fileType: initialData?.fileType || "",
    fileSize: initialData?.fileSize || ""
  });
  
  const [uploadedFile, setUploadedFile] = useState(
    initialData?.fileUrl ? {
      url: initialData.fileUrl,
      type: initialData.fileType,
      size: initialData.fileSize,
      name: initialData.fileType?.toUpperCase() + " File"
    } : null
  );
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid document file (PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP, RAR)");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadService.uploadDocument(file);
      
      setUploadedFile({
        name: file.name,
        url: result.url,
        type: result.fileType,
        size: result.fileSize
      });
      
      handleChange('fileUrl', result.url);
      handleChange('fileType', result.fileType);
      handleChange('fileSize', result.fileSize);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    handleChange('fileUrl', '');
    handleChange('fileType', '');
    handleChange('fileSize', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.fileUrl) {
      alert("Title, content and file are required");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="text-sm font-semibold block mb-2">Document Title *</label>
        <input 
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-base" 
          placeholder="Enter document title..." 
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="text-sm font-semibold block mb-2">Description</label>
        <input 
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-base" 
          placeholder="Short description..." 
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      
      {/* Category & Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold block mb-2">Category</label>
          <select 
            className="w-full border border-input rounded-md px-3 py-2 text-base bg-background"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Select category...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {isAdmin && (
          <div>
            <label className="text-sm font-semibold block mb-2">Status</label>
            <select 
              className="w-full border border-input rounded-md px-3 py-2 text-base bg-background"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </select>
          </div>
        )}
      </div>

      {/* File Upload */}
      <div>
        <label className="text-sm font-semibold block mb-2">Document File *</label>
        <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
            onChange={handleFileUpload}
            className="hidden"
          />
          {!uploadedFile ? (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faFileArrowUp} />
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
              <p className="text-sm text-muted-foreground mt-2">
                Supported formats: PDF, DOC, DOCX, PPT, PPTX, TXT, ZIP, RAR (Max 50MB)
              </p>
            </>
          ) : (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {uploadedFile.type?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{uploadedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div>
        <label className="text-sm font-semibold block mb-2">Document Description *</label>
        <TipTapEditor
          value={formData.content}
          onChange={(html) => handleChange('content', html)}
          placeholder="Write a detailed description of your document..."
        />
      </div>
      
      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button 
          type="submit" 
          disabled={submitting || uploading || !formData.fileUrl}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground border border-primary-border shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          {submitting ? "Submitting..." : submitLabel}
        </button>
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
