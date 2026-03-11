import React, { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import Layout from "../components/Layout";
import MyCourses from "../components/users/Profile/MyCourses";
import ProfileCard from "../components/users/Profile/ProfileCard";
import Statistics from "../components/users/Profile/Statistics";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import SavedDocs from "../components/users/Profile/SavedDoc";
import MyPost from "../components/users/Profile/MyPost"; 
import Setting from "../components/users/Profile/Setting";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import apiUser from "../services/apiUser";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../i18n/LanguageContext";

const Profile = () => {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [activeTab, setActiveTab] = useState("My Courses");
  const [profileData, setProfileData] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const { user: authUser } = useAuth();
  const { t } = useLanguage();

  // Phản ứng khi tham số ?tab= thay đổi (ví dụ: từ link Cài đặt ở header)
  useEffect(() => {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [search]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Xóa query params khi click tab thủ công
    setLocation('/profile', { replace: true });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setContentLoading(true);
      const response = await apiUser.get('/user/profile');
      setProfileData(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setContentLoading(false);
    }
  };

  const userData = profileData?.user || authUser || {};
  const stats = profileData?.stats || {};
  const blogs = profileData?.blogs || [];
  const documents = profileData?.documents || [];

  return (
    <Layout>
      <div className="relative h-64 w-full bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-24 relative z-10 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-4 space-y-6">
            <ProfileCard 
              setActiveTab={setActiveTab}
              userData={userData}
            />

            <Statistics stats={stats} />
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
                  onClick={() => handleTabClick("My Courses")}
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  {t.profile.myCourses}
                </button>
                <button
                  className={
                    activeTab === "Saved Docs"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => handleTabClick("Saved Docs")}
                >
                  <FontAwesomeIcon icon={faFileLines} />
                  {t.profile.savedDocs}
                </button>
                <button
                  className={
                    activeTab === "My Posts"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2"
                  }
                  onClick={() => handleTabClick("My Posts")}
                >
                  <FontAwesomeIcon icon={faPen} />
                  {t.profile.myPosts}
                </button>
                <button
                  className={
                    activeTab === "Setting"
                      ? "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 ml-auto bg-primary text-primary-foreground"
                      : "inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg gap-2 ml-auto"
                  }
                  onClick={() => handleTabClick("Setting")}
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>
              </div>

              {activeTab === "My Courses" && <MyCourses />}
              {activeTab === "Saved Docs" && (
                contentLoading 
                  ? <div className="rounded-xl border bg-card border-border p-8 text-center text-muted-foreground">{t.profile.loadingDocs}</div>
                  : <SavedDocs documents={documents} />
              )}
              {activeTab === "My Posts" && (
                contentLoading
                  ? <div className="rounded-xl border bg-card border-border p-8 text-center text-muted-foreground">{t.profile.loadingPosts}</div>
                  : <MyPost blogs={blogs} />
              )}
              {activeTab === "Setting" && <Setting user={userData} onProfileUpdate={fetchProfile} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
