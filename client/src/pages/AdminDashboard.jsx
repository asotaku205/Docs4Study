import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faFileAlt, 
  faBook, 
  faBlog, 
  faPaperPlane, 
  faTags, 
  faUsers, 
  faCog,
  faBars,
  faXmark,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import Overview from "@/components/admin/Overview";
import Documents from "@/components/admin/Documents";
import Courses from "@/components/admin/Courses";
import BlogPosts from "@/components/admin/BlogPosts";
import Submissions from "@/components/admin/Submissions";
import Categories from "@/components/admin/Categories";
import Users from "@/components/admin/Users";
import Settings from "@/components/admin/Settings";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { icon: faChartLine, label: "Dashboard", id: "overview" },
    { icon: faFileAlt, label: "Documents", id: "documents" },
    { icon: faBook, label: "Courses", id: "courses" },
    { icon: faBlog, label: "Blog Posts", id: "blog" },
    { icon: faPaperPlane, label: "Submissions", id: "submissions" },
    { icon: faTags, label: "Categories", id: "categories" },
    { icon: faUsers, label: "Users", id: "users" },
    { icon: faCog, label: "Settings", id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed lg:relative w-64 bg-primary text-primary-foreground border-r border-primary/20 p-4 md:p-6 h-screen overflow-y-auto z-40 transition-transform ${
        sidebarOpen ? "translate-x-0 lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2 font-heading font-bold text-base md:text-lg">
            <FontAwesomeIcon icon={faChartLine} className="h-5 md:h-6 w-5 md:w-6" />
            <span className="hidden sm:inline">Admin Panel</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-foreground hover:bg-white/10 p-1 rounded"
          >
            <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === item.id ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="h-5 w-5 shrink-0" />
              <span className="font-medium hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 md:pt-6 border-t border-white/20">
          <Link href="/">
            <Button variant="ghost" className="w-full text-primary-foreground hover:bg-white/10 justify-start gap-2 text-sm md:text-base">
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-5 shrink-0" /> 
              <span className="hidden sm:inline">Exit Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 bg-card border-b border-border p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-foreground hover:bg-muted p-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Control</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Manage platform content & users</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && <Overview />}
          {activeTab === "documents" && <Documents />}
          {activeTab === "courses" && <Courses />}
          {activeTab === "blog" && <BlogPosts />}
          {activeTab === "submissions" && <Submissions />}
          {activeTab === "categories" && <Categories />}
          {activeTab === "users" && <Users />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}
