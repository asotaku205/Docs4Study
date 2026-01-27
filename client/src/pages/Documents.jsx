import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import CardDocs from "../components/users/Documents/cardDocs";
import Searching from "../components/users/Searching";
import CategoryFilter from "../components/shared/CategoryFilter";
import PageHeader from "../components/shared/PageHeader";
import Pagination from "../components/shared/Pagination";
import { useTabs } from "../hooks/useTabs";
import { documentService } from "../services/documentService";
import { categoryService } from "../services/categoryService";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All Documents' }]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const { activeTab: activeCategory, handleTabChange: handleCategoryClick } = useTabs("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories({ isActive: true });
      const allCategories = [
        { _id: 'all', name: 'All Documents' },
        ...(response.data || [])
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 1000
      };
      if (activeCategory !== "all") {
        params.category = activeCategory;
      }
      const response = await documentService.getAllDocuments(params);
      const publishedDocs = (response.data || []).filter(doc => 
        doc.status === 'published' && !doc.isDeleted
      );
      setDocuments(publishedDocs);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return documents.slice(startIndex, endIndex);
  }, [documents, currentPage]);

  const totalPages = Math.ceil(documents.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Searching
        title="Study Documents"
        description="Access thousands of study notes, cheat sheets, and research papers shared by the community."
      />

      <section className="py-12">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Browse Documents"
            description="Find and share educational materials"
            actionLabel="Upload Document"
            actionLink="/create-document"
          />
          
          <div className="grid lg:grid-cols-4 gap-8">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryClick}
              title="Category"
            />

          {/* Documents List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-muted-foreground">
                {loading ? 'Loading...' : `${documents.length} results found`}
              </h3>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  Loading documents...
                </p>
              ) : paginatedDocuments.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full py-8">
                  No documents found.
                </p>
              ) : (
                paginatedDocuments.map((doc) => (
                  <CardDocs 
                    key={doc._id} 
                    id={doc._id}
                    title={doc.title}
                    description={doc.description || doc.content?.substring(0, 100)}
                    downloads={doc.downloads || 0}
                    views={doc.views || 0}
                    type={doc.fileType?.toUpperCase() || 'PDF'}
                    category={doc.category?.name || 'General'}
                    fileSize={doc.fileSize || 'N/A'}
                  />
                ))
              )}
            </div>

            {!loading && documents.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={documents.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </div>
      </div>
      </section>
    </Layout>
  );
};

export default Documents;
