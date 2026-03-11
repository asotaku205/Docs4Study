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
import { useLanguage } from "../i18n/LanguageContext";
import { getImageUrl } from "../utils/url";

const BlogDetail = () => {
  const [, params] = useRoute("/blog-detail/:id");
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { t, language } = useLanguage();

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
      
      // Kiểm tra người dùng hiện tại đã thích blog này chưa
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
      // Cập nhật blog với dữ liệu từ server để đồng bộ
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
      await fetchBlogDetail(); // Làm mới để lấy bình luận mới
    } catch (error) {
      console.error("Error adding comment:", error);
      const errorMessage = error.response?.data?.message || t.alerts.commentFailed;
      alert(errorMessage);
      
      // Nếu 401/403, chuyển hướng đến trang đăng nhập
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
          <p>{t.blogDetail.loading}</p>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>{t.blogDetail.notFound}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackgroundPhoto image={getImageUrl(blog.image)} />
      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        <BackButton link="/blog" text={t.nav.blogs} />
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <ContentHeader
              category={blog.category}
              title={blog.title}
              createdAt={blog.createdAt}
              author={blog.author}
              views={blog.views}
            />

            <article className="bg-card rounded-2xl shadow-lg p-8 lg:p-12 mt-8 overflow-hidden">
              {/* Description as lead */}
              {blog.description && (
                <p className="text-xl leading-relaxed text-muted-foreground border-l-4 border-primary pl-6 mb-8">
                  {blog.description}
                </p>
              )}

              {/* Images gallery */}
              {blog.images && blog.images.length > 0 && (
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img.url)}
                      alt={img.caption || `Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-xl shadow-md"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {/* Rich Text Content */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <InteractionBar
                likes={blog.likes}
                commentsCount={blog.comments?.length}
                liked={liked}
                onLike={handleLike}
                onShare={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert(t.blogDetail.linkCopied);
                }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <SidebarInfo
              title={t.blogDetail.postInfo}
              items={[
                { label: t.blogDetail.category, value: blog.category?.name || t.common.general },
                { label: t.blogDetail.published, value: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: t.blogDetail.views, value: `${blog.views || 0} ${t.blogDetail.views}` },
                { label: t.blogDetail.likes, value: `${blog.likes || 0} ${t.blogDetail.likes}` },
                { label: t.blogDetail.comments, value: `${blog.comments?.length || 0} ${t.blogDetail.comments}` },
                { label: t.blogDetail.readingTime, value: `${Math.max(1, Math.ceil((blog.content?.replace(/<[^>]+>/g, '').length || 0) / 1000))} ${t.blogDetail.minRead}` }
              ]}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 mb-16">
          <CommentSection
            comments={blog.comments || []}
            onCommentSubmit={handleCommentSubmit}
            submitting={submittingComment}
          />
        </div>

        {/* Related Articles */}
        <div className="mt-8 mb-20">
          <h3 className="text-3xl font-heading font-bold mb-8">
            {t.blogDetail.relatedArticles}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedBlogs.filter(p => p._id !== blog._id).slice(0, 3).map((post) => (
              <BlogCard
                key={post._id}
                id={post._id}
                image={post.image}
                images={post.images}
                category={post.category?.name || "General"}
                date={new Date(post.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                title={post.title}
                description={post.description}
                author={post.author?.fullName || "Unknown"}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default BlogDetail;
