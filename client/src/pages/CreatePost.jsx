import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { blogService } from "../services/blogService";
import { categoryService } from "../services/categoryService";
import { uploadService } from "../services/uploadService";
import TipTapEditor from "../components/ui/TipTapEditor";

const CreatePost = () => {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    description: "",
    image: ""
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories({ isActive: true });
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (html) => {
    setFormData({
      ...formData,
      content: html
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadService.uploadSingle(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results.map((result, index) => ({
        url: result.url,
        file: files[index],
        caption: ""
      }));
      
      setImages([...images, ...newImages]);
      
      // Set first image as featured image if not set
      if (!formData.image && newImages.length > 0) {
        setFormData({
          ...formData,
          image: newImages[0].url
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // If removed image was the featured image, set new featured image
    if (formData.image === images[index].url) {
      setFormData({
        ...formData,
        image: newImages.length > 0 ? newImages[0].url : ""
      });
    }
  };

  const setFeaturedImage = (url) => {
    setFormData({
      ...formData,
      image: url
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      alert("Please fill in title and content");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare post data with images array
      const postData = {
        ...formData,
        images: images.map((img, index) => ({
          url: img.url,
          caption: img.caption || "",
          order: index
        }))
      };
      
      await blogService.createBlog(postData);
      alert("Post submitted successfully! Waiting for admin approval.");
      setLocation("/blog");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please login first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Share Your Knowledge</h1>
            <p className="text-lg text-muted-foreground">Submit your post for admin review and publication</p>
          </div>
          
          <div className="rounded-xl bg-card text-card-foreground shadow border border-border">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="font-semibold tracking-tight text-2xl">Create New Post</div>
              <div className="text-sm text-muted-foreground">Fill in the information below</div>
            </div>
            
            <div className="p-6 pt-0">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold block mb-2">Post Title *</label>
                  <input 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                    placeholder="Enter title..." 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold block mb-2">Description</label>
                  <input 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                    placeholder="Short description..." 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">Category</label>
                    <select 
                      className="w-full border border-input rounded-md px-3 py-2 text-base bg-background"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="text-sm font-semibold block mb-2">Images</label>
                  <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <FontAwesomeIcon icon={faImage} />
                      {uploading ? "Uploading..." : "Upload Images"}
                    </button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload multiple images for your post
                    </p>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img.url}`}
                            alt={`Upload ${index + 1}`}
                            className={`w-full h-32 object-cover rounded-lg ${
                              formData.image === img.url ? 'ring-2 ring-primary' : ''
                            }`}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            {formData.image !== img.url && (
                              <button
                                type="button"
                                onClick={() => setFeaturedImage(img.url)}
                                className="px-2 py-1 bg-white text-black text-xs rounded"
                              >
                                Set Featured
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                            >
                              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                            </button>
                          </div>
                          {formData.image === img.url && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                              Featured
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-semibold block mb-2">Post Content *</label>
                  <TipTapEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your post content here..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Your post will be reviewed</p>
                    <p>Administrators will check the content before publishing. This may take a few hours.</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md px-8 flex-1" 
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Post"}
                  </button>
                  <Link href="/blog">
                    <button 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-10 rounded-md px-8" 
                      type="button"
                    >
                      Back
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;