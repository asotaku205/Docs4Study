import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { LayoutDashboard, FileText, BookOpen, Users, Settings, LogOut, Plus, Trash2, Edit, Eye, ChevronRight, Mail } from "lucide-react";
import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", joined: "Dec 1, 2024", courses: 5, status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "Dec 5, 2024", courses: 8, status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", joined: "Dec 10, 2024", courses: 2, status: "Inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", joined: "Dec 12, 2024", courses: 12, status: "Active" },
  ]);
  const [blogs, setBlogs] = useState([
    { id: 1, title: "Mastering React in 2025", author: "Sarah Jen", date: "Dec 15", views: 342, comments: 24, status: "Published" },
    { id: 2, title: "The Art of Minimalist UI Design", author: "Alex Design", date: "Dec 12", views: 156, comments: 12, status: "Published" },
    { id: 3, title: "Effective Study Techniques", author: "Dr. Study", date: "Dec 10", views: 89, comments: 8, status: "Draft" },
  ]);
  const [documents, setDocuments] = useState([
    { id: 1, title: "Calculus I Cheatsheet", category: "Math", views: 1205, downloads: 340, fileSize: "2.4 MB" },
    { id: 2, title: "Intro to Psychology", category: "Science", views: 850, downloads: 120, fileSize: "1.8 MB" },
    { id: 3, title: "Organic Chemistry", category: "Science", views: 2100, downloads: 890, fileSize: "3.2 MB" },
  ]);
  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced Web Dev", instructor: "Alex Code", students: 245, revenue: "$12,250", level: "Advanced" },
    { id: 2, title: "UI/UX Fundamentals", instructor: "Design Pro", students: 189, revenue: "$9,450", level: "Beginner" },
    { id: 3, title: "Data Science 101", instructor: "Data Expert", students: 156, revenue: "$7,800", level: "Intermediate" },
  ]);
  
  const [editUser, setEditUser] = useState(null);
  const [editBlog, setEditBlog] = useState(null);
  const [editDoc, setEditDoc] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);

  // Delete handlers
  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setSelectedUser(null);
  };

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id));
    setSelectedBlog(null);
  };

  const handleDeleteDoc = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
    setSelectedDoc(null);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
    setSelectedCourse(null);
  };

  // Save handlers
  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (selectedUser?.id === updatedUser.id) setSelectedUser(updatedUser);
    setEditUser(null);
  };

  const handleSaveBlog = (updatedBlog) => {
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b));
    if (selectedBlog?.id === updatedBlog.id) setSelectedBlog(updatedBlog);
    setEditBlog(null);
  };

  const handleSaveDoc = (updatedDoc) => {
    setDocuments(documents.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    if (selectedDoc?.id === updatedDoc.id) setSelectedDoc(updatedDoc);
    setEditDoc(null);
  };

  const handleSaveCourse = (updatedCourse) => {
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    if (selectedCourse?.id === updatedCourse.id) setSelectedCourse(updatedCourse);
    setEditCourse(null);
  };

  // Add handlers
  const handleAddDoc = (title, category) => {
    const newDoc = { id: documents.length + 1, title, category, views: 0, downloads: 0, fileSize: "0 MB" };
    setDocuments([...documents, newDoc]);
    setShowAddForm(null);
  };

  const handleAddCourse = (title, instructor, level) => {
    const newCourse = { id: courses.length + 1, title, instructor, students: 0, revenue: "$0", level };
    setCourses([...courses, newCourse]);
    setShowAddForm(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white border-r border-gray-800 p-6 fixed h-screen overflow-y-auto left-0 top-0 z-50">
        <div className="flex items-center gap-2 mb-12 font-bold text-lg">
          <LayoutDashboard className="h-6 w-6" />
          Admin Panel
        </div>
        
        <nav className="space-y-2">
          {[
            { icon: LayoutDashboard, label: "Dashboard", id: "overview" },
            { icon: FileText, label: "Documents", id: "documents" },
            { icon: BookOpen, label: "Courses", id: "courses" },
            { icon: FileText, label: "Blog Posts", id: "blog" },
            { icon: Users, label: "Users", id: "users" },
            { icon: Settings, label: "Settings", id: "settings" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSelectedUser(null); setSelectedBlog(null); setSelectedDoc(null); setSelectedCourse(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-700">
          <Link href="/">
            <Button variant="ghost" className="w-full text-white hover:bg-gray-800 justify-start gap-2">
              <LogOut className="h-4 w-4" /> Exit Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 w-full">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold">Admin Control Center</h1>
          <p className="text-gray-500">Manage your platform content and users</p>
        </header>

        <div className="p-8 w-full max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue", value: "$24,580", change: "+12.5%", icon: "📊" },
                  { label: "Active Users", value: users.length.toString(), change: "+3.2%", icon: "👥" },
                  { label: "Total Documents", value: documents.length.toString(), change: "+18%", icon: "📄" },
                  { label: "Courses", value: courses.length.toString(), change: "+2%", icon: "📚" },
                ].map((kpi, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">{kpi.label}</p>
                          <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                        </div>
                        <span className="text-2xl">{kpi.icon}</span>
                      </div>
                      <Badge className="mt-3 bg-green-100 text-green-800 hover:bg-green-100">{kpi.change}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
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
                    <CardTitle>Content Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={docChartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
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
            <div className="space-y-6">
              {!selectedDoc ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Manage Documents ({documents.length})</h2>
                    <Button className="gap-2" onClick={() => setShowAddForm("doc")}>
                      <Plus className="h-4 w-4" /> Upload Document
                    </Button>
                  </div>

                  {showAddForm === "doc" && (
                    <Card className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <Input placeholder="Document title" id="doc-title" />
                          <Input placeholder="Category (e.g., Math, Science)" id="doc-category" />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => {
                            const title = document.getElementById("doc-title")?.value || "";
                            const category = document.getElementById("doc-category")?.value || "";
                            if (title && category) handleAddDoc(title, category);
                          }}>Add Document</Button>
                          <Button variant="outline" onClick={() => setShowAddForm(null)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b border-gray-200">
                            <tr>
                              <th className="text-left py-3 font-semibold">Title</th>
                              <th className="text-left py-3 font-semibold">Category</th>
                              <th className="text-left py-3 font-semibold">Views</th>
                              <th className="text-left py-3 font-semibold">Downloads</th>
                              <th className="text-left py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map((doc) => (
                              <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 font-medium">{doc.title}</td>
                                <td className="py-4"><Badge variant="secondary">{doc.category}</Badge></td>
                                <td className="py-4">{doc.views}</td>
                                <td className="py-4">{doc.downloads}</td>
                                <td className="py-4 flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedDoc(doc)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setEditDoc(doc)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                      <div className="flex gap-3 justify-end">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteDoc(doc.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
              ) : editDoc ? (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setEditDoc(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Document</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input value={editDoc.title} onChange={(e) => setEditDoc({...editDoc, title: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Input value={editDoc.category} onChange={(e) => setEditDoc({...editDoc, category: e.target.value})} className="mt-1" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Views</label>
                          <Input type="number" value={editDoc.views} onChange={(e) => setEditDoc({...editDoc, views: parseInt(e.target.value)})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Downloads</label>
                          <Input type="number" value={editDoc.downloads} onChange={(e) => setEditDoc({...editDoc, downloads: parseInt(e.target.value)})} className="mt-1" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveDoc(editDoc)}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditDoc(null)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedDoc(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedDoc.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-semibold">{selectedDoc.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">File Size</p>
                          <p className="font-semibold">{selectedDoc.fileSize}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Views</p>
                          <p className="font-semibold">{selectedDoc.views}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Downloads</p>
                          <p className="font-semibold">{selectedDoc.downloads}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setEditDoc(selectedDoc)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteDoc(selectedDoc.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {!selectedCourse ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Manage Courses ({courses.length})</h2>
                    <Button className="gap-2" onClick={() => setShowAddForm("course")}>
                      <Plus className="h-4 w-4" /> New Course
                    </Button>
                  </div>

                  {showAddForm === "course" && (
                    <Card className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <Input placeholder="Course title" id="course-title" />
                          <Input placeholder="Instructor name" id="course-instructor" />
                          <select id="course-level" className="border border-input rounded-md px-3 py-2 text-sm">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => {
                            const title = document.getElementById("course-title")?.value || "";
                            const instructor = document.getElementById("course-instructor")?.value || "";
                            const level = document.getElementById("course-level")?.value || "";
                            if (title && instructor && level) handleAddCourse(title, instructor, level);
                          }}>Add Course</Button>
                          <Button variant="outline" onClick={() => setShowAddForm(null)}>Cancel</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-all">
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <CardDescription>{course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Students</p>
                            <p className="text-2xl font-bold">{course.students}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-xl font-bold text-gray-900">{course.revenue}</p>
                          </div>
                          <Badge>{course.level}</Badge>
                          <div className="flex gap-2 pt-3">
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedCourse(course)}>
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditCourse(course)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                <div className="flex gap-3 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteCourse(course.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : editCourse ? (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setEditCourse(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={editCourse.title} onChange={(e) => setEditCourse({...editCourse, title: e.target.value})} className="mt-1" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Instructor</label>
                          <Input value={editCourse.instructor} onChange={(e) => setEditCourse({...editCourse, instructor: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Level</label>
                          <select value={editCourse.level} onChange={(e) => setEditCourse({...editCourse, level: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1">
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Students</label>
                          <Input type="number" value={editCourse.students} onChange={(e) => setEditCourse({...editCourse, students: parseInt(e.target.value)})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Revenue</label>
                          <Input value={editCourse.revenue} onChange={(e) => setEditCourse({...editCourse, revenue: e.target.value})} className="mt-1" placeholder="$0" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveCourse(editCourse)}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditCourse(null)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedCourse(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedCourse.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Instructor</p>
                          <p className="font-semibold">{selectedCourse.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Level</p>
                          <Badge>{selectedCourse.level}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Students Enrolled</p>
                          <p className="font-semibold text-lg">{selectedCourse.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-semibold text-lg text-gray-900">{selectedCourse.revenue}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setEditCourse(selectedCourse)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCourse(selectedCourse.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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

          {/* Blog Tab */}
          {activeTab === "blog" && (
            <div className="space-y-6">
              {!selectedBlog ? (
                <>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Manage Blog Posts ({blogs.length})</h2>
                    <Button className="gap-2"><Plus className="h-4 w-4" /> New Post</Button>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="border-b border-gray-200">
                            <tr>
                              <th className="text-left py-3 font-semibold">Title</th>
                              <th className="text-left py-3 font-semibold">Author</th>
                              <th className="text-left py-3 font-semibold">Date</th>
                              <th className="text-left py-3 font-semibold">Views</th>
                              <th className="text-left py-3 font-semibold">Status</th>
                              <th className="text-left py-3 font-semibold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogs.map((post) => (
                              <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-4 font-medium">{post.title}</td>
                                <td className="py-4">{post.author}</td>
                                <td className="py-4">{post.date}</td>
                                <td className="py-4">{post.views}</td>
                                <td className="py-4">
                                  <Badge variant={post.status === "Published" ? "default" : "secondary"}>{post.status}</Badge>
                                </td>
                                <td className="py-4 flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedBlog(post)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setEditBlog(post)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                      <div className="flex gap-3 justify-end">
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteBlog(post.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
              ) : editBlog ? (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setEditBlog(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Blog Post</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input value={editBlog.title} onChange={(e) => setEditBlog({...editBlog, title: e.target.value})} className="mt-1" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Author</label>
                          <Input value={editBlog.author} onChange={(e) => setEditBlog({...editBlog, author: e.target.value})} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <select value={editBlog.status} onChange={(e) => setEditBlog({...editBlog, status: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1">
                            <option>Published</option>
                            <option>Draft</option>
                            <option>Scheduled</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <textarea className="w-full h-40 border border-input rounded-lg p-3 mt-1 resize-none" defaultValue="Blog content here..." />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => handleSaveBlog(editBlog)}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setEditBlog(null)}>Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedBlog(null)} className="gap-2">
                    <ChevronRight className="h-4 w-4 rotate-180" /> Back
                  </Button>
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedBlog.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Author</p>
                          <p className="font-semibold">{selectedBlog.author}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge variant={selectedBlog.status === "Published" ? "default" : "secondary"}>{selectedBlog.status}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Views</p>
                          <p className="font-semibold">{selectedBlog.views}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Comments</p>
                          <p className="font-semibold">{selectedBlog.comments}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={() => setEditBlog(selectedBlog)}>Edit</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBlog(selectedBlog.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">User Management ({users.length})</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 font-semibold">Name</th>
                          <th className="text-left py-3 font-semibold">Email</th>
                          <th className="text-left py-3 font-semibold">Joined</th>
                          <th className="text-left py-3 font-semibold">Status</th>
                          <th className="text-left py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 font-medium">{user.name}</td>
                            <td className="py-4">{user.email}</td>
                            <td className="py-4">{user.joined}</td>
                            <td className="py-4">
                              <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                            </td>
                            <td className="py-4">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} className="gap-1">
                                <Eye className="h-4 w-4" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
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
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

