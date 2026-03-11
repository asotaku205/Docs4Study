import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/users/Blogs/blogCard";
import HeroPost from "../components/users/Blogs/heroPost";
import TabButton from "../components/ui/TabButton";
import PageHeader from "../components/shared/PageHeader";
import Pagination from "../components/shared/Pagination";
import { useTabs } from "../hooks/useTabs";
import { blogService } from "../services/blogService";
import { categoryService } from "../services/categoryService";
import { useLanguage } from "../i18n/LanguageContext";

const Blog = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All Post' }]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const { activeTab, handleTabChange } = useTabs("all");
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories({ isActive: true });
      const allCategories = [
        { _id: 'all', name: t.blog.allPost },
        ...(response.data || [])
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({ limit: 1000 });
      setAllPosts(response.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo danh mục phía client (tức thời, không gọi API)
  const filteredPosts = useMemo(() => {
    if (activeTab === "all") return allPosts;
    return allPosts.filter(post => post.category?._id === activeTab);
  }, [activeTab, allPosts]);

  // Bài viết nổi bật = bài đầu tiên của bộ lọc hiện tại
  const heroPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

  // Các bài lưới = tất cả sau bài nổi bật
  const gridPosts = filteredPosts.slice(1);

  // Phân trang phía client (chuyển trang tức thời)
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return gridPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [gridPosts, currentPage]);

  const totalPages = Math.ceil(gridPosts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleTabChangeWithReset = (tabId) => {
    handleTabChange(tabId);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title={t.blog.title}
            actionLabel={t.blog.createPost}
            actionLink="/create-post"
          />

          {heroPost && (
            <HeroPost
              id={heroPost._id}
              image={heroPost.image || "/library.png"}
              category={heroPost.category?.name || t.common.general}
              date={new Date(heroPost.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              title={heroPost.title}
              description={heroPost.description}
              author={heroPost.author?.fullName || t.common.unknown}
            />
          )}

          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            {categories.map((cat) => (
              <TabButton
                key={cat._id}
                active={activeTab === cat._id}
                onClick={() => handleTabChangeWithReset(cat._id)}
              >
                {cat.name}
              </TabButton>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10 md:grid-cols-2">
            {loading ? (
              <p className="text-center text-muted-foreground col-span-full">
                {t.blog.loading}
              </p>
            ) : paginatedPosts.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">
                {t.blog.noPosts}
              </p>
            ) : (
              paginatedPosts.map((post) => (
                <BlogCard
                  key={post._id}
                  id={post._id}
                  image={post.image || "/library.png"}
                  category={post.category?.name || t.common.general}
                  date={new Date(post.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  title={post.title}
                  description={post.description}
                  author={post.author?.fullName || t.common.unknown}
                />
              ))
            )}
          </div>

          {!loading && gridPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={gridPosts.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
