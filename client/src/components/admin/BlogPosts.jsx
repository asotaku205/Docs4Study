import { useState } from "react";

export default function BlogPosts() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Mastering React in 2025",
      author: "Sarah Jen",
      status: "Published",
      views: 342,
      content: "React tips and patterns for 2025...",
    },
    {
      id: 2,
      title: "Minimalist UI Design",
      author: "Alex Design",
      status: "Draft",
      views: 156,
      content: "How to design clean interfaces...",
    },
  ]);

  const [viewMode, setViewMode] = useState("list");
  const [activePost, setActivePost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  const handleAdd = (post) => {
    setPosts((prev) => [
      ...prev,
      { ...post, id: Date.now(), views: 0 },
    ]);
    setViewMode("list");
  };

  const handleSave = () => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activePost.id ? activePost : p
      )
    );
    setViewMode("detail");
  };

  const handleDelete = () => {
    setPosts((prev) =>
      prev.filter((p) => p.id !== postToDelete.id)
    );
    setPostToDelete(null);
    setActivePost(null);
    setViewMode("list");
  };

  let content = null;

  if (viewMode === "add") {
    content = (
      <AddPostForm
        onAdd={handleAdd}
        onCancel={() => setViewMode("list")}
      />
    );
  } else if (viewMode === "edit") {
    content = (
      <EditPostForm
        post={activePost}
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
      />
    );
  } else {
    content = (
      <PostList
        posts={posts}
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
      />
    );
  }

  return (
    <>
      {content}

      {postToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
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

function PostList({ posts, onView, onEdit, onDelete, onAdd }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex justify-between">
        Blog Posts ({posts.length})
        <button
          onClick={onAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Post
        </button>
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border text-left">Author</th>
            <th className="p-3 border text-left">Status</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td className="p-3 border">{p.title}</td>
              <td className="p-3 border">{p.author}</td>
              <td className="p-3 border">{p.status}</td>
              <td className="p-3 border">
                <button onClick={() => onView(p)} className="mr-2 text-blue-600">View</button>
                <button onClick={() => onEdit(p)} className="mr-2 text-green-600">Edit</button>
                <button onClick={() => onDelete(p)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PostDetail({ post, onBack, onEdit, onDelete }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        Author: {post.author} · Status: {post.status}
      </p>
      <p className="mb-4">{post.content}</p>

      <div className="flex gap-3">
        <button onClick={onEdit} className="bg-black text-white px-4 py-2 rounded">Edit</button>
        <button onClick={onDelete} className="border border-red-500 text-red-600 px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
}

function EditPostForm({ post, onChange, onSave, onCancel }) {
  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>

      <Input label="Title" value={post.title} onChange={(v) => onChange({ ...post, title: v })} />
      <Input label="Author" value={post.author} onChange={(v) => onChange({ ...post, author: v })} />
      <Input label="Status" value={post.status} onChange={(v) => onChange({ ...post, status: v })} />

      <textarea
        className="w-full border rounded p-3 mt-2"
        rows={6}
        value={post.content}
        onChange={(e) => onChange({ ...post, content: e.target.value })}
      />

      <div className="mt-4 flex gap-3">
        <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

function AddPostForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");

  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Add New Post</h2>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Author" value={author} onChange={setAuthor} />
      <Input label="Status" value={status} onChange={setStatus} />

      <textarea
        className="w-full border rounded p-3 mt-2"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="mt-4 flex gap-3">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => onAdd({ title, author, status, content })}
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
