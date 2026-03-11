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
import { useRoute } from "wouter";
import apiUser from "../services/apiUser";
import { useLanguage } from "../i18n/LanguageContext";

const OtherProfile = () => {
  const [, params] = useRoute("/other-profile/:id");
  const [activeTab, setActiveTab] = useState("Published Posts");
  const [profileData, setProfileData] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (params?.id) {
      fetchUserProfile();
    }
  }, [params?.id]);

  const fetchUserProfile = async () => {
    try {
      setContentLoading(true);
      const response = await apiUser.get(`/user/profile/${params.id}`);
      setProfileData(response.data.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const userData = profileData?.user || {};
  const stats = profileData?.stats || {};
  const blogs = profileData?.blogs || [];
  const documents = profileData?.documents || [];

  if (!contentLoading && !profileData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>{t.otherProfile.userNotFound}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative h-64 w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <OtherProfileCard userData={userData} stats={stats} />

            <Statistics stats={stats} />
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
                  {t.otherProfile.publishedPosts}
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
                  {t.otherProfile.uploadedDocs}
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
                  {t.otherProfile.courses}
                </button>
              </div>

              {activeTab === "Published Posts" && (
                contentLoading
                  ? <div className="rounded-xl border bg-card border-border p-8 text-center text-muted-foreground">{t.otherProfile.loadingPosts}</div>
                  : <MyPost blogs={blogs} />
              )}
              {activeTab === "Uploaded Docs" && (
                contentLoading
                  ? <div className="rounded-xl border bg-card border-border p-8 text-center text-muted-foreground">{t.otherProfile.loadingDocs}</div>
                  : <SavedDocs documents={documents} />
              )}
              {activeTab === "Courses" && <MyCourses />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OtherProfile;
