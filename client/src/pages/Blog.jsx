import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "wouter";
import BlogCard from "../components/users/Blogs/blogCard";
import HeroPost from "../components/users/Blogs/heroPost";
import TabButton from "../components/ui/TabButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTabs } from "../hooks/useTabs";
import { blogService } from "../services/blogService";
import { categoryService } from "../services/categoryService";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([{ _id: 'all', name: 'All Post' }]);
  const [loading, setLoading] = useState(true);
  const [heroPost, setHeroPost] = useState(null);
  
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
      const params = {};
      if (activeTab !== "all") {
        params.category = activeTab;
      }
      const response = await blogService.getAllBlogs(params);
      setPosts(response.data || []);
      if (response.data && response.data.length > 0) {
        setHeroPost(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <div className="flex item-start justify-between gap-4 mb-8">
            <h1 className="font-bold font-leading text-4xl">Knowledge Hub</h1>
            <Link href="/create-post">
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition active:scale-95">
                <FontAwesomeIcon icon={faPlus} /> Create Post
              </button>
            </Link>
          </div>

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
            ) : posts.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">
                No posts available in this category.
              </p>
            ) : (
              posts.map((post) => (
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
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
