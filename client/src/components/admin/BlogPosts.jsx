import { useState, useEffect, useRef } from "react";
import { blogPostsAPI, categoriesAPI } from "../../services/api";
import { uploadService } from "../../services/uploadService";
import TipTapEditor from "../ui/TipTapEditor";
import Pagination from "../shared/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveFileUrl } from "@/utils/url";

export default function BlogPosts() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("all"); // tất cả, chờ duyệt, đã xuất bản, đã xóa
  const [activePost, setActivePost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi chuyển tab
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ isActive: true });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogPostsAPI.getAll({ includeDeleted: true });
      setPosts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (post) => {
    try {
      await blogPostsAPI.create(post);
      await fetchPosts();
      setViewMode("list");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  const handleSave = async () => {
    try {
      await blogPostsAPI.update(activePost._id, activePost);
      await fetchPosts();
      setViewMode("detail");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const handleDelete = async () => {
    try {
      await blogPostsAPI.delete(postToDelete._id);
      await fetchPosts();
      setPostToDelete(null);
      setActivePost(null);
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleRestore = async (post) => {
    try {
      await blogPostsAPI.restore(post._id);
      await fetchPosts();
    } catch (error) {
      console.error("Error restoring post:", error);
      alert("Failed to restore post");
    }
  };

  const handlePublish = async (post) => {
    try {
      await blogPostsAPI.update(post._id, { 
        status: 'published',
        publishedAt: new Date()
      });
      await fetchPosts();
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post");
    }
  };

  let content = null;

  if (viewMode === "edit") {
    content = (
      <EditPostForm
        post={activePost}
        categories={categories}
        onChange={setActivePost}
        onSave={handleSave}
        onCancel={() => setViewMode("detail")}
        t={t}
      />
    );
  } else if (viewMode === "detail") {
    content = (
      <PostDetail
        post={activePost}
        onBack={() => setViewMode("list")}
        onEdit={() => setViewMode("edit")}
        onDelete={() => setPostToDelete(activePost)}
        onPublish={handlePublish}
        t={t}
      />
    );
  } else if (viewMode === "add") {
    content = (
      <AddPostForm
        categories={categories}
        onAdd={handleAdd}
        onCancel={() => setViewMode("list")}
        t={t}
      />
    );
  } else {
    content = (
      <PostList
        posts={posts}
        loading={loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        onPageChange={setCurrentPage}
        onView={(p) => {
          setActivePost(p);
          setViewMode("detail");
        }}
        onEdit={(p) => {
          setActivePost(p);
          setViewMode("edit");
        }}
        onDelete={(p) => setPostToDelete(p)}
        onRestore={handleRestore}
        onPublish={handlePublish}
        onAdd={() => setViewMode("add")}
        t={t}
      />
    );
  }

  return (
    <>
      {content}

      {postToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-2">
              {t("admin.blogMgmt.deleteTitle")}
            </h3>
            <p className="text-sm mb-4">
              <strong>{postToDelete.title}</strong>
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setPostToDelete(null)}
              >
                {t("admin.blogMgmt.cancel")}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                {t("admin.blogMgmt.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PostList({ posts, loading, activeTab, onTabChange, currentPage, postsPerPage, onPageChange, onView, onEdit, onDelete, onRestore, onPublish, onAdd, t }) {
  // Lọc posts theo tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'pending':
        return posts.filter(p => p.status === 'pending' && !p.isDeleted);
      case 'published':
        return posts.filter(p => p.status === 'published' && !p.isDeleted);
      case 'deleted':
        return posts.filter(p => p.isDeleted);
      default: // 'all'
        return posts.filter(p => !p.isDeleted);
    }
  };

  const filteredPosts = getFilteredPosts();
  
  // Phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const tabs = [
    { id: 'all', label: t('admin.blogMgmt.allPosts'), count: posts.filter(p => !p.isDeleted).length },
    { id: 'pending', label: t('admin.blogMgmt.pendingApproval'), count: posts.filter(p => p.status === 'pending' && !p.isDeleted).length },
    { id: 'published', label: t('admin.blogMgmt.published'), count: posts.filter(p => p.status === 'published' && !p.isDeleted).length },
    { id: 'deleted', label: t('admin.blogMgmt.deleted'), count: posts.filter(p => p.isDeleted).length },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.blogMgmt.title')} ({filteredPosts.length})</h1>
        <button
          onClick={onAdd}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {t('admin.blogMgmt.addPost')}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <p className="text-center py-8">{t('admin.blogMgmt.loading')}</p>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('admin.blogMgmt.noPosts')}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full">
              <thead className={`border-b ${
                activeTab === 'pending' ? 'bg-orange-50' : 
                activeTab === 'deleted' ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableTitle')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableAuthor')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableCategory')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableStatus')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableDate')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.blogMgmt.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 border-t">{p.title}</td>
                    <td className="p-4 border-t">{p.author?.fullName || p.author}</td>
                    <td className="p-4 border-t">{p.category?.name || p.category}</td>
                    <td className="p-4 border-t">
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.isDeleted ? 'bg-red-100 text-red-700' :
                        p.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        p.status === 'published' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {p.isDeleted ? t('admin.blogMgmt.deleted') : p.status}
                      </span>
                    </td>
                    <td className="p-4 border-t text-sm text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-t">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onView(p)} 
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          {t('admin.blogMgmt.view')}
                        </button>
                        {!p.isDeleted && (
                          <>
                            {p.status === 'pending' && (
                              <button 
                                onClick={() => onPublish(p)} 
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                {t('admin.blogMgmt.approve')}
                              </button>
                            )}
                            <button 
                              onClick={() => onEdit(p)} 
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {t('admin.blogMgmt.edit')}
                            </button>
                            <button 
                              onClick={() => onDelete(p)} 
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              {t('admin.blogMgmt.delete')}
                            </button>
                          </>
                        )}
                        {p.isDeleted && (
                          <button 
                            onClick={() => onRestore(p)} 
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            {t('admin.blogMgmt.restore')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredPosts.length}
              itemsPerPage={postsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
}

function PostDetail({ post, onBack, onEdit, onDelete, onPublish, t }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">{t('admin.blogMgmt.back')}</button>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        {t('admin.blogMgmt.author')}: {post.author?.fullName || post.author} · {t('admin.blogMgmt.status')}: {post.status} · {t('admin.blogMgmt.tableCategory')}: {post.category?.name || post.category}
      </p>
      {post.description && (
        <p className="text-sm text-gray-600 mb-4 italic">{post.description}</p>
      )}
      
      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {post.images.map((img, index) => (
            <img 
              key={index}
              src={resolveFileUrl(img.url)}
              alt={img.caption || `Image ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      )}
      
      <div 
        className="mb-4 p-4 bg-gray-50 rounded prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="text-sm text-gray-500 mb-4">
        {t('admin.blogMgmt.views')}: {post.views} | {t('admin.blogMgmt.likes')}: {post.likes || 0} | {t('admin.blogMgmt.comments')}: {post.comments?.length || 0}
      </div>

      <div className="flex gap-3">
        <button onClick={onEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">{t('admin.blogMgmt.edit')}</button>
        {(post.status === 'draft' || post.status === 'pending') && (
          <button onClick={() => onPublish(post)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{t('admin.blogMgmt.approve')}</button>
        )}
        <button onClick={onDelete} className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50">{t('admin.blogMgmt.delete')}</button>
      </div>
    </div>
  );
}

function EditPostForm({ post, categories, onChange, onSave, onCancel, t }) {
  const [images, setImages] = useState(post.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadService.uploadSingle(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results.map((result, index) => ({
        url: result.url,
        caption: "",
        order: images.length + index
      }));
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onChange({ ...post, images: updatedImages });
      
      if (!post.image && newImages.length > 0) {
        onChange({ ...post, image: newImages[0].url, images: updatedImages });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange({ ...post, images: newImages });
    
    if (post.image === images[index].url) {
      onChange({ ...post, image: newImages.length > 0 ? newImages[0].url : "", images: newImages });
    }
  };

  return (
    <div>
      <button onClick={onCancel} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">{t('admin.blogMgmt.back')}</button>
      <h2 className="text-xl font-bold mb-4">{t('admin.blogMgmt.editPost')}</h2>

      <Input label={t('admin.blogMgmt.tableTitle')} value={post.title} onChange={(v) => onChange({ ...post, title: v })} />
      <Input label={t('admin.blogMgmt.description')} value={post.description || ''} onChange={(v) => onChange({ ...post, description: v })} />
      
      <div className="mb-3">
        <label className="text-sm text-gray-500">{t('admin.blogMgmt.tableCategory')}</label>
        <select
          value={post.category?._id || post.category}
          onChange={(e) => onChange({ ...post, category: e.target.value })}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">{t('admin.blogMgmt.selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500">{t('admin.blogMgmt.status')}</label>
        <select
          value={post.status}
          onChange={(e) => onChange({ ...post, status: e.target.value })}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="draft">{t('admin.blogMgmt.draft')}</option>
          <option value="pending">{t('admin.blogMgmt.pendingApproval')}</option>
          <option value="published">{t('admin.blogMgmt.published')}</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">{t('admin.blogMgmt.images')}</label>
        <div className="border-2 border-dashed rounded p-4">
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
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faImage} className="mr-2" />
            {uploading ? t('admin.blogMgmt.uploading') : t('admin.blogMgmt.uploadImages')}
          </button>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={resolveFileUrl(img.url)}
                  alt={`Image ${index + 1}`}
                  className={`w-full h-24 object-cover rounded ${
                    post.image === img.url ? 'ring-2 ring-blue-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </button>
                {post.image === img.url && (
                  <div className="absolute bottom-1 left-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    {t('admin.blogMgmt.featured')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">{t('admin.blogMgmt.content')}</label>
        <TipTapEditor
          value={post.content}
          onChange={(html) => onChange({ ...post, content: html })}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded">{t('admin.blogMgmt.save')}</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">{t('admin.blogMgmt.cancel')}</button>
      </div>
    </div>
  );
}

function AddPostForm({ categories, onAdd, onCancel, t: tProp }) {
  const { t: tHook } = useLanguage();
  const t = tProp || tHook;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadService.uploadSingle(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results.map((result, index) => ({
        url: result.url,
        caption: "",
        order: images.length + index
      }));
      
      setImages([...images, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }
    onAdd({ 
      title, 
      description, 
      category, 
      status, 
      content, 
      image: images.length > 0 ? images[0].url : "",
      images 
    });
  };

  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">{t('admin.blogMgmt.back')}</button>
      <h2 className="text-xl font-bold mb-4">{t('admin.blogMgmt.addPost')}</h2>

      <Input label={t('admin.blogMgmt.tableTitle')} value={title} onChange={setTitle} />
      <Input label={t('admin.blogMgmt.description')} value={description} onChange={setDescription} />
      
      <div className="mb-3">
        <label className="text-sm text-gray-500">{t('admin.blogMgmt.tableCategory')}</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">{t('admin.blogMgmt.selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500">{t('admin.blogMgmt.status')}</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="draft">{t('admin.blogMgmt.draft')}</option>
          <option value="published">{t('admin.blogMgmt.published')}</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">{t('admin.blogMgmt.images')}</label>
        <div className="border-2 border-dashed rounded p-4">
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
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faImage} className="mr-2" />
            {uploading ? t('admin.blogMgmt.uploading') : t('admin.blogMgmt.uploadImages')}
          </button>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={resolveFileUrl(img.url)}
                  alt={`Image ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-1 left-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    {t('admin.blogMgmt.featured')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">{t('admin.blogMgmt.content')}</label>
        <TipTapEditor
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          {t('admin.blogMgmt.add')}
        </button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">{t('admin.blogMgmt.cancel')}</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-1"
      />
    </div>
  );
}
