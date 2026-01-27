import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRoute } from "wouter";
import BackButton from "../components/ui/BackButton";
import CommentSection from "../components/users/CommentSection";
import ContentHeader from "../components/users/shared/ContentHeader";
import InteractionBar from "../components/users/shared/InteractionBar";
import SidebarInfo from "../components/users/shared/SidebarInfo";
import { documentService } from "../services/documentService";

const DocumentDetail = () => {
  const [, params] = useRoute("/documents/:id");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    if (params?.id) {
      fetchDocumentDetail();
    }
  }, [params?.id]);

  const fetchDocumentDetail = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocumentById(params.id);
      setDocument(response.data);
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser._id && response.data.likedBy) {
        const hasLiked = response.data.likedBy.includes(currentUser._id);
        setLiked(hasLiked);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await documentService.likeDocument(params.id);
      setDocument(response.data);
      setLiked(response.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Please login to like this document");
    }
  };

  const handleCommentSubmit = async (content) => {
    try {
      setSubmittingComment(true);
      await documentService.addComment(params.id, content);
      await fetchDocumentDetail();
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to add comment. Please login first.";
      alert(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/auth';
      }
      throw error;
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDownload = () => {
    if (document?.fileUrl) {
      const url = `${API_URL}${document.fileUrl}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center py-8">Loading document...</p>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center py-8">Document not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <BackButton link="/documents" text="Documents" />
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-8">
            <ContentHeader
              category={document.category}
              title={document.title}
              description={document.description || 'No description available'}
              createdAt={document.updatedAt}
              author={document.author}
              showAuthor={true}
              badgeText={document.fileType?.toUpperCase() || 'FILE'}
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{document.views || 0}</span>
                  <span className="text-muted-foreground">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{document.downloads || 0}</span>
                  <span className="text-muted-foreground">Downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{document.likes || 0}</span>
                  <span className="text-muted-foreground">Likes</span>
                </div>
              </div>
            </ContentHeader>

            <div className="bg-card rounded-2xl p-12 shadow-lg border-2 border-dashed border-border min-h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-xl font-semibold text-muted-foreground mb-4">
                  Document Preview
                </p>
                <p className="text-muted-foreground mb-6">
                  {document.fileType?.toUpperCase()} Document - {document.fileSize || 'N/A'}
                </p>
                <button 
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition active:scale-95"
                >
                  Open Full Document
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-bold font-heading mb-6">
                Document Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Type</p>
                  <p className="font-semibold text-lg">{document.fileType?.toUpperCase() || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">File Size</p>
                  <p className="font-semibold text-lg">{document.fileSize || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Category</p>
                  <p className="font-semibold">{document.category?.name || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Author</p>
                  <p className="font-semibold">{document.author?.fullName || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-8 lg:p-12 border border-border">
              <h2 className="text-2xl font-bold font-heading mb-4">
                Description
              </h2>
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:font-heading prose-headings:font-bold
                  prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                  prose-p:text-foreground prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
                  prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
                  prose-li:text-foreground prose-li:my-2
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                  prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: document.content }}
              />
            </div>

            <InteractionBar
              likes={document.likes}
              commentsCount={document.comments?.length}
              liked={liked}
              onLike={handleLike}
              onShare={() => {}}
            />
          </div>

          <div className="lg:col-span-1">
            <SidebarInfo title="Free to Download">
              <div className="space-y-4">
                <button 
                  onClick={handleDownload}
                  className="w-full h-12 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition active:scale-95 font-semibold"
                >
                  Download Now
                </button>
                <button className="w-full h-12 px-4 py-2 border rounded hover:bg-gray-50 transition">
                  Share Document
                </button>
                <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Uploaded</p>
                    <p className="font-semibold">{new Date(document.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-semibold">{new Date(document.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold">{document.category?.name || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{document.views || 0}</p>
                  </div>
                </div>
              </div>
            </SidebarInfo>
          </div>
        </div>
        <div className="mt-16">
          <CommentSection 
            comments={document.comments || []}
            onSubmit={handleCommentSubmit}
            submitting={submittingComment}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DocumentDetail;
