import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "wouter";
import BlogCard from "../components/users/Blogs/blogCard";
import HeroPost from "../components/users/Blogs/heroPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const Blog = () => {
  const [activeTab, setActiveTab] = useState("All Post");
  useEffect(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      }
  },[]);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  }
  const tabs = [
    "All Post",
    "Development",
    "Design",
    "Marketing",
    "Business",
    "Productivity",
    "Lifestyle"
  ]
  const allPosts = [
  {
    id: 1,
    image: "/library.png",
    category: "Development",
    date: "Dec 25, 2025",
    title: "Mastering React in 2025: A Comprehensive Guide",
    description: "Everything you need to know about the latest features in React ecosystem.",
    author: "Anh Son"
  },
  {
    id: 2,
    image: "/library.png",
    category: "Development",
    date: "Dec 24, 2025",
    title: "Node.js Best Practices",
    description: "Learn the best practices for Node.js development",
    author: "Anh Son"
  },
  {
    id: 3,
    image: "/library.png",
    category: "Design",
    date: "Dec 23, 2025",
    title: "UI/UX Design Principles",
    description: "Master the fundamentals of modern design",
    author: "Anh Son"
  },
];
 const filteredPosts = activeTab === "All Post" ? allPosts : allPosts.filter(post => post.category === activeTab);
  return (
    <Layout>
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <div className="flex item-start justify-between gap-4 mb-8">
            <h1 className="font-bold font-leading text-4xl">Knowledge Hub</h1>
            <Link href="/blog/create">
              <button className="ml-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition">
                <FontAwesomeIcon icon={faPlus} /> Create Post
              </button>
            </Link>
          </div>
          <HeroPost
            image="/library.png"
            category="Development"
            date="Dec 25, 2025"
            title="Mastering React in 2025: A Comprehensive Guide"
            description="Everything you need to know about the latest features in React ecosystem."
            author="Anh Son"
          />
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            {
              tabs.map((tab) =>(
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white' : 'bg-card text-muted-foreground hover:bg-accent/80 transition'}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))
            }
              
          </div>
          <div className="grid lg:grid-cols-3 gap-10 md:grid-cols-2 ">
            {filteredPosts.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">No posts available in this category.</p>
            ) : (
              filteredPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Blog;
