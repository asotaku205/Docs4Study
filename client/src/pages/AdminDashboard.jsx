import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faFileAlt, 
  faBook, 
  faBlog, 
  faTags, 
  faUsers, 
  faCog,
  faBars,
  faXmark,
  faRightFromBracket,
  faGlobe
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/i18n/LanguageContext";
import Overview from "@/components/admin/Overview";
import Documents from "@/components/admin/Documents";
import Courses from "@/components/admin/Courses";
import BlogPosts from "@/components/admin/BlogPosts";
import Categories from "@/components/admin/Categories";
import Users from "@/components/admin/Users";
import Settings from "@/components/admin/Settings";

export default function AdminDashboard() {
  const { t, language, changeLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { icon: faChartLine, label: t("admin.dashboard"), id: "overview" },
    { icon: faFileAlt, label: t("admin.documents"), id: "documents" },
    { icon: faBook, label: t("admin.courses"), id: "courses" },
    { icon: faBlog, label: t("admin.blogPosts"), id: "blog" },
    { icon: faTags, label: t("admin.categories"), id: "categories" },
    { icon: faUsers, label: t("admin.users"), id: "users" },
    { icon: faCog, label: t("admin.settings"), id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed lg:relative w-64 bg-primary text-primary-foreground border-r border-primary/20 p-4 md:p-6 overflow-y-auto z-40 transition-transform ${
        sidebarOpen ? "translate-x-0 lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2 font-heading font-bold text-base md:text-lg">
            <FontAwesomeIcon icon={faChartLine} className="h-5 md:h-6 w-5 md:w-6" />
            <span className="hidden sm:inline">{t("admin.panelTitle")}</span>
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
              <span className="hidden sm:inline">{t("admin.exitAdmin")}</span>
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
                <h1 className="text-2xl md:text-3xl font-heading font-bold">{t("admin.controlTitle")}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">{t("admin.controlSubtitle")}</p>
              </div>
            </div>
            <button
              onClick={() => changeLanguage(language === 'en' ? 'vi' : 'en')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              title={t("admin.switchLang")}
            >
              <FontAwesomeIcon icon={faGlobe} className="h-4 w-4" />
              <span>{language === 'en' ? 'EN' : 'VI'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && <Overview />}
          {activeTab === "documents" && <Documents />}
          {activeTab === "courses" && <Courses />}
          {activeTab === "blog" && <BlogPosts />}
          {activeTab === "categories" && <Categories />}
          {activeTab === "users" && <Users />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}
