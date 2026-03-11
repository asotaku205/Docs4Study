import Layout from "../components/Layout";
import Searching from "../components/users/Searching";
import { useState, useEffect } from "react";
import BlogCard from "../components/users/Blogs/blogCard";
import CardCourses from "../components/users/Courses/cardCourses";
import CardDocs from "../components/users/Documents/cardDocs";
import UserCard from "../components/users/UserCard";
import { searchService } from "../services/searchService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../i18n/LanguageContext";

const Search = () => {
  const { t, language } = useLanguage();
  const tabKeys = ["All", "Blogs", "Courses", "Documents", "Users"];
  const tabLabels = { All: t.search.all, Blogs: t.search.blogs, Courses: t.search.courses, Documents: t.search.documents, Users: t.search.users };
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ blogs: [], documents: [], courses: [], users: [] });
  const [totals, setTotals] = useState({ blogs: 0, documents: 0, courses: 0, users: 0 });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    if (q) setSearchQuery(q);
    const tab = params.get("tab");
    if (tab && tabKeys.includes(tab)) setActiveTab(tab);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults({ blogs: [], documents: [], courses: [], users: [] });
      setTotals({ blogs: 0, documents: 0, courses: 0, users: 0 });
      setHasSearched(false);
      return;
    }
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery, activeTab);
    }, 400);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab]);

  const performSearch = async (query, tab) => {
    if (!query.trim() || query.trim().length < 2) return;
    try {
      setLoading(true);
      setHasSearched(true);
      const typeMap = { All: "all", Blogs: "blogs", Courses: "courses", Documents: "documents", Users: "users" };
      const response = await searchService.search({
        q: query.trim(),
        type: typeMap[tab] || "all",
        limit: tab === "All" ? 6 : 12,
      });
      if (response.success) {
        setResults(response.data);
        setTotals(response.totals || { blogs: 0, documents: 0, courses: 0, users: 0 });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(window.location.search);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  };

  const formatDate = (date) => {
    if (!date) return t.searchPage.noDate;
    return new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { month: "short", day: "numeric", year: "numeric" });
  };

  const totalResults = totals.blogs + totals.documents + totals.courses + totals.users;

  const getTabCount = (tab) => {
    switch (tab) {
      case "All": return totalResults;
      case "Blogs": return totals.blogs;
      case "Courses": return totals.courses;
      case "Documents": return totals.documents;
      case "Users": return totals.users;
      default: return 0;
    }
  };

  const renderEmptyState = (type) => (
    <div className="text-center py-16">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-5xl text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground text-lg">
        {!hasSearched
          ? t.search.minChars
          : `${t.search.noResults.replace('{type}', type).replace('{query}', searchQuery)}`}
      </p>
      {hasSearched && (
        <p className="text-muted-foreground/60 text-sm mt-2">
          {t.search.tryDifferent}
        </p>
      )}
    </div>
  );

  const renderBlogResults = (blogs, showMax) => {
    const items = showMax ? blogs.slice(0, showMax) : blogs;
    if (items.length === 0) return renderEmptyState("blogs");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((blog) => (
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
    );
  };

  const renderCourseResults = (courses, showMax) => {
    const items = showMax ? courses.slice(0, showMax) : courses;
    if (items.length === 0) return renderEmptyState("courses");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((course) => (
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
    );
  };

  const renderDocumentResults = (documents, showMax) => {
    const items = showMax ? documents.slice(0, showMax) : documents;
    if (items.length === 0) return renderEmptyState("documents");
    return (
      <div className="space-y-4">
        {items.map((doc) => (
          <CardDocs
            key={doc._id}
            id={doc._id}
            title={doc.title}
            description={doc.description}
            downloads={doc.downloads || 0}
            views={doc.views || 0}
            type={doc.fileType?.toUpperCase() || "PDF"}
            category={doc.category?.name || t.common.uncategorized}
            fileSize={doc.fileSize || "N/A"}
          />
        ))}
      </div>
    );
  };

  const renderUserResults = (users, showMax) => {
    const items = showMax ? users.slice(0, showMax) : users;
    if (items.length === 0) return renderEmptyState("users");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((user) => (
          <UserCard
            key={user._id}
            id={user._id}
            name={user.fullName}
            email={user.email}
            avatar={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
            role={user.role === "admin" ? t.searchPage.admin : t.searchPage.student}
            badge={user.role === "admin" ? t.searchPage.admin : t.searchPage.member}
            joined={formatDate(user.createdAt)}
            courses={0}
            blogs="0"
          />
        ))}
      </div>
    );
  };

  const renderSectionHeader = (title, count, tabName) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-2xl font-semibold">
        {title}
        {hasSearched && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({count} {t.search.results})
          </span>
        )}
      </h3>
      {activeTab === "All" && count > 3 && (
        <button
          onClick={() => handleTabClick(tabName)}
          className="text-primary text-sm hover:underline font-medium"
        >
          {t.searchPage.viewAll}
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      <Searching
        title={t.search.title}
        description={t.search.description}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <section className="flex-1 flex flex-col py-6">
        <div className="container mx-auto px-4">
          {hasSearched && !loading && (
            <div className="mb-4">
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{totalResults}</span> {t.search.results}
                <span className="font-semibold text-primary">"{searchQuery}"</span>
              </p>
            </div>
          )}

          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground hover:bg-accent/80"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tabLabels[tab]}
                {hasSearched && (
                  <span className={`ml-1.5 text-xs ${activeTab === tab ? "text-white/80" : "text-muted-foreground/60"}`}>
                    {getTabCount(tab)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-20">
              <FontAwesomeIcon icon={faSpinner} className="text-4xl text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">{t.common.loading}</p>
            </div>
          )}

          {!loading && (
            <>
              {activeTab === "All" && (
                <div className="space-y-10">
                  {hasSearched ? (
                    <>
                      <div>
                        {renderSectionHeader(t.search.blogs, totals.blogs, "Blogs")}
                        {renderBlogResults(results.blogs, 3)}
                      </div>
                      <div>
                        {renderSectionHeader(t.search.courses, totals.courses, "Courses")}
                        {renderCourseResults(results.courses, 3)}
                      </div>
                      <div>
                        {renderSectionHeader(t.search.documents, totals.documents, "Documents")}
                        {renderDocumentResults(results.documents, 3)}
                      </div>
                      <div>
                        {renderSectionHeader(t.search.users, totals.users, "Users")}
                        {renderUserResults(results.users, 3)}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-6xl text-muted-foreground/20 mb-6" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t.searchPage.startTitle}</h3>
                      <p className="text-muted-foreground/60">
                        {t.searchPage.startDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Blogs" && (
                <div>{renderBlogResults(results.blogs)}</div>
              )}

              {activeTab === "Courses" && (
                <div>{renderCourseResults(results.courses)}</div>
              )}

              {activeTab === "Documents" && (
                <div>{renderDocumentResults(results.documents)}</div>
              )}

              {activeTab === "Users" && (
                <div>{renderUserResults(results.users)}</div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Search;
