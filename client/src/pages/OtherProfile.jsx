import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MyCourses from "../components/users/Profile/MyCourses";
import Statistics from "../components/users/Profile/Statistics";
import OtherProfileCard from "../components/users/Profile/OtherProfileCard";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import SavedDocs from "../components/users/Profile/SavedDoc";
import MyPost from "../components/users/Profile/MyPost";

const OtherProfile = () => {
  const [activeTab, setActiveTab] = useState("Published Posts");

  const userData = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "Content Creator",
    badge: "Expert",
    joined: "Oct 2024",
    publishedPosts: 24,
    uploadedDocs: 15,
    coursesCreated: 3
  };

  return (
    <Layout>
      <div className="relative h-64 w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <OtherProfileCard userData={userData} />

            <Statistics />
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-6">
              <div className="inline-flex items-center text-muted-foreground bg-card border border-border p-1 w-full justify-start h-12 shadow-sm rounded-xl">
                <button
                  className={
                    activeTab === "Published Posts"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("Published Posts")}
                >
                  <FontAwesomeIcon icon={faPen} />
                  Published Posts
                </button>
                <button
                  className={
                    activeTab === "Uploaded Docs"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("Uploaded Docs")}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  Uploaded Docs
                </button>
                <button
                  className={
                    activeTab === "Courses"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("Courses")}
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  Courses
                </button>
              </div>

              {activeTab === "Published Posts" && <MyPost />}
              {activeTab === "Uploaded Docs" && <SavedDocs />}
              {activeTab === "Courses" && <MyCourses />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OtherProfile;
