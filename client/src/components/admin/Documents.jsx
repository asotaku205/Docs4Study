import { useState, useEffect, useRef } from "react";
import { documentsAPI, categoriesAPI } from "../../services/api";
import { uploadService } from "../../services/uploadService";
import DocumentForm from "../shared/DocumentForm";
import Pagination from "../shared/Pagination";
import { useLanguage } from "@/i18n/LanguageContext";
import { resolveFileUrl } from "@/utils/url";

export default function Documents() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [activeTab, setActiveTab] = useState("all");
  const [activeDoc, setActiveDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [docsPerPage] = useState(10);

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ isActive: true });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getAll({ includeDeleted: true });
      setDocuments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (doc) => {
    try {
      await documentsAPI.create(doc);
      await fetchDocuments();
      setViewMode("list");
    } catch (error) {
      console.error("Error creating document:", error);
      alert("Failed to create document");
    }
  };

  const handleSave = async () => {
    try {
      await documentsAPI.update(activeDoc._id, activeDoc);
      await fetchDocuments();
      setViewMode("detail");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to update document");
    }
  };

  const handleDelete = async () => {
    try {
      await documentsAPI.delete(docToDelete._id);
      await fetchDocuments();
      setDocToDelete(null);
      setActiveDoc(null);
      setViewMode("list");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  const handleRestore = async (doc) => {
    try {
      await documentsAPI.restore(doc._id);
      await fetchDocuments();
    } catch (error) {
      console.error("Error restoring document:", error);
      alert("Failed to restore document");
    }
  };

  const handlePublish = async (doc) => {
    try {
      await documentsAPI.update(doc._id, { 
        status: 'published',
        publishedAt: new Date()
      });
      await fetchDocuments();
    } catch (error) {
      console.error("Error publishing document:", error);
      alert("Failed to publish document");
    }
  };

  let content = null;

  if (viewMode === "edit") {
    content = (
      <div>
        <button onClick={() => setViewMode("detail")} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">{t('admin.docsMgmt.back')}</button>
        <h2 className="text-xl font-bold mb-4">{t('admin.docsMgmt.editDoc')}</h2>
        <DocumentForm
          initialData={activeDoc}
          categories={categories}
          onSubmit={async (formData) => {
            await documentsAPI.update(activeDoc._id, formData);
            await fetchDocuments();
            setViewMode("detail");
          }}
          onCancel={() => setViewMode("detail")}
          submitLabel={t('admin.docsMgmt.saveChanges')}
          isAdmin={true}
        />
      </div>
    );
  } else if (viewMode === "detail") {
    content = (
      <DocDetail
        doc={activeDoc}
        onBack={() => setViewMode("list")}
        onEdit={() => setViewMode("edit")}
        onDelete={() => setDocToDelete(activeDoc)}
        onPublish={handlePublish}
        t={t}
      />
    );
  } else if (viewMode === "add") {
    content = (
      <div>
        <button onClick={() => setViewMode("list")} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">{t('admin.docsMgmt.back')}</button>
        <h2 className="text-xl font-bold mb-4">{t('admin.docsMgmt.addDoc')}</h2>
        <DocumentForm
          categories={categories}
          onSubmit={async (formData) => {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            await handleAdd({ 
              ...formData, 
              author: currentUser._id || currentUser.id 
            });
          }}
          onCancel={() => setViewMode("list")}
          submitLabel={t('admin.docsMgmt.addDocBtn')}
          isAdmin={true}
        />
      </div>
    );
  } else {
    content = (
      <DocList
        documents={documents}
        loading={loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentPage={currentPage}
        docsPerPage={docsPerPage}
        onPageChange={setCurrentPage}
        onView={(d) => {
          setActiveDoc(d);
          setViewMode("detail");
        }}
        onEdit={(d) => {
          setActiveDoc(d);
          setViewMode("edit");
        }}
        onDelete={(d) => setDocToDelete(d)}
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

      {docToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-2">
              {t('admin.docsMgmt.deleteTitle')}
            </h3>
            <p className="text-sm mb-4">
              <strong>{docToDelete.title}</strong>
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setDocToDelete(null)}
              >
                {t('admin.docsMgmt.cancel')}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                {t('admin.docsMgmt.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DocList({ documents, loading, activeTab, onTabChange, currentPage, docsPerPage, onPageChange, onView, onEdit, onDelete, onRestore, onPublish, onAdd, t }) {
  const getFilteredDocs = () => {
    switch (activeTab) {
      case 'pending':
        return documents.filter(d => d.status === 'pending' && !d.isDeleted);
      case 'published':
        return documents.filter(d => d.status === 'published' && !d.isDeleted);
      case 'deleted':
        return documents.filter(d => d.isDeleted);
      default:
        return documents.filter(d => !d.isDeleted);
    }
  };

  const filteredDocs = getFilteredDocs();
  
  const indexOfLastDoc = currentPage * docsPerPage;
  const indexOfFirstDoc = indexOfLastDoc - docsPerPage;
  const currentDocs = filteredDocs.slice(indexOfFirstDoc, indexOfLastDoc);
  const totalPages = Math.ceil(filteredDocs.length / docsPerPage);

  const tabs = [
    { id: 'all', label: t('admin.docsMgmt.allDocuments'), count: documents.filter(d => !d.isDeleted).length },
    { id: 'pending', label: t('admin.docsMgmt.pendingApproval'), count: documents.filter(d => d.status === 'pending' && !d.isDeleted).length },
    { id: 'published', label: t('admin.docsMgmt.published'), count: documents.filter(d => d.status === 'published' && !d.isDeleted).length },
    { id: 'deleted', label: t('admin.docsMgmt.deleted'), count: documents.filter(d => d.isDeleted).length },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.docsMgmt.title')} ({filteredDocs.length})</h1>
        <button
          onClick={onAdd}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {t('admin.docsMgmt.addDocument')}
        </button>
      </div>

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
        <p className="text-center py-8">{t('admin.docsMgmt.loading')}</p>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('admin.docsMgmt.noDocs')}</p>
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
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableTitle')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableAuthor')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableCategory')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableType')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableStatus')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableDate')}</th>
                  <th className="p-4 text-left text-sm font-semibold">{t('admin.docsMgmt.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {currentDocs.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="p-4 border-t">{d.title}</td>
                    <td className="p-4 border-t">{d.author?.fullName || d.author}</td>
                    <td className="p-4 border-t">{d.category?.name || d.category}</td>
                    <td className="p-4 border-t">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 uppercase">
                        {d.fileType}
                      </span>
                    </td>
                    <td className="p-4 border-t">
                      <span className={`px-2 py-1 rounded text-xs ${
                        d.isDeleted ? 'bg-red-100 text-red-700' :
                        d.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        d.status === 'published' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {d.isDeleted ? t('admin.docsMgmt.deleted') : d.status}
                      </span>
                    </td>
                    <td className="p-4 border-t text-sm text-gray-600">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-t">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onView(d)} 
                          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                        >
                          {t('admin.docsMgmt.view')}
                        </button>
                        {!d.isDeleted && (
                          <>
                            {d.status === 'pending' && (
                              <button 
                                onClick={() => onPublish(d)} 
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                {t('admin.docsMgmt.approve')}
                              </button>
                            )}
                            <button 
                              onClick={() => onEdit(d)} 
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              {t('admin.docsMgmt.edit')}
                            </button>
                            <button 
                              onClick={() => onDelete(d)} 
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              {t('admin.docsMgmt.delete')}
                            </button>
                          </>
                        )}
                        {d.isDeleted && (
                          <button 
                            onClick={() => onRestore(d)} 
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            {t('admin.docsMgmt.restore')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredDocs.length}
              itemsPerPage={docsPerPage}
            />
          )}
        </>
      )}
    </div>
  );
}

function DocDetail({ doc, onBack, onEdit, onDelete, onPublish, t }) {
  const handleDownload = () => {
    const url = resolveFileUrl(doc.fileUrl);
    window.open(url, '_blank');
  };

  return (
    <div>
      <button onClick={onBack} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">{t('admin.docsMgmt.back')}</button>
      <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
      <p className="text-sm text-gray-500 mb-2">
        {t('admin.docsMgmt.author')}: {doc.author?.fullName || doc.author} · {t('admin.docsMgmt.status')}: {doc.status} · {t('admin.docsMgmt.category')}: {doc.category?.name || doc.category}
      </p>
      {doc.description && (
        <p className="text-sm text-gray-600 mb-4 italic">{doc.description}</p>
      )}
      
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">{t('admin.docsMgmt.fileType')}</p>
            <p className="font-semibold uppercase">{doc.fileType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('admin.docsMgmt.fileSize')}</p>
            <p className="font-semibold">{doc.fileSize || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('admin.docsMgmt.views')}</p>
            <p className="font-semibold">{doc.views || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('admin.docsMgmt.downloads')}</p>
            <p className="font-semibold">{doc.downloads || 0}</p>
          </div>
        </div>
      </div>

      <div 
        className="mb-4 p-4 bg-gray-50 rounded prose max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.content }}
      />

      <div className="flex gap-3">
        <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">{t('admin.docsMgmt.downloadFile')}</button>
        <button onClick={onEdit} className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">{t('admin.docsMgmt.edit')}</button>
        {doc.status === 'pending' && (
          <button onClick={() => onPublish(doc)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{t('admin.docsMgmt.publish')}</button>
        )}
        <button onClick={onDelete} className="border border-red-500 text-red-600 px-4 py-2 rounded hover:bg-red-50">{t('admin.docsMgmt.delete')}</button>
      </div>
    </div>
  );
}

