import Layout from "../components/Layout";
import Searching from "../components/users/Searching";
import { useState, useEffect } from "react";
import BlogCard from "../components/users/Blogs/blogCard";
import CardCourses from "../components/users/Courses/cardCourses";
import CardDocs from "../components/users/Documents/cardDocs";
import UserCard from "../components/users/UserCard";
import { blogService } from "../services/blogService";

const Search = () => {
  const tabs = ["All", "Blogs", "Courses", "Documents", "Users"];
  const [activeTab, setActiveTab] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchCourses();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllPosts({ limit: 6 });
      const publishedBlogs = response.data.filter(
        post => post.status === 'published' && !post.isDeleted
      );
      setBlogs(publishedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/user/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
                {loading ? (
                  <p className="text-muted-foreground">Loading blogs...</p>
                ) : blogs.length === 0 ? (
                  <p className="text-muted-foreground">No blogs found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.slice(0, 3).map((blog) => (
                      <BlogCard
                        key={blog._id}
                        id={blog._id}
                        image={blog.image}
                        images={blog.images}
                        category={blog.category?.name || 'Uncategorized'}
                        date={formatDate(blog.publishedAt || blog.createdAt)}
                        title={blog.title}
                        description={blog.description}
                        author={blog.author?.fullName || 'Unknown'}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4">Courses</h3>
                {courses.length === 0 ? (
                  <p className="text-muted-foreground">No courses found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                      <CardCourses 
                        key={course._id}
                        id={course._id}
                        image={course.thumbnail}
                        title={course.title}
                        description={course.description}
                        duration={course.duration}
                        level={course.level}
                      />
                    ))}
                  </div>
                )}
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
              {loading ? (
                <p className="text-muted-foreground">Loading blogs...</p>
              ) : blogs.length === 0 ? (
                <p className="text-muted-foreground">No blogs found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <BlogCard
                      key={blog._id}
                      id={blog._id}
                      image={blog.image}
                      images={blog.images}
                      category={blog.category?.name || 'Uncategorized'}
                      date={formatDate(blog.publishedAt || blog.createdAt)}
                      title={blog.title}
                      description={blog.description}
                      author={blog.author?.fullName || 'Unknown'}
                    />
                  ))}
                </div>
              )}
            </div>
            )}
            {activeTab === "Courses" && (
            <div>
              {courses.length === 0 ? (
                <p className="text-muted-foreground">No courses found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CardCourses 
                      key={course._id}
                      id={course._id}
                      image={course.thumbnail}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      level={course.level}
                    />
                  ))}
                </div>
              )}
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
