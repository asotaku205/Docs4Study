import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import BlogCard from "../components/users/Blogs/blogCard";
import HeroPost from "../components/users/Blogs/heroPost";
import TopDocs from "../components/users/Documents/topDocs";
import TopCourses from "../components/users/Courses/topCourses";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { blogService } from "../services/blogService";

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchCourses();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({ limit: 4 });
      const publishedBlogs = response.data.filter(
        post => post.status === 'published' && !post.isDeleted
      );
      
      // Set first blog as featured (hero post)
      if (publishedBlogs.length > 0) {
        setFeaturedBlog(publishedBlogs[0]);
        // Set remaining blogs for Latest Update section
        setBlogs(publishedBlogs.slice(1, 4));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/user/courses?isPublished=true&limit=3');
      const data = await response.json();
      if (data.data) {
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

  return (
    <Layout>
      <section className="relative overflow-hidden bg-primary py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-[url('/herobg.png')] bg-cover"></div>
        <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="whitespace-nowrap inline-flex items-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground px-4 py-1 text-sm font-medium tracking-wide  ">
              Welcome to Docs4Study
            </div>

            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white leading-tight">
              Unlock Your Potential with {" "}
              <span className="font-semibold text-blue-200">
                Quality Knowledge {" "}
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto lg:mx-0">
              Access thousands of study documents, expert-led courses, and
              insightful articles to accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 ">
              <Link href="/blog">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
                Start Reading
              </button>
              </Link>
              <Link href="/courses">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-10 rounded-md px-8 border-white/30 text-white hover:bg-white/10 hover:text-white text-base">
                Explore Courses
              </button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/library.png"
                alt="library"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black/80 to-transparent p-8">
                "The best investment you can make is in yourself."
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="mx-auto px-4 container">
          <div className="flex items-center justify-between mb-8">
            <div className=" ">
              <h2 className="font-bold font-leading text-foreground text-3xl">
                Featured Insights
              </h2>
              <p className="text-muted-foreground mt-2 ">
                Our topic for this week.
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium cursor-pointer">
              <Link href="/blog">
                <button className="inline-flex items-center gap-2 hover:cursor-pointer">
                  View all blog
                </button>
                <FontAwesomeIcon icon={faAngleRight} />
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading featured blog...</p>
            </div>
          ) : featuredBlog ? (
            <HeroPost
              id={featuredBlog._id}
              image={featuredBlog.image}
              images={featuredBlog.images}
              category={featuredBlog.category?.name || 'Uncategorized'}
              date={formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
              title={featuredBlog.title}
              description={featuredBlog.description}
            author={featuredBlog.author?.fullName || 'Unknown'}
            />
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">No featured blog available yet.</p>
            </div>
          )}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-3xl mb-8 text-foreground text-center">
            Latest Update
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blogs available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </section>
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-foreground">
                    Popular Documents
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Most viewed study materials
                  </p>
                </div>
                <div>
                  <Link href="/documents">
                    <button className="text-sm font-medium hover:cursor-pointer">View all</button>
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <TopDocs
                  category="Intermediate"
                  title="Calculus I - Final Exam Cheatsheet"
                  description="Comprehensive formula sheet for derivatives and integrals."
                  dowloaded="340"
                  view="1.2k"
                />
                <TopDocs
                  category="Intermediate"
                  title="Calculus I - Final Exam Cheatsheet"
                  description="Comprehensive formula sheet for derivatives and integrals."
                  dowloaded="340"
                  view="1.2k"
                />
                <TopDocs
                  category="Intermediate"
                  title="Calculus I - Final Exam Cheatsheet"
                  description="Comprehensive formula sheet for derivatives and integrals."
                  dowloaded="340"
                  view="1.2k"
                />
                <TopDocs
                  category="Intermediate"
                  title="Calculus I - Final Exam Cheatsheet"
                  description="Comprehensive formula sheet for derivatives and integrals."
                  dowloaded="340"
                  view="1.2k"
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="flex  justify-between items-end mb-8">
                <div className="">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                    Recommended Courses
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Top-rated learning paths{" "}
                  </p>
                </div>
                <Link href="/courses">
                  <button className="text-sm font-medium hover:cursor-pointer">View all</button>
                  <FontAwesomeIcon icon={faAngleRight} />
                </Link>
              </div>

              <div className="space-y-4">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TopCourses
                      key={course._id}
                      id={course._id}
                      image={course.thumbnail}
                      level={course.level}
                      title={course.title}
                      duration={course.duration}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No courses available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {!isLoggedIn && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold">
              Ready to Elevate Your Learning Journey?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              Join Docs4Study today and unlock a world of knowledge at your
              fingertips. Whether you're a student, professional, or lifelong
              learner, we have the resources to help you succeed.
            </p>
            <Link href="/auth">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
                Create Your Free Account
              </button>
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
};
export default HomePage;
