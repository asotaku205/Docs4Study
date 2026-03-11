import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import CardCourses from "../components/users/Courses/cardCourses";
import TabButton from "../components/ui/TabButton";
import Pagination from "../components/shared/Pagination";
import { useTabs } from "../hooks/useTabs";
import apiUser from "../services/apiUser";
import { useLanguage } from "../i18n/LanguageContext";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const tabs = ["All", ...categories.map(c => c.name)];
  const { activeTab, handleTabChange } = useTabs("All");
  const { t } = useLanguage();

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiUser.get("/user/categories");
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await apiUser.get("/user/courses", {
        params: { limit: 1000, isPublished: true }
      });
      setCourses(response.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    return activeTab === "All" 
      ? courses 
      : courses.filter(course => course.category?.name === activeTab);
  }, [activeTab, courses]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCourses.slice(startIndex, endIndex);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleTabChangeWithReset = (tab) => {
    handleTabChange(tab);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 space-y-4">
          <h1 className="text-4xl font-bold font-heading">{t.courses.title}</h1>
          <p>
            {t.courses.subtitle}
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => handleTabChangeWithReset(tab)}
                variant="pill"
              >
                {tab === "All" ? t.courses.all : tab}
              </TabButton>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.courses.loading}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedCourses.length === 0 ? (
                  <p className="text-center text-muted-foreground col-span-full">
                    {t.courses.noCourses}
                  </p>
                ) : (
                  paginatedCourses.map((course) => (
                    <CardCourses 
                      key={course._id} 
                      id={course._id}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      image={course.thumbnail}
                      level={course.level}
                    />
                  ))
                )}
              </div>

              {filteredCourses.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredCourses.length}
                  itemsPerPage={itemsPerPage}
                />
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};
export default Courses;
