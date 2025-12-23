import { useState } from "react";

export default function Documents() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Calculus I Cheatsheet",
      category: "Math",
      views: 1205,
      downloads: 340,
      fileSize: "2.4 MB",
    },
    {
      id: 2,
      title: "Intro to Psychology",
      category: "Science",
      views: 850,
      downloads: 120,
      fileSize: "1.8 MB",
    },
    {
      id: 3,
      title: "Organic Chemistry",
      category: "Science",
      views: 2100,
      downloads: 890,
      fileSize: "3.2 MB",
    },
  ]);

  const [viewMode, setViewMode] = useState("list");
  const [activeDoc, setActiveDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  const handleAddDocument = (newDoc) => {
    setDocuments((prev) => [
      ...prev,
      {
        ...newDoc,
        id: Date.now(),
        views: 0,
        downloads: 0,
        fileSize: "0 MB",
      },
    ]);
    setViewMode("list");
  };

  const handleSave = () => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === activeDoc.id ? activeDoc : doc
      )
    );
    setViewMode("detail");
  };

  const handleDelete = () => {
    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== docToDelete.id)
    );
    setDocToDelete(null);
    setActiveDoc(null);
    setViewMode("list");
  };

  let content = null;

  if (viewMode === "add") {
    content = (
      <AddDocumentForm
        onCancel={() => setViewMode("list")}
        onAdd={handleAddDocument}
      />
    );
  }

  else if (viewMode === "edit") {
    content = (
      <EditDocumentForm
        doc={activeDoc}
        onChange={setActiveDoc}
        onSave={handleSave}
        onCancel={() => setViewMode("detail")}
      />
    );
  }

  else if (viewMode === "detail") {
    content = (
      <DocumentDetail
        doc={activeDoc}
        onBack={() => setViewMode("list")}
        onEdit={() => setViewMode("edit")}
        onDelete={() => setDocToDelete(activeDoc)}
      />
    );
  }

  else {
    content = (
      <DocumentList
        documents={documents}
        onView={(doc) => {
          setActiveDoc(doc);
          setViewMode("detail");
        }}
        onEdit={(doc) => {
          setActiveDoc(doc);
          setViewMode("edit");
        }}
        onDelete={(doc) => setDocToDelete(doc)}
        onAdd={() => setViewMode("add")}
      />
    );
  }

  return (
    <>
      {content}

      {docToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-2">
              Delete document?
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete
              <strong> {docToDelete.title}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded"
                onClick={() => setDocToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
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

function DocumentList({ documents, onView, onEdit, onDelete, onAdd }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex justify-between">
        Manage Documents ({documents.length})
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={onAdd}
        >
          + Add Document
        </button>
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border text-left">Category</th>
            <th className="p-3 border text-left">Views</th>
            <th className="p-3 border text-left">Downloads</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td className="p-3 border">{doc.title}</td>
              <td className="p-3 border">{doc.category}</td>
              <td className="p-3 border">{doc.views}</td>
              <td className="p-3 border">{doc.downloads}</td>
              <td className="p-3 border">
                <button onClick={() => onView(doc)} className="mr-2 text-blue-600">View</button>
                <button onClick={() => onEdit(doc)} className="mr-2 text-green-600">Edit</button>
                <button onClick={() => onDelete(doc)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentDetail({ doc, onBack, onEdit, onDelete }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">{doc.title}</h2>
      <p>Category: {doc.category}</p>
      <p>Views: {doc.views}</p>
      <p>Downloads: {doc.downloads}</p>

      <div className="mt-4 flex gap-3">
        <button className="bg-black text-white px-4 py-2 rounded" onClick={onEdit}>Edit</button>
        <button className="border border-red-500 text-red-600 px-4 py-2 rounded" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

function EditDocumentForm({ doc, onChange, onSave, onCancel }) {
  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Edit Document</h2>

      <Input label="Title" value={doc.title} onChange={(v) => onChange({ ...doc, title: v })} />
      <Input label="Category" value={doc.category} onChange={(v) => onChange({ ...doc, category: v })} />
      <Input label="Views" type="number" value={doc.views} onChange={(v) => onChange({ ...doc, views: Number(v) })} />
      <Input label="Downloads" type="number" value={doc.downloads} onChange={(v) => onChange({ ...doc, downloads: Number(v) })} />

      <div className="mt-4 flex gap-3">
        <button className="bg-black text-white px-4 py-2 rounded" onClick={onSave}>Save</button>
        <button className="border px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function AddDocumentForm({ onCancel, onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Add New Document</h2>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Category" value={category} onChange={setCategory} />

      <div className="mt-4 flex gap-3">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => onAdd({ title, category })}
        >
          Add
        </button>
        <button className="border px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-1"
      />
    </div>
  );
}
