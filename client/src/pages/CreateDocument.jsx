import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useLocation } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { categoryService } from "../services/categoryService";
import { documentService } from "../services/documentService";
import DocumentForm from "../components/shared/DocumentForm";

const CreateDocument = () => {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState([]);

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

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please login to submit a document.");
        setLocation("/auth");
        return;
      }
      
      await documentService.createDocument(formData);
      alert("Document submitted successfully! Waiting for admin approval.");
      setLocation("/documents");
    } catch (error) {
      console.error("Error creating document:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to create document";
      if (error.response?.status === 403 || error.response?.status === 401) {
        alert("Please login to create a document.");
        setLocation("/auth");
      } else {
        alert(`Failed to create document: ${errorMsg}`);
      }
      throw error;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold mb-2">Share Your Document</h1>
            <p className="text-muted-foreground">Submit your document for admin review and publication</p>
          </div>
          
          <div className="rounded-lg bg-card text-card-foreground shadow-lg border border-border">
            <div className="flex flex-col space-y-1.5 p-6 border-b border-border">
              <div className="font-semibold tracking-tight text-xl">Upload New Document</div>
              <div className="text-sm text-muted-foreground">Fill in the information below</div>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mb-6">
                <FontAwesomeIcon icon={faCircleInfo} className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Your document will be reviewed</p>
                  <p>Administrators will check the content before publishing. This may take a few hours.</p>
                </div>
              </div>

              <DocumentForm
                categories={categories}
                onSubmit={handleSubmit}
                onCancel={() => setLocation("/documents")}
                submitLabel="Submit Document"
                isAdmin={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDocument;
