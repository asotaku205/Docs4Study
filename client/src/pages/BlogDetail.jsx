import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRoute } from "wouter";
import BlogCard from "../components/users/Blogs/blogCard";
import CommentSection from "../components/users/CommentSection";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
import ContentHeader from "../components/users/shared/ContentHeader";
import InteractionBar from "../components/users/shared/InteractionBar";
import SidebarInfo from "../components/users/shared/SidebarInfo";
import { blogService } from "../services/blogService";

const BlogDetail = () => {
  const [, params] = useRoute("/blog-detail/:id");
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  
  const getImageUrl = (url) => {
    if (!url) return '/library.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${API_URL}${url}`;
    return url;
  };

  useEffect(() => {
    if (params?.id) {
      fetchBlogDetail();
      fetchRelatedBlogs();
    }
  }, [params?.id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogById(params.id);
      setBlog(response.data);
      
      // Check if current user has liked this blog
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser._id && response.data.likedBy) {
        const hasLiked = response.data.likedBy.includes(currentUser._id);
        setLiked(hasLiked);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await blogService.getAllBlogs({ limit: 3 });
      setRelatedBlogs(response.data || []);
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await blogService.likeBlog(params.id);
      // Update blog with server data to ensure sync
      setBlog(response.data);
      setLiked(response.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (content) => {
    try {
      setSubmittingComment(true);
      await blogService.addComment(params.id, content);
      await fetchBlogDetail(); // Refresh to get new comments
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage = error.response?.data?.message || "Failed to add comment. Please login first.";
      alert(errorMessage);
      
      // If 401/403, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/auth';
      }
      throw error;
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Blog not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackgroundPhoto image={getImageUrl(blog.image)} />
      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        <BackButton  link = "/blog" />
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <ContentHeader
              category={blog.category}
              title={blog.title}
              createdAt={blog.createdAt}
              author={blog.author}
              views={blog.views}
            />
            <div className="bg-card rounded-2xl shadow-lg p-8 lg:p-12 mt-8">
              {/* Images */}
              {blog.images && blog.images.length > 0 && (
                <div className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.map((img, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${img.url}`}
                      alt={img.caption || `Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-lg shadow-md"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              {blog.description && (
                <p className="text-lg leading-relaxed text-muted-foreground mt-8 mb-6">
                  {blog.description}
                </p>
              )}

              {/* Rich Text Content */}
              <div 
                className="prose prose-lg max-w-none mt-8 mb-12
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
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              <InteractionBar
                likes={blog.likes}
                commentsCount={blog.comments?.length}
                liked={liked}
                onLike={handleLike}
                onShare={() => {}}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <SidebarInfo
              title="Post Info"
              items={[
                { label: "Category", value: blog.category?.name || "General" },
                { label: "Published", value: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString() },
                { label: "Views", value: blog.views },
                { label: "Likes", value: blog.likes || 0 }
              ]}
            />
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-3xl font-heading font-bold mb-8">
            Related Articles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.slice(0, 3).map((post) => (
              <BlogCard
                key={post._id}
                id={post._id}
                image={post.image}
                images={post.images}
                category={post.category?.name || "General"}
                date={new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                title={post.title}
                description={post.description}
                author={post.author?.fullName || "Unknown"}
              />
            ))}
          </div>
        </div>
      </div>
      <CommentSection 
        comments={blog.comments || []}
        onCommentSubmit={handleCommentSubmit}
        submitting={submittingComment}
      />
    </Layout>
  );
};
export default BlogDetail;
