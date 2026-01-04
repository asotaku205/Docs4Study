import React, { useEffect } from "react";
import Layout from "../components/Layout";
import CardCourses from "../components/users/Courses/cardCourses";
import { useState } from "react";
const Courses = () => {
  const [activeTab, setActiveTab] = useState("All");
  const taps = ["All", "Development", "Design", "Marketing", "Business"];
  useEffect(() => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      }
  } ,[]);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  }
  const allCourses = [
    {
      id: 1,
      category: "Development",
      title: "Advanced Web Development",
      description: "Full stack journey with Node.js and React.",
      duration: "8",
      students: "120",
      price: "199",
      image: "library.png"
    },
    {
      id: 2,
      category: "Design",
      title: "UI/UX Design Mastery",
      description: "Become a pro in user interface and experience design.",
      duration: "6",
      students: "85",
      price: "149",
      image: "library.png"
    },
    {
      id: 3,
      category: "Marketing",
      title: "Digital Marketing 101",
      description: "Learn the fundamentals of digital marketing.",
      duration: "4",
      students: "200",
      price: "99",
      image: "library.png"
    },
    {
      id: 4,
      category: "Marketing",
      title: "Digital Marketing 101",
      description: "Learn the fundamentals of digital marketing.",
      duration: "4",
      students: "200",
      price: "99",
      image: "library.png"
    },
  ];
  const filteredCourses = activeTab === "All" ? allCourses : allCourses.filter(course => course.category === activeTab);

  return (
    <Layout>
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 space-y-4">
          <h1 className="text-4xl font-bold font-heading">Online Courses</h1>
          <p>
            Explore our wide range of courses designed to help you enhance your
            skills and knowledge across various subjects.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            {taps.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors ${
                  activeTab === tab
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary/30 text-primary-foreground hover:bg-primary/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">No courses available in this category.</p>
            ) : (
              filteredCourses.map((course) => (
                <CardCourses key={course.id} {...course} />
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
