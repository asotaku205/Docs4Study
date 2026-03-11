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
import { useLanguage } from "../i18n/LanguageContext";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All' }]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const { activeTab: activeCategory, handleTabChange: handleCategoryClick } = useTabs("all");
  const { t } = useLanguage();

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
        { _id: 'all', name: t.documents.allDocuments },
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

      <section className="pb-12">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title={t.documents.browseTitle}
            description={t.documents.browseDescription}
            actionLabel={t.documents.uploadDocument}
            actionLink="/create-document"
          />
          
          <div className="grid lg:grid-cols-4 gap-8">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryClick}
              title={t.documents.categoryTitle}
            />

          {/* Documents List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-muted-foreground">
                {loading ? t.blog.loading : `${documents.length} ${t.documents.resultsFound}`}
              </h3>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">
                  {t.documents.loading}
                </p>
              ) : paginatedDocuments.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full py-8">
                  {t.documents.noDocuments}
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
                    category={doc.category?.name || t.common.general}
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
