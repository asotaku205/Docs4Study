import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { LayoutDashboard, FileText, BookOpen, Users, Settings, LogOut, Plus, Trash2, Edit, Eye, ChevronRight, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usersAPI, coursesAPI, documentsAPI, blogPostsAPI, ordersAPI } from "@/services/api";

const chartData = [
  { name: "Jan", revenue: 4000, users: 120 },
  { name: "Feb", revenue: 3000, users: 100 },
  { name: "Mar", revenue: 2000, users: 80 },
  { name: "Apr", revenue: 2780, users: 110 },
  { name: "May", revenue: 1890, users: 90 },
  { name: "Jun", revenue: 2390, users: 130 },
];

const docChartData = [
  { name: "Science", value: 240 },
  { name: "Math", value: 290 },
  { name: "History", value: 200 },
  { name: "English", value: 150 }
];

const COLORS = ["#1f2937", "#374151", "#6b7280", "#9ca3af"];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState({ users: false, blogs: false, documents: false, courses: false });
  const [stats, setStats] = useState({ users: 0, activeUsers: 0, courses: 0, documents: 0, revenue: 0 });
  
  const [editUser, setEditUser] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading({ users: true, blogs: true, documents: true, courses: true });
      
      const [usersRes, blogsRes, docsRes, coursesRes, activeUsersRes, ordersRes] = await Promise.all([
        usersAPI.getAll({ limit: 100 }),
        blogPostsAPI.getAll({ limit: 100 }),
        documentsAPI.getAll({ limit: 100 }),
        coursesAPI.getAll({ limit: 100 }),
        usersAPI.getAll({ limit: 1, isActive: true }),
        ordersAPI.getAll({ limit: 100 }),
      ]);

      setUsers(usersRes.data.data || []);
      setBlogs(blogsRes.data.data || []);
      setDocuments(docsRes.data.data || []);
      setCourses(coursesRes.data.data || []);
      
      // Calculate total revenue from orders
      const totalRevenue = ordersRes.data.data?.reduce((sum, order) => {
        const amount = typeof order.amount === 'string' 
          ? parseFloat(order.amount.replace(/[^0-9.]/g, '')) 
          : (order.amount || 0);
        return sum + amount;
      }, 0) || 0;
      
      setStats({
        users: usersRes.data.pagination?.total || 0,
        activeUsers: activeUsersRes.data.pagination?.total || 0,
        courses: coursesRes.data.pagination?.total || 0,
        documents: docsRes.data.pagination?.total || 0,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading({ users: false, blogs: false, documents: false, courses: false });
    }
  };

  const filteredBlogs = blogs.filter(b => 
    (b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     b.author?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const filteredDocs = documents.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUsers = users.filter(u => 
    (u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteUser = async (id) => {
    try {
      await usersAPI.delete(id);
      setUsers(users.filter(u => u._id !== id));
      setSelectedUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await blogPostsAPI.delete(id);
      setBlogs(blogs.filter(b => b._id !== id));
      setSelectedBlog(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete blog post");
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await documentsAPI.delete(id);
      setDocuments(documents.filter(d => d._id !== id));
      setSelectedDoc(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete document");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await coursesAPI.delete(id);
      setCourses(courses.filter(c => c._id !== id));
      setSelectedCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await usersAPI.update(updatedUser._id, updatedUser);
      setUsers(users.map(u => u._id === updatedUser._id ? response.data : u));
      if (selectedUser?._id === updatedUser._id) setSelectedUser(response.data);
      setEditUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleSaveBlog = async (updatedBlog) => {
    try {
      const response = await blogPostsAPI.update(updatedBlog._id, updatedBlog);
      setBlogs(blogs.map(b => b._id === updatedBlog._id ? response.data : b));
      if (selectedBlog?._id === updatedBlog._id) setSelectedBlog(response.data);
      setEditBlog(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update blog post");
    }
  };

  const handleSaveDoc = async (updatedDoc) => {
    try {
      const response = await documentsAPI.update(updatedDoc._id, updatedDoc);
      setDocuments(documents.map(d => d._id === updatedDoc._id ? response.data : d));
      if (selectedDoc?._id === updatedDoc._id) setSelectedDoc(response.data);
      setEditDoc(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update document");
    }
  };

  const handleSaveCourse = async (updatedCourse) => {
    try {
      const response = await coursesAPI.update(updatedCourse._id, updatedCourse);
      setCourses(courses.map(c => c._id === updatedCourse._id ? response.data : c));
      if (selectedCourse?._id === updatedCourse._id) setSelectedCourse(response.data);
      setEditCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleAddDoc = async (title, category) => {
    if (!title.trim() || !category.trim()) return;
    try {
      const response = await documentsAPI.create({ 
        title, 
        category, 
        content: "No content yet" 
      });
      setDocuments([response.data, ...documents]);
      setShowAddForm(null);
      document.getElementById("doc-title").value = "";
      document.getElementById("doc-category").value = "";
      fetchAllData(); // Refresh data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add document";
      const missing = err.response?.data?.missing;
      alert(missing ? `${errorMsg}\nMissing: ${missing.join(", ")}` : errorMsg);
      console.error("Error adding document:", err.response?.data || err);
    }
  };

  const handleAddCourse = async (title, instructor, level) => {
    if (!title.trim() || !instructor.trim()) return;
    try {
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const response = await coursesAPI.create({ 
        title, 
        instructor, // Backend sẽ xử lý string hoặc ObjectId
        level: level.toLowerCase(), // Convert to lowercase for enum
        slug 
      });
      setCourses([response.data, ...courses]);
      setShowAddForm(null);
      document.getElementById("course-title").value = "";
      document.getElementById("course-instructor").value = "";
      document.getElementById("course-level").value = "Beginner";
      fetchAllData(); // Refresh data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add course";
      const missing = err.response?.data?.missing;
      alert(missing ? `${errorMsg}\nMissing: ${missing.join(", ")}` : errorMsg);
      console.error("Error adding course:", err.response?.data || err);
    }
  };

  const handleAddBlog = async (title, author, status) => {
    if (!title.trim() || !author.trim()) return;
    try {
      const response = await blogPostsAPI.create({ 
        title, 
        author, // Backend sẽ xử lý string hoặc ObjectId
        status: status.toLowerCase(), // Convert to lowercase for enum
        content: "No content yet" 
      });
      setBlogs([response.data, ...blogs]);
      setShowAddForm(null);
      document.getElementById("blog-title").value = "";
      document.getElementById("blog-author").value = "";
      document.getElementById("blog-status").value = "Published";
      fetchAllData(); // Refresh data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to add blog post";
      const missing = err.response?.data?.missing;
      alert(missing ? `${errorMsg}\nMissing: ${missing.join(", ")}` : errorMsg);
      console.error("Error adding blog post:", err.response?.data || err);
    }
  };

  const handleApproveSubmission = (id) => {
    const submission = submissions.find(s => s.id === id);
    if (submission) {
      const newBlog = { 
        title: submission.title, 
        author: submission.author, 
        status: "Published",
        content: submission.content
      };
      handleAddBlog(newBlog.title, newBlog.author, newBlog.status);
      setSubmissions(submissions.map(s => s.id === id ? {...s, status: "approved"} : s));
      setSelectedSubmission(null);
    }
  };

  const handleRejectSubmission = (id) => {
    setSubmissions(submissions.map(s => s.id === id ? {...s, status: "rejected"} : s));
    setSelectedSubmission(null);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
    { icon: FileText, label: "Documents", id: "documents" },
    { icon: BookOpen, label: "Courses", id: "courses" },
    { icon: FileText, label: "Blog Posts", id: "blog" },
    { icon: FileText, label: "Submissions", id: "submissions" },
    { icon: Users, label: "Users", id: "users" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative w-64 bg-primary text-primary-foreground border-r border-primary/20 p-4 md:p-6 h-screen overflow-y-auto z-40 transition-transform ${
        sidebarOpen ? "translate-x-0 lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2 font-heading font-bold text-base md:text-lg">
            <LayoutDashboard className="h-5 md:h-6 w-5 md:w-6" />
            <span className="hidden sm:inline">Admin Panel</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-foreground hover:bg-white/10 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="space-y-2 mb-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                setActiveTab(item.id); 
                setSelectedUser(null); 
                setSelectedBlog(null); 
                setSelectedDoc(null); 
                setSelectedCourse(null);
                setSelectedSubmission(null);
                setSearchQuery("");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                activeTab === item.id ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-4 md:pt-6 border-t border-white/20">
          <Link href="/">
            <Button variant="ghost" className="w-full text-primary-foreground hover:bg-white/10 justify-start gap-2 text-sm md:text-base">
              <LogOut className="h-4 w-5 flex-shrink-0" /> 
              <span className="hidden sm:inline">Exit Admin</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-card border-b border-border p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-foreground hover:bg-muted p-2 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">Admin Control</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Manage platform content & users</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, change: "+12.5%", icon: "📊" },
                  { label: "Users", value: stats.users.toString(), change: "+3.2%", icon: "👥" },
                  { label: "Documents", value: stats.documents.toString(), change: "+18%", icon: "📄" },
                  { label: "Courses", value: stats.courses.toString(), change: "+2%", icon: "📚" },
                ].map((kpi, i) => (
                  <Card key={i} className="p-3 md:p-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-xl md:text-2xl font-bold mt-1">{kpi.value}</p>
                      </div>
                      <span className="text-lg md:text-2xl text-center">{kpi.icon}</span>
                    </div>
                    <Badge className="mt-2 text-xs bg-green-100 text-green-800 hover:bg-green-100">{kpi.change}</Badge>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#1f2937" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={docChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                          {docChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-4 md:space-y-6">
              {!selectedDoc ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                    <h2 className="text-xl md:text-2xl font-bold">Documents ({filteredDocs.length})</h2>
                    <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setShowAddForm("doc")}>
                      <Plus className="h-4 w-4" /> Upload
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search documents..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {showAddForm === "doc" && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4 md:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                          <Input placeholder="Document title" id="doc-title" />
                          <Input placeholder="Category" id="doc-category" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => {
                            const title = document.getElementById("doc-title")?.value || "";
                            const category = document.getElementById("doc-category")?.value || "";
                            if (title && category) handleAddDoc(title, category);
                          }}>Add Document</Button>
                          <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {loading.documents ? (
                      <div className="text-center py-8 text-gray-500">Loading documents...</div>
                    ) : filteredDocs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No documents found</div>
                    ) : (
                      filteredDocs.map((doc) => (
                        <Card key={doc._id} className="hover:shadow-md transition-all">
                          <CardContent className="pt-4">
                            <p className="font-semibold text-sm mb-2">{doc.title}</p>
                            <div className="space-y-2 text-xs mb-3">
                              <div className="flex justify-between"><span className="text-muted-foreground">Category:</span> <Badge variant="secondary">{doc.category || "N/A"}</Badge></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Views:</span> <span>{doc.views || 0}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Downloads:</span> <span>{doc.downloads || 0}</span></div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedDoc(doc)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setSelectedDoc(doc); setEditDoc(doc); }}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive flex-1">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                  <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteDoc(doc._id)} className="bg-destructive">Delete</AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Desktop Table View */}
                  <Card className="hidden md:block overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold">Title</th>
                              <th className="text-left px-4 py-3 font-semibold">Category</th>
                              <th className="text-left px-4 py-3 font-semibold">Views</th>
                              <th className="text-left px-4 py-3 font-semibold">Downloads</th>
                              <th className="text-left px-4 py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading.documents ? (
                              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredDocs.length === 0 ? (
                              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No documents found</td></tr>
                            ) : (
                              filteredDocs.map((doc) => (
                                <tr key={doc._id} className="border-b hover:bg-muted/30">
                                  <td className="px-4 py-3 font-medium">{doc.title}</td>
                                  <td className="px-4 py-3"><Badge variant="secondary">{doc.category || "N/A"}</Badge></td>
                                  <td className="px-4 py-3">{doc.views || 0}</td>
                                  <td className="px-4 py-3">{doc.downloads || 0}</td>
                                  <td className="px-4 py-3 flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(doc)}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedDoc(doc); setEditDoc(doc); }}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                        <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                        <div className="flex gap-3 justify-end">
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteDoc(doc._id)} className="bg-destructive">Delete</AlertDialogAction>
                                        </div>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : editDoc ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => { setSelectedDoc(null); setEditDoc(null); }} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Edit Document</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input value={editDoc.title || ""} onChange={(e) => setEditDoc({...editDoc, title: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Input value={editDoc.category || ""} onChange={(e) => setEditDoc({...editDoc, category: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Views</label>
                          <Input type="number" value={editDoc.views || 0} onChange={(e) => setEditDoc({...editDoc, views: parseInt(e.target.value) || 0})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Downloads</label>
                          <Input type="number" value={editDoc.downloads || 0} onChange={(e) => setEditDoc({...editDoc, downloads: parseInt(e.target.value) || 0})} className="mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveDoc(editDoc)} size="sm">Save Changes</Button>
                        <Button variant="outline" onClick={() => { setSelectedDoc(null); setEditDoc(null); }} size="sm">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedDoc(null)} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedDoc.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="font-semibold">{selectedDoc.category || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">File Size</p>
                          <p className="font-semibold">{selectedDoc.fileSize || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Views</p>
                          <p className="text-lg font-semibold">{selectedDoc.views || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Downloads</p>
                          <p className="text-lg font-semibold">{selectedDoc.downloads || 0}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button onClick={() => setEditDoc(selectedDoc)} size="sm" className="sm:w-auto">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="sm:w-auto">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                            <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDoc(selectedDoc._id)} className="bg-destructive">Delete</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Courses Tab - Similar structure, continuing with same pattern */}
          {activeTab === "courses" && (
            <div className="space-y-4 md:space-y-6">
              {!selectedCourse ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                    <h2 className="text-xl md:text-2xl font-bold">Courses ({filteredCourses.length})</h2>
                    <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setShowAddForm("course")}>
                      <Plus className="h-4 w-4" /> New Course
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search courses..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {showAddForm === "course" && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4 md:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
                          <Input placeholder="Course title" id="course-title" />
                          <Input placeholder="Instructor name" id="course-instructor" />
                          <select id="course-level" className="border border-input rounded-md px-3 py-2 text-sm">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => {
                            const title = document.getElementById("course-title")?.value || "";
                            const instructor = document.getElementById("course-instructor")?.value || "";
                            const level = document.getElementById("course-level")?.value || "";
                            if (title && instructor && level) handleAddCourse(title, instructor, level);
                          }}>Add Course</Button>
                          <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading.courses ? (
                      <div className="col-span-full text-center py-8 text-gray-500">Loading courses...</div>
                    ) : filteredCourses.length === 0 ? (
                      <div className="col-span-full text-center py-8 text-gray-500">No courses found</div>
                    ) : (
                      filteredCourses.map((course) => (
                        <Card key={course._id} className="hover:shadow-lg transition-all flex flex-col">
                          <CardHeader>
                            <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                            <CardDescription className="text-xs">{course.instructor}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 flex-1 flex flex-col">
                            <div>
                              <p className="text-xs text-muted-foreground">Students</p>
                              <p className="text-xl font-bold">{course.students || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Revenue</p>
                              <p className="text-lg font-bold text-primary">{course.revenue || "$0"}</p>
                            </div>
                            <Badge className="w-fit">{course.level || "N/A"}</Badge>
                            <div className="flex gap-2 pt-3 mt-auto">
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedCourse(course)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setSelectedCourse(course); setEditCourse(course); }}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                                  <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                  <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteCourse(course._id)} className="bg-destructive">Delete</AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              ) : editCourse ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => { setSelectedCourse(null); setEditCourse(null); }} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Edit Course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={editCourse.title || ""} onChange={(e) => setEditCourse({...editCourse, title: e.target.value})} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Instructor</label>
                          <Input value={editCourse.instructor || ""} onChange={(e) => setEditCourse({...editCourse, instructor: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Level</label>
                          <select value={editCourse.level || "Beginner"} onChange={(e) => setEditCourse({...editCourse, level: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveCourse(editCourse)} size="sm">Save Changes</Button>
                        <Button variant="outline" onClick={() => { setSelectedCourse(null); setEditCourse(null); }} size="sm">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedCourse.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Instructor</p>
                          <p className="font-semibold">{selectedCourse.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Level</p>
                          <Badge>{selectedCourse.level || "N/A"}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Students</p>
                          <p className="text-lg font-semibold">{selectedCourse.students || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-lg font-semibold text-primary">{selectedCourse.revenue || "$0"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button onClick={() => { setSelectedCourse(selectedCourse); setEditCourse(selectedCourse); }} size="sm" className="sm:w-auto">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="sm:w-auto">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                            <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(selectedCourse._id)} className="bg-destructive">Delete</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Blog Tab - Continuing with same pattern */}
          {activeTab === "blog" && (
            <div className="space-y-4 md:space-y-6">
              {!selectedBlog ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                    <h2 className="text-xl md:text-2xl font-bold">Blog Posts ({filteredBlogs.length})</h2>
                    <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setShowAddForm("blog")}>
                      <Plus className="h-4 w-4" /> New Post
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search blog posts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {showAddForm === "blog" && (
                    <Card className="bg-muted/30">
                      <CardContent className="pt-4 md:pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                          <Input placeholder="Blog title" id="blog-title" />
                          <Input placeholder="Author name" id="blog-author" />
                        </div>
                        <select id="blog-status" className="w-full border border-input rounded-md px-3 py-2 text-sm mb-4">
                          <option>Published</option>
                          <option>Draft</option>
                          <option>Scheduled</option>
                        </select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => {
                            const title = document.getElementById("blog-title")?.value || "";
                            const author = document.getElementById("blog-author")?.value || "";
                            const status = document.getElementById("blog-status")?.value || "";
                            if (title && author && status) handleAddBlog(title, author, status);
                          }}>Add Blog</Button>
                          <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="md:hidden space-y-3">
                    {loading.blogs ? (
                      <div className="text-center py-8 text-gray-500">Loading blog posts...</div>
                    ) : filteredBlogs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No blog posts found</div>
                    ) : (
                      filteredBlogs.map((post) => (
                        <Card key={post._id} className="hover:shadow-md transition-all">
                          <CardContent className="pt-4">
                            <p className="font-semibold text-sm mb-2">{post.title}</p>
                            <div className="space-y-2 text-xs mb-3">
                              <div className="flex justify-between"><span className="text-muted-foreground">Author:</span> <span>{post.author}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Views:</span> <span>{post.views || 0}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span> <Badge variant={post.status === "Published" ? "default" : "secondary"} className="text-xs">{post.status || "Draft"}</Badge></div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedBlog(post)}>
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setSelectedBlog(post); setEditBlog(post); }}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive flex-1">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                                  <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                  <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteBlog(post._id)} className="bg-destructive">Delete</AlertDialogAction>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <Card className="hidden md:block overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold">Title</th>
                              <th className="text-left px-4 py-3 font-semibold">Author</th>
                              <th className="text-left px-4 py-3 font-semibold">Views</th>
                              <th className="text-left px-4 py-3 font-semibold">Status</th>
                              <th className="text-left px-4 py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading.blogs ? (
                              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredBlogs.length === 0 ? (
                              <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No blog posts found</td></tr>
                            ) : (
                              filteredBlogs.map((post) => (
                                <tr key={post._id} className="border-b hover:bg-muted/30">
                                  <td className="px-4 py-3 font-medium">{post.title}</td>
                                  <td className="px-4 py-3">{post.author}</td>
                                  <td className="px-4 py-3">{post.views || 0}</td>
                                  <td className="px-4 py-3"><Badge variant={post.status === "Published" ? "default" : "secondary"}>{post.status || "Draft"}</Badge></td>
                                  <td className="px-4 py-3 flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedBlog(post)}><Eye className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedBlog(post); setEditBlog(post); }}><Edit className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                                        <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                        <div className="flex gap-3 justify-end">
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDeleteBlog(post._id)} className="bg-destructive">Delete</AlertDialogAction>
                                        </div>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : editBlog ? (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => { setSelectedBlog(null); setEditBlog(null); }} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Edit Blog Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={editBlog.title || ""} onChange={(e) => setEditBlog({...editBlog, title: e.target.value})} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Author</label>
                          <Input value={editBlog.author || ""} onChange={(e) => setEditBlog({...editBlog, author: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <select value={editBlog.status || "Draft"} onChange={(e) => setEditBlog({...editBlog, status: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1">
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Scheduled</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Views</label>
                        <Input type="number" value={editBlog.views || 0} onChange={(e) => setEditBlog({...editBlog, views: parseInt(e.target.value) || 0})} className="mt-1" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveBlog(editBlog)} size="sm">Save Changes</Button>
                        <Button variant="outline" onClick={() => { setSelectedBlog(null); setEditBlog(null); }} size="sm">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedBlog(null)} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedBlog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Author</p>
                          <p className="font-semibold">{selectedBlog.author}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={selectedBlog.status === "Published" ? "default" : "secondary"}>{selectedBlog.status || "Draft"}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Views</p>
                          <p className="text-lg font-semibold">{selectedBlog.views || 0}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Comments</p>
                          <p className="text-lg font-semibold">{selectedBlog.comments || 0}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button onClick={() => { setSelectedBlog(selectedBlog); setEditBlog(selectedBlog); }} size="sm" className="sm:w-auto">Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="sm:w-auto">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                            <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBlog(selectedBlog._id)} className="bg-destructive">Delete</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Pending Submissions ({submissions.filter(s => s.status === "pending").length})</h2>
              
              {submissions.filter(s => s.status === "pending").length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending submissions</div>
              ) : (
                <>
                  <div className="md:hidden space-y-3">
                    {submissions.filter(s => s.status === "pending").map((sub) => (
                      <Card key={sub.id} className="hover:shadow-md transition-all">
                        <CardContent className="pt-4">
                          <p className="font-semibold text-sm mb-2">{sub.title}</p>
                          <div className="space-y-2 text-xs mb-3">
                            <div className="flex justify-between"><span className="text-muted-foreground">Author:</span> <span>{sub.author}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Category:</span> <Badge variant="secondary" className="text-xs">{sub.category}</Badge></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Submitted:</span> <span>{sub.submittedDate}</span></div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex-1" onClick={() => setSelectedSubmission(sub)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive flex-1">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Reject?</AlertDialogTitle>
                                <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRejectSubmission(sub.id)} className="bg-destructive">Reject</AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="hidden md:block overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold">Title</th>
                              <th className="text-left px-4 py-3 font-semibold">Author</th>
                              <th className="text-left px-4 py-3 font-semibold">Category</th>
                              <th className="text-left px-4 py-3 font-semibold">Submitted</th>
                              <th className="text-left px-4 py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.filter(s => s.status === "pending").map((sub) => (
                              <tr key={sub.id} className="border-b hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">{sub.title}</td>
                                <td className="px-4 py-3">{sub.author}</td>
                                <td className="px-4 py-3"><Badge variant="secondary">{sub.category}</Badge></td>
                                <td className="px-4 py-3">{sub.submittedDate}</td>
                                <td className="px-4 py-3 flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedSubmission(sub)}><Eye className="h-4 w-4" /></Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogTitle>Reject?</AlertDialogTitle>
                                      <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                                      <div className="flex gap-3 justify-end">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRejectSubmission(sub.id)} className="bg-destructive">Reject</AlertDialogAction>
                                      </div>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {selectedSubmission && (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedSubmission(null)} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedSubmission.title}</CardTitle>
                      <CardDescription>By {selectedSubmission.author} • {selectedSubmission.submittedDate}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm text-muted-foreground">Category</p><Badge>{selectedSubmission.category}</Badge></div>
                        <div><p className="text-sm text-muted-foreground">Status</p><Badge variant="outline">{selectedSubmission.status}</Badge></div>
                      </div>
                      <div><p className="text-sm text-muted-foreground mb-2">Content</p><p className="text-sm leading-relaxed">{selectedSubmission.content}</p></div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => handleApproveSubmission(selectedSubmission.id)} size="sm" className="bg-green-600 hover:bg-green-700">Approve & Publish</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">Reject</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Reject this submission?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRejectSubmission(selectedSubmission.id)} className="bg-destructive">Reject</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4 md:space-y-6">
              {!selectedUser ? (
                <>
                  <h2 className="text-xl md:text-2xl font-bold">Users ({filteredUsers.length})</h2>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="md:hidden space-y-3">
                    {loading.users ? (
                      <div className="text-center py-8 text-gray-500">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No users found</div>
                    ) : (
                      filteredUsers.map((user) => (
                        <Card key={user._id} className="hover:shadow-md transition-all">
                          <CardContent className="pt-4">
                            <p className="font-semibold text-sm mb-2">{user.fullName}</p>
                            <div className="space-y-2 text-xs mb-3">
                              <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="truncate">{user.email}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Joined:</span> <span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Status:</span> <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">{user.isActive ? "Active" : "Inactive"}</Badge></div>
                            </div>
                            <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-3 w-3 mr-1" /> View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <Card className="hidden md:block overflow-hidden">
                    <CardContent className="pt-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold">Name</th>
                              <th className="text-left px-4 py-3 font-semibold">Email</th>
                              <th className="text-left px-4 py-3 font-semibold">Joined</th>
                              <th className="text-left px-4 py-3 font-semibold">Role</th>
                              <th className="text-left px-4 py-3 font-semibold">Status</th>
                              <th className="text-left px-4 py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading.users ? (
                              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                            ) : (
                              filteredUsers.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-muted/30">
                                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                                  <td className="px-4 py-3 text-xs">{user.email}</td>
                                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                                  <td className="px-4 py-3">{user.role}</td>
                                  <td className="px-4 py-3"><Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge></td>
                                  <td className="px-4 py-3">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} className="gap-1">
                                      <Eye className="h-4 w-4" /> View
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => setSelectedUser(null)} className="gap-2" size="sm">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedUser.fullName}</CardTitle>
                      <CardDescription>{selectedUser.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Joined</p>
                          <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={selectedUser.isActive ? "default" : "secondary"}>{selectedUser.isActive ? "Active" : "Inactive"}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="text-lg font-semibold">{selectedUser.role}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="text-lg font-semibold">{selectedUser.phone || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button size="sm" className="sm:w-auto">Send Message</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="sm:w-auto">Deactivate</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Deactivate User?</AlertDialogTitle>
                            <AlertDialogDescription>This user will no longer be able to access the platform.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { handleDeleteUser(selectedUser._id); }} className="bg-destructive">Deactivate</AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold">Platform Settings</h2>
              <Card>
                <CardHeader>
                  <CardTitle>General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Platform Name</label>
                    <Input className="mt-1" defaultValue="Docs4Study" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Support Email</label>
                    <Input className="mt-1" defaultValue="support@docs4study.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea className="w-full h-24 border border-input rounded-md p-3 text-sm mt-1 resize-none" defaultValue="The ultimate platform for learning and sharing educational content." />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
