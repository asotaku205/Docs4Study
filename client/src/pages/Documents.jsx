import React from "react";
import Layout from "../components/Layout";
import CardDocs from "../components/users/Documents/cardDocs";
import Searching from "../components/users/Searching";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useTabs } from "../hooks/useTabs";
import { useFilter } from "../hooks/useFilter";

const Documents = () => {
  
  const categories = [
    "All Documents",
    "Science",
    "History",
    "Computer Science",
    "Chemical",
    "Literature",
  ];

 
  const { activeTab: activeCategory, handleTabChange: handleCategoryClick } = useTabs("All Documents");


  const allDocs = [
    {
      id: 1,
      category: "Computer Science",
      title: "Introduction to Computer Science",
      description: "Comprehensive notes covering fundamental concepts in computer science.",
      downloads: "120",
      views: "450",
      level: "Beginner",
      type: "PDF",
    },
    {
      id: 2,
      category: "Science",
      title: "Advanced Mathematics",
      description: "In-depth study materials on calculus and linear algebra.",
      downloads: "95",
      views: "300",
      level: "Advanced",
      type: "PDF",
    },
    {
      id: 3,
      category: "History",
      title: "World History Overview",
      description: "A concise summary of major historical events worldwide.",
      downloads: "150",
      views: "600",
      level: "Intermediate",
      type: "DOCX",
    },
    {
      id: 4,
      category: "Science",
      title: "Physics Formulas Cheat Sheet",
      description: "Quick reference guide for essential physics formulas.",
      downloads: "80",
      views: "250",
      level: "Beginner",
      type: "PDF",
    },
    {
      id: 5,
      category: "Chemical",
      title: "Chemistry Lab Techniques",
      description: "Detailed notes on common laboratory techniques in chemistry.",
      downloads: "110",
      views: "400",
      level: "Intermediate",
      type: "PDF",
    },
    {
      id: 6,
      category: "Literature",
      title: "English Literature Analysis",
      description: "Critical analyses of classic English literature works.",
      downloads: "130",
      views: "500",
      level: "Advanced",
      type: "DOCX",
    }
  ];

  const filteredDocs = useFilter(allDocs, activeCategory, 'category', 'All');

  return (
    <Layout>
      <Searching
        title="Study Documents"
        description="Access thousands of study notes, cheat sheets, and research papers shared by the community."
      />

      <section className="py-12">
        <div className="container mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} />
                Filters
              </h3>
            </div>

            <div className="space-y-4">
              {/* Level Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Level
                </label>
                <select className="w-full mt-2 p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="mt-8 border-t pt-4">
                <label className="flex items-center gap-2 text-sm font-semibold mb-4">
                  Category
                </label>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`text-left text-sm px-3 py-2 rounded-md w-full transition-colors ${
                        activeCategory === category
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-muted-foreground">
                {filteredDocs.length} results found
              </h3>
              <select className="border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Sort by: Relevance</option>
                <option>Sort by: Most Downloaded</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredDocs.length === 0 ? (
                <p className="text-center text-muted-foreground col-span-full">
                  No documents available in this category.
                </p>
              ) : (
                filteredDocs.map((doc) => (
                  <CardDocs key={doc.id} {...doc} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Documents;
