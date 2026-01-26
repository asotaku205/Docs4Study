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
import CommentCard from "../components/users/commentCard";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
import AboutAuthor from "../components/users/AboutAuthor";
import { blogService } from "../services/blogService";

const BlogDetail = () => {
  const [, params] = useRoute("/blog-detail/:id");
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

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
      await blogService.likeBlog(params.id);
      setLiked(true);
      setBlog(prev => ({ ...prev, likes: prev.likes + 1 }));
    } catch (error) {
      console.error("Error liking blog:", error);
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
      <BackgroundPhoto image={blog.image || "/library.png"} />
      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        <BackButton />
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
              <div className="max-w-none mt-8 mb-12 space-y-6 text-foreground">
                {blog.description && (
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {blog.description}
                  </p>
                )}
                <div className="text-lg leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>
              <div className="flex items-center justify-between py-6 border-t border-b border-border">
                <div>
                  <button 
                    onClick={handleLike}
                    disabled={liked}
                    className={`${liked ? 'text-primary' : ''}`}
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
              <AboutAuthor />
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
                image={post.image || "/library.png"}
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
      <CommentCard blogId={params.id} comments={blog.comments || []} onCommentAdded={fetchBlogDetail} />
    </Layout>
  );
};
export default BlogDetail;
                  