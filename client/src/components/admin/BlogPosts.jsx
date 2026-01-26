import { useState, useEffect, useRef } from "react";
import { blogPostsAPI, categoriesAPI } from "../../services/api";
import { uploadService } from "../../services/uploadService";
import TipTapEditor from "../ui/TipTapEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [activePost, setActivePost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

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

  if (viewMode === "add") {
    content = (
      <AddPostForm
        categories={categories}
        onAdd={handleAdd}
        onCancel={() => setViewMode("list")}
      />
    );
  } else if (viewMode === "edit") {
    content = (
      <EditPostForm
        post={activePost}
        categories={categories}
        onChange={setActivePost}
        onSave={handleSave}
        onCancel={() => setViewMode("detail")}
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
      />
    );
  } else {
    content = (
      <PostList
        posts={posts}
        loading={loading}
        onAdd={() => setViewMode("add")}
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
              Delete blog post?
            </h3>
            <p className="text-sm mb-4">
              Delete <strong>{postToDelete.title}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setPostToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PostList({ posts, loading, onView, onEdit, onDelete, onAdd, onRestore, onPublish }) {
  const pendingPosts = posts.filter(p => p.status === 'pending' && !p.isDeleted);
  const otherPosts = posts.filter(p => p.status !== 'pending' || p.isDeleted);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts ({posts.length})</h1>
        <button
          onClick={onAdd}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          New Post
        </button>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : (
        <>
          {pendingPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-orange-600">Pending Approval ({pendingPosts.length})</h2>
              <div className="overflow-x-auto bg-orange-50 rounded-lg border border-orange-200">
                <table className="w-full">
                  <thead className="bg-orange-100 border-b border-orange-200">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold">Title</th>
                      <th className="p-4 text-left text-sm font-semibold">Author</th>
                      <th className="p-4 text-left text-sm font-semibold">Category</th>
                      <th className="p-4 text-left text-sm font-semibold">Status</th>
                      <th className="p-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPosts.map((p) => (
                      <tr key={p._id} className="hover:bg-orange-100">
                        <td className="p-4 border-t border-orange-200">{p.title}</td>
                        <td className="p-4 border-t border-orange-200">{p.author?.fullName || p.author}</td>
                        <td className="p-4 border-t border-orange-200">{p.category?.name || p.category}</td>
                        <td className="p-4 border-t border-orange-200">
                          <span className="px-2 py-1 rounded text-xs bg-orange-500 text-white">
                            Pending
                          </span>
                        </td>
                        <td className="p-4 border-t border-orange-200">
                          <div className="flex gap-2">
                            <button onClick={() => onView(p)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">View</button>
                            <button onClick={() => onPublish(p)} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                            <button onClick={() => onDelete(p)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="overflow-x-auto bg-white rounded-lg border">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">Title</th>
                  <th className="p-4 text-left text-sm font-semibold">Author</th>
                  <th className="p-4 text-left text-sm font-semibold">Category</th>
                  <th className="p-4 text-left text-sm font-semibold">Status</th>
                  <th className="p-4 text-left text-sm font-semibold">Views</th>
                  <th className="p-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {otherPosts.map((p) => (
                  <tr key={p._id} className={p.isDeleted ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                    <td className="p-4 border-t">{p.title}</td>
                    <td className="p-4 border-t">{p.author?.fullName || p.author}</td>
                    <td className="p-4 border-t">{p.category?.name || p.category}</td>
                    <td className="p-4 border-t">
                      <span className={`px-2 py-1 rounded text-xs ${
                        p.isDeleted ? 'bg-gray-200' :
                        p.status === 'published' ? 'bg-gray-900 text-white' : 'bg-gray-300'
                      }`}>
                        {p.isDeleted ? 'Deleted' : p.status}
                      </span>
                    </td>
                    <td className="p-4 border-t">{p.views}</td>
                    <td className="p-4 border-t">
                      <div className="flex gap-2">
                        {p.isDeleted ? (
                          <button onClick={() => onRestore(p)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Restore</button>
                        ) : (
                          <>
                            <button onClick={() => onView(p)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">View</button>
                            <button onClick={() => onEdit(p)} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Edit</button>
                            {p.status === 'draft' && (
                              <button onClick={() => onPublish(p)} className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800">Publish</button>
                            )}
                            <button onClick={() => onDelete(p)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function PostDetail({ post, onBack, onEdit, onDelete, onPublish }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">← Back</button>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        Author: {post.author?.fullName || post.author} · Status: {post.status} · Category: {post.category?.name || post.category}
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
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img.url}`}
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
        Views: {post.views} | Likes: {post.likes || 0} | Comments: {post.comments?.length || 0}
      </div>

      <div className="flex gap-3">
        <button onClick={onEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">Edit</button>
        {post.status === 'draft' && (
          <button onClick={() => onPublish(post)} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">Publish</button>
        )}
        <button onClick={onDelete} className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50">Delete</button>
      </div>
    </div>
  );
}

function EditPostForm({ post, categories, onChange, onSave, onCancel }) {
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
      <button onClick={onCancel} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">← Back</button>
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>

      <Input label="Title" value={post.title} onChange={(v) => onChange({ ...post, title: v })} />
      <Input label="Description" value={post.description || ''} onChange={(v) => onChange({ ...post, description: v })} />
      
      <div className="mb-3">
        <label className="text-sm text-gray-500">Category</label>
        <select
          value={post.category?._id || post.category}
          onChange={(e) => onChange({ ...post, category: e.target.value })}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500">Status</label>
        <select
          value={post.status}
          onChange={(e) => onChange({ ...post, status: e.target.value })}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">Images</label>
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
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img.url}`}
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
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">Content</label>
        <TipTapEditor
          value={post.content}
          onChange={(html) => onChange({ ...post, content: html })}
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

function AddPostForm({ categories, onAdd, onCancel }) {
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
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Add New Post</h2>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Description" value={description} onChange={setDescription} />
      
      <div className="mb-3">
        <label className="text-sm text-gray-500">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">Images</label>
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
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img 
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img.url}`}
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
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-500 block mb-2">Content</label>
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
          Add
        </button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
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
