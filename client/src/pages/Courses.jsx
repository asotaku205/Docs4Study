import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import CardCourses from "../components/users/Courses/cardCourses";
import TabButton from "../components/ui/TabButton";
import { useTabs } from "../hooks/useTabs";
import apiUser from "../services/apiUser";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  const tabs = ["All", ...categories.map(c => c.name)];
  const { activeTab, handleTabChange } = useTabs("All");

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
        params: { limit: 50, isPublished: true }
      });
      setCourses(response.data.data || []);
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 space-y-4">
          <h1 className="text-4xl font-bold font-heading">Online Courses</h1>
          <p>
            Explore our wide range of courses designed to help you enhance your
            skills and knowledge across various subjects.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {tabs.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => handleTabChange(tab)}
                variant="pill"
              >
                {tab}
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
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full">
                  No courses available in this category.
                </p>
              ) : (
                filteredCourses.map((course) => (
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
          )}
        </div>
      </section>
    </Layout>
  );
};
export default Courses;
