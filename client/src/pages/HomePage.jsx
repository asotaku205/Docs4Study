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
import { documentService } from "../services/documentService";
import apiUser from "../services/apiUser";
import { useLanguage } from "../i18n/LanguageContext";

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const { t, language } = useLanguage();
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchCourses();
    fetchDocuments();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAllBlogs({ limit: 4 });
      const publishedBlogs = response.data.filter(
        post => post.status === 'published' && !post.isDeleted
      );
      
      // Đặt blog đầu tiên làm bài nổi bật
      if (publishedBlogs.length > 0) {
        setFeaturedBlog(publishedBlogs[0]);
        // Đặt các blog còn lại cho phần Cập nhật mới nhất
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
      const response = await apiUser.get('/user/courses', { params: { isPublished: true, limit: 3 } });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getAllDocuments({ limit: 20 });
      const docs = (response.data || [])
        .filter(doc => doc.status === 'published' && !doc.isDeleted)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 4);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return t.common.noDate;
    return new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
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
              {t.home.welcomeBadge}
            </div>

            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white leading-tight">
              {t.home.heroTitle}{" "}
              <span className="font-semibold text-blue-200">
                {t.home.heroHighlight}{" "}
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto lg:mx-0">
              {t.home.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 ">
              <Link href="/blog">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
                {t.home.startReading}
              </button>
              </Link>
              <Link href="/courses">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-10 rounded-md px-8 border-white/30 text-white hover:bg-white/10 hover:text-white text-base">
                {t.home.exploreCourses}
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
                {t.home.heroQuote}
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
                {t.home.featuredInsights}
              </h2>
              <p className="text-muted-foreground mt-2 ">
                {t.home.featuredSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 text-primary font-medium cursor-pointer">
              <Link href="/blog">
                <button className="inline-flex items-center gap-2 hover:cursor-pointer">
                  {t.home.viewAllBlog}
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
              category={featuredBlog.category?.name || t.common.uncategorized}
              date={formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}
              title={featuredBlog.title}
              description={featuredBlog.description}
            author={featuredBlog.author?.fullName || t.common.unknown}
            />
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">{t.home.noFeaturedBlog}</p>
            </div>
          )}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-3xl mb-8 text-foreground text-center">
            {t.home.latestUpdate}
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.home.loadingBlogs}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.home.noBlogsYet}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  id={blog._id}
                  image={blog.image}
                  images={blog.images}
                  category={blog.category?.name || t.common.uncategorized}
                  date={formatDate(blog.publishedAt || blog.createdAt)}
                  title={blog.title}
                  description={blog.description}
                  author={blog.author?.fullName || t.common.unknown}
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
                    {t.home.popularDocuments}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {t.home.mostViewed}
                  </p>
                </div>
                <div>
                  <Link href="/documents">
                    <button className="text-sm font-medium hover:cursor-pointer">{t.home.viewAll}</button>
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Link>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <TopDocs
                      key={doc._id}
                      id={doc._id}
                      category={doc.category?.name || t.common.general}
                      title={doc.title}
                      description={doc.description || t.blogCard.noDescription}
                      downloaded={doc.downloads || 0}
                      views={doc.views || 0}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8 col-span-2">{t.home.noDocuments}</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="flex  justify-between items-end mb-8">
                <div className="">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                    {t.home.recommendedCourses}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {t.home.topRated}{" "}
                  </p>
                </div>
                <Link href="/courses">
                  <button className="text-sm font-medium hover:cursor-pointer">{t.home.viewAll}</button>
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
                  <p className="text-muted-foreground text-center py-8">{t.home.noCourses}</p>
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
              {t.home.ctaTitle}
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-blue-100">
              {t.home.ctaDescription}
            </p>
            <Link href="/auth">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
                {t.home.ctaButton}
              </button>
            </Link>
          </div>
        </section>
      )}
    </Layout>
  );
};
export default HomePage;
