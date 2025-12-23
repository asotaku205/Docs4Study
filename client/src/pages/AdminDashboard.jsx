import { useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Overview from "@/components/admin/Overview";
import Documents from "@/components/admin/Documents";
import Courses from "@/components/admin/Courses";
import BlogPosts from "@/components/admin/BlogPosts";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen flex">
      <Sidebar activeTab={activeTab} onChangeTab={setActiveTab}/>
      <main className="flex-1 p-8">
        {activeTab === "overview" && <Overview />}
        {activeTab === "documents" && <Documents />}
        {activeTab === "courses" && <Courses />}
        {activeTab === "blog" && <BlogPosts />}
        {activeTab === "users" && <Users />}
      </main>
    </div>
  );
}
