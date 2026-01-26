import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useRoute } from "wouter";
import {
  faAngleLeft,
  faUserPen,
  faThumbsUp,
  faComment,
  faShareFromSquare,
  faClock,
  faCalendar
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogCard from "../components/users/Blogs/blogCard";
import CommentSection from "../components/users/CommentSection";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
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
      alert("Failed to add comment. Please login first.");
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
            <div className="bg-card rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-primary text-white rounded transition text-xs">
                  {blog.category?.name || "General"}
                </div>
                <span className="text-sm text-muted-foreground">
                  <FontAwesomeIcon icon={faCalendar} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center justify-between pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserPen} />
                  </div>
                  <div className="">
                    <p className="font-bold text-sm">{blog.author?.fullName || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{blog.author?.email || "Editor"}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <FontAwesomeIcon icon={faClock} /> {blog.views} views
                </p>
              </div>
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
              <div className="flex items-center justify-between py-6 border-t border-b border-border">
                <div>
                  <button 
                    onClick={handleLike}
                    className={`transition-colors ${liked ? 'text-primary font-semibold' : 'hover:text-primary'}`}
                  >
                    <FontAwesomeIcon icon={faThumbsUp} /> {blog.likes || 0} Likes
                  </button>
                  <button className="ml-4">
                    <FontAwesomeIcon icon={faComment} /> {blog.comments?.length || 0} Comments
                  </button>
                </div>
                <button className="px-4 py-2 text-primary text-sm">
                  <FontAwesomeIcon icon={faShareFromSquare} /> Share
                </button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl border bg-card text-card-foreground shadow sticky top-4 overflow-hidden">
              <div className="p-6">
                <div className="border-b border-border">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    Post Info
                  </h3>
                </div>
                <div className="space-y-3 mt-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-semibold">{blog.category?.name || "General"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Published</p>
                    <p className="font-semibold">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-semibold">{blog.views}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Likes</p>
                    <p className="font-semibold">{blog.likes || 0}</p>
                  </div>
                </div>
              </div>
            </div>
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
