import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { Link, useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { blogService } from "../services/blogService";
import { categoryService } from "../services/categoryService";
import { uploadService } from "../services/uploadService";
import TipTapEditor from "../components/ui/TipTapEditor";
import { useLanguage } from "../i18n/LanguageContext";
import { resolveFileUrl } from "../utils/url";

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
  const { t } = useLanguage();

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
      
      // Đặt ảnh đầu tiên làm ảnh nổi bật nếu chưa đặt
      if (!formData.image && newImages.length > 0) {
        setFormData({
          ...formData,
          image: newImages[0].url
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      const errorMsg = error.response?.data?.message || error.message || t.createBlogPost.uploadFailed;
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert(t.createBlogPost.loginToUpload);
        setLocation("/auth");
      } else {
        alert(`${t.createBlogPost.uploadFailed}: ${errorMsg}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // Nếu xóa ảnh nổi bật, đặt ảnh nổi bật mới
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
      alert(t.createBlogPost.fillRequired);
      return;
    }

    try {
      setSubmitting(true);
      
      // Chuẩn bị dữ liệu bài viết với mảng ảnh
      const postData = {
        ...formData,
        images: images.map((img, index) => ({
          url: img.url,
          caption: img.caption || "",
          order: index
        }))
      };
      
      const response = await blogService.createBlog(postData);
      alert(t.createBlogPost.success);
      setLocation("/blog");
    } catch (error) {
      console.error("Error creating post:", error);
      const errorMsg = error.response?.data?.message || error.message || t.createBlogPost.createFailed;
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert(t.createBlogPost.loginToCreate);
        setLocation("/auth");
      } else {
        alert(`${t.createBlogPost.createFailed}: ${errorMsg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2">{t.createBlogPost.title}</h1>
            <p className="text-muted-foreground">{t.createBlogPost.subtitle}</p>
          </div>
          
          <div className="rounded-lg bg-card text-card-foreground shadow-lg border border-border">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
              <div className="font-semibold tracking-tight text-xl">{t.createBlogPost.cardTitle}</div>
              <div className="text-sm text-muted-foreground">{t.createBlogPost.cardSubtitle}</div>
            </div>
            
            <div className="p-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-semibold block mb-2">{t.createBlogPost.postTitle} *</label>
                  <input 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                    placeholder={t.createBlogPost.postTitlePlaceholder} 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-semibold block mb-2">{t.createBlogPost.description}</label>
                  <input 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-base" 
                    placeholder={t.createBlogPost.descriptionPlaceholder} 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-2">{t.createBlogPost.category}</label>
                    <select 
                      className="w-full border border-input rounded-md px-3 py-2 text-base bg-background"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">{t.createBlogPost.selectCategory}</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="text-sm font-semibold block mb-2">{t.createBlogPost.images}</label>
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
                      {uploading ? t.createBlogPost.uploadingImages : t.createBlogPost.uploadImages}
                    </button>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t.createBlogPost.uploadMultiple}
                    </p>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={resolveFileUrl(img.url)}
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
                                {t.createBlogPost.setFeatured}
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
                              {t.createBlogPost.featured}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-semibold block mb-2">{t.createBlogPost.postContent} *</label>
                  <TipTapEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder={t.createBlogPost.contentPlaceholder}
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">{t.createBlogPost.reviewNotice}</p>
                    <p>{t.createBlogPost.reviewDescription}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-10 rounded-md px-8 flex-1" 
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? t.createBlogPost.submitting : t.createBlogPost.submitPost}
                  </button>
                  <Link href="/blog">
                    <button 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-10 rounded-md px-8" 
                      type="button"
                    >
                      {t.createBlogPost.back}
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