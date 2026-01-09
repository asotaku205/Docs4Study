import Layout from "../components/Layout";
import Searching from "../components/users/Searching";
import { useState, useEffect } from "react";
import BlogCard from "../components/users/Blogs/blogCard";
import CardCourses from "../components/users/Courses/cardCourses";
import CardDocs from "../components/users/Documents/cardDocs";
import UserCard from "../components/users/UserCard";
const Search = () => {
  const tabs = ["All", "Blogs", "Courses", "Documents", "Users"];
  const [activeTab, setActiveTab] = useState("All");
  
  const mockBlogs = [
    {
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=500",
      category: "Programming",
      date: "Jan 5, 2026",
      title: "Introduction to React Hooks",
      description: "Learn about useState, useEffect and other essential React hooks for modern development.",
      author: "John Doe"
    },
    {
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500",
      category: "Web Development",
      date: "Jan 3, 2026",
      title: "JavaScript Best Practices 2026",
      description: "Essential tips and tricks for writing clean, maintainable JavaScript code.",
      author: "Jane Smith"
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
      category: "Design",
      date: "Dec 28, 2025",
      title: "UI/UX Design Principles",
      description: "Master the fundamentals of creating beautiful and user-friendly interfaces.",
      author: "Mike Johnson"
    }
  ];

  const mockCourses = [
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
      title: "Full Stack Web Development",
      description: "Complete guide to modern web development with React, Node.js, and MongoDB.",
      duration: "40 hours",
      students: "1,234",
      price: "49.99"
    },
    {
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=500",
      title: "React Mastery Course",
      description: "Master React from basics to advanced concepts including hooks and context.",
      duration: "30 hours",
      students: "856",
      price: "39.99"
    }
  ];

  const mockDocuments = [
    {
      title: "JavaScript Cheat Sheet 2026",
      description: "Quick reference guide for JavaScript syntax, methods, and best practices.",
      downloads: "2,341",
      views: "15,432",
      level: "Beginner",
      type: "PDF"
    },
    {
      title: "CSS Grid Complete Guide",
      description: "Everything you need to know about CSS Grid layout system with examples.",
      downloads: "1,892",
      views: "12,156",
      level: "Intermediate",
      type: "PDF"
    },
    {
      title: "React Hooks Reference",
      description: "Comprehensive documentation of all React hooks with practical examples.",
      downloads: "3,145",
      views: "18,923",
      level: "Advanced",
      type: "PDF"
    }
  ];

  const mockUsers = [
    {
      name: "Bình xăng con",
      email: "binhxangcon@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      role: "Instructor",
      badge: "Pro Member",
      joined: "Nov 2024",
      courses: 12,
        blogs: "10"
    },
    {
      name: "Thiện 99",
      email: "thien99@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      role: "Content Creator",
      badge: "Expert",
      joined: "Oct 2024",
      courses: 8,
        blogs: "5"
    },
    {
      name: "Tuấn Anh Bắc Ninh",
      email: "tuananhbn@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      role: "Student",
      badge: "Active Learner",
      joined: "Dec 2024",
      courses: 15,
      blogs: "0"
    }
  ];
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    }
  }, []);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };
  return (
    <Layout>
      <Searching
        title="Study Materials"
        description="Find study materials, notes, and resources across various categories."
      />
      <section className="flex-1 flex flex-col py-6">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground hover:bg-accent/80 transition"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          
          </div>
          {activeTab === "All" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Blogs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockBlogs.map((blog, index) => (
                    <BlogCard key={index} {...blog} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCourses.map((course, index) => (
                    <CardCourses key={index} {...course} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Documents</h3>
                <div className="space-y-4">
                  {mockDocuments.map((doc, index) => (
                    <CardDocs key={index} {...doc} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockUsers.map((user, index) => (
                    <UserCard key={index} {...user} />
                  ))}
                </div>
              </div>
            </div>
          )}
            {activeTab === "Blogs" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBlogs.map((blog, index) => (
                  <BlogCard key={index} {...blog} />
                ))}
              </div>
            </div>
            )}
            {activeTab === "Courses" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCourses.map((course, index) => (
                  <CardCourses key={index} {...course} />
                ))}
              </div>
            </div>
            )}
            {activeTab === "Documents" && (
            <div>
              <div className="space-y-4">
                {mockDocuments.map((doc, index) => (
                  <CardDocs key={index} {...doc} />
                ))}
              </div>
            </div>
            )}
            {activeTab === "Users" && (
            <div>
                
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUsers.map((user, index) => (
                  <UserCard key={index} {...user} />
                ))}
              </div>
            </div>
            )}
        </div>
      </section>
    </Layout>
  );
};
export default Search;
