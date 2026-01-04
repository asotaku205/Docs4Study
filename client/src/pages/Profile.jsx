import React, { useEffect } from "react";
import Layout from "../components/Layout";
import MyCourses from "../components/users/Profile/MyCourses";
import ProfileCard from "../components/users/Profile/ProfileCard";
import Statistics from "../components/users/Profile/Statistics";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import SavedDocs from "../components/users/Profile/SavedDoc";

import MyPost from "../components/users/Profile/MyPost"; 
import { faGear } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("My Courses");

  return (
    <Layout>
      <div className="relative h-64 w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <ProfileCard />

            <Statistics />
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-6">
              <div className="inline-flex items-center text-muted-foreground bg-card border border-border p-1 w-full justify-start h-12 shadow-sm rounded-xl">
                <button
                  className={
                    activeTab === "My Courses"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("My Courses")}
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  My Courses
                </button>
                <button
                  className={
                    activeTab === "Saved Docs"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("Saved Docs")}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  Saved Docs
                </button>
                <button
                  className={
                    activeTab === "My Posts"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => setActiveTab("My Posts")}
                >
                  <FontAwesomeIcon icon={faPen} />
                  My Posts
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 ml-auto">
                  <FontAwesomeIcon icon={faGear} />
                </button>
              </div>

              {activeTab === "My Courses" && <MyCourses />}
              {activeTab === "Saved Docs" && <SavedDocs />}
              {activeTab === "My Posts" && <MyPost />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
