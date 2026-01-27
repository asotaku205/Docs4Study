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

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All Post' }]);
  const [loading, setLoading] = useState(true);
  const [heroPost, setHeroPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const { activeTab, handleTabChange } = useTabs("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories({ isActive: true });
      const allCategories = [
        { _id: 'all', name: 'All Post' },
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
      const params = {
        limit: 1000
      };
      if (activeTab !== "all") {
        params.category = activeTab;
      }
      const response = await blogService.getAllBlogs(params);
      const publishedPosts = (response.data || []).filter(post => 
        post.status === 'published' && !post.isDeleted
      );
      setPosts(publishedPosts);
      if (publishedPosts.length > 0) {
        setHeroPost(publishedPosts[0]);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const otherPosts = posts.slice(1);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return otherPosts.slice(startIndex, endIndex);
  }, [otherPosts, currentPage]);

  const totalPages = Math.ceil(otherPosts.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <Layout>
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <PageHeader
            title="Knowledge Hub"
            actionLabel="Create Post"
            actionLink="/create-post"
          />

          {heroPost && (
            <HeroPost
              id={heroPost._id}
              image={heroPost.image || "/library.png"}
              category={heroPost.category?.name || "General"}
              date={new Date(heroPost.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              title={heroPost.title}
              description={heroPost.description}
              author={heroPost.author?.fullName || "Unknown"}
            />
          )}

          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            {categories.map((cat) => (
              <TabButton
                key={cat._id}
                active={activeTab === cat._id}
                onClick={() => handleTabChange(cat._id)}
              >
                {cat.name}
              </TabButton>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-10 md:grid-cols-2">
            {loading ? (
              <p className="text-center text-muted-foreground col-span-full">
                Loading...
              </p>
            ) : paginatedPosts.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">
                No posts found.
              </p>
            ) : (
              paginatedPosts.map((post) => (
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
              ))
            )}
          </div>

          {!loading && otherPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={otherPosts.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
