import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Pagination from "../shared/Pagination";
import { coursesAPI } from "@/services/api";
import apiUser from "@/services/apiUser";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiUser.get("/user/categories");
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll({ limit: 100 });
      setCourses(response.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleDelete = async (id) => {
    try {
      await coursesAPI.delete(id);
      setCourses(courses.filter(c => c._id !== id));
      setSelectedCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleSave = async (updatedCourse) => {
    try {
      const updateData = {
        title: updatedCourse.title,
        instructor: updatedCourse.instructor,
        category: updatedCourse.category?._id || updatedCourse.category || null,
        level: updatedCourse.level?.toLowerCase() || updatedCourse.level,
        courseUrl: updatedCourse.courseUrl,
        description: updatedCourse.description,
        duration: updatedCourse.duration,
        isPublished: updatedCourse.isPublished || false,
      };
      const response = await coursesAPI.update(updatedCourse._id, updateData);
      setCourses(courses.map(c => c._id === updatedCourse._id ? response.data : c));
      if (selectedCourse?._id === updatedCourse._id) setSelectedCourse(response.data);
      setEditCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleAdd = async (data) => {
    if (!data.title?.trim() || !data.instructor?.trim() || !data.courseUrl?.trim()) {
      alert("Please fill in all required fields (Title, Instructor, Course URL)");
      return;
    }
    try {
      const slug = data.title.toLowerCase().replace(/\s+/g, "-");
      const response = await coursesAPI.create({ 
        ...data,
        level: data.level.toLowerCase(), 
        slug 
      });
      setCourses([response.data, ...courses]);
      setShowAddForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  if (selectedCourse) {
    if (editCourse) {
      return (
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
                <label className="text-sm font-medium">Title *</label>
                <Input value={editCourse.title || ""} onChange={(e) => setEditCourse({...editCourse, title: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Course URL * (YouTube, Udemy, etc.)</label>
                <Input value={editCourse.courseUrl || ""} onChange={(e) => setEditCourse({...editCourse, courseUrl: e.target.value})} placeholder="https://..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea value={editCourse.description || ""} onChange={(e) => setEditCourse({...editCourse, description: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1 min-h-[80px]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Instructor *</label>
                  <Input 
                    value={editCourse.instructor || ""} 
                    onChange={(e) => setEditCourse({...editCourse, instructor: e.target.value})} 
                    placeholder="Instructor name"
                    className="mt-1" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select 
                    value={editCourse.category?._id || editCourse.category || ""} 
                    onChange={(e) => setEditCourse({...editCourse, category: e.target.value})} 
                    className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1"
                  >
                    <option value="">No Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Level *</label>
                  <select value={editCourse.level || "beginner"} onChange={(e) => setEditCourse({...editCourse, level: e.target.value})} className="w-full border border-input rounded-md px-3 py-2 text-sm mt-1">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input value={editCourse.duration || ""} onChange={(e) => setEditCourse({...editCourse, duration: e.target.value})} placeholder="e.g., 8 hours" className="mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="edit-published"
                  checked={editCourse.isPublished || false}
                  onChange={(e) => setEditCourse({...editCourse, isPublished: e.target.checked})}
                  className="h-4 w-4"
                />
                <label htmlFor="edit-published" className="text-sm font-medium">Published (visible to users)</label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleSave(editCourse)} size="sm">Save Changes</Button>
                <Button variant="outline" onClick={() => { setSelectedCourse(null); setEditCourse(null); }} size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedCourse(null)} className="gap-2" size="sm">
          <ChevronRight className="h-4 w-4 rotate-180" /> Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{selectedCourse.title}</CardTitle>
            <CardDescription>{selectedCourse.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Course URL</p>
              <a href={selectedCourse.courseUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                {selectedCourse.courseUrl}
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-semibold">{selectedCourse.instructor || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge>{selectedCourse.category?.name || "Uncategorized"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <Badge className="capitalize">{selectedCourse.level || "beginner"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{selectedCourse.duration || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={selectedCourse.isPublished ? "default" : "secondary"}>
                  {selectedCourse.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button onClick={() => setEditCourse(selectedCourse)} size="sm" className="sm:w-auto">Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="sm:w-auto">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete Course?</AlertDialogTitle>
                  <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
                  <div className="flex gap-3 justify-end">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(selectedCourse._id)} className="bg-destructive">Delete</AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Courses ({filteredCourses.length})</h2>
        <Button className="gap-2 w-full sm:w-auto" size="sm" onClick={() => setShowAddForm(true)}>
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

      {showAddForm && (
        <Card className="bg-muted/30">
          <CardContent className="pt-4 md:pt-6">
            <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4">
              <Input placeholder="Course title *" id="course-title" />
              <Input placeholder="Course URL * (e.g., https://youtube.com/...)" id="course-url" />
              <textarea placeholder="Description" id="course-description" className="border border-input rounded-md px-3 py-2 text-sm min-h-[80px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Instructor name *" id="course-instructor" />
                <select id="course-category" className="border border-input rounded-md px-3 py-2 text-sm">
                  <option value="">No Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select id="course-level" className="border border-input rounded-md px-3 py-2 text-sm">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Duration (e.g., 8 hours)" id="course-duration" />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="add-published"
                  defaultChecked={false}
                  className="h-4 w-4"
                />
                <label htmlFor="add-published" className="text-sm font-medium">Published (visible to users)</label>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => {
                const data = {
                  title: document.getElementById("course-title")?.value || "",
                  courseUrl: document.getElementById("course-url")?.value || "",
                  description: document.getElementById("course-description")?.value || "",
                  instructor: document.getElementById("course-instructor")?.value || "",
                  category: document.getElementById("course-category")?.value || "",
                  level: document.getElementById("course-level")?.value || "beginner",
                  duration: document.getElementById("course-duration")?.value || "",
                  isPublished: document.getElementById("add-published")?.checked || false,
                };
                if (data.title && data.instructor && data.courseUrl) {
                  handleAdd(data);
                  document.getElementById("course-title").value = "";
                  document.getElementById("course-url").value = "";
                  document.getElementById("course-description").value = "";
                  document.getElementById("course-instructor").value = "";
                  document.getElementById("course-category").value = "";
                  document.getElementById("course-duration").value = "";
                }
              }}>Add Course</Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8 text-gray-500">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">No courses found</div>
        ) : (
          currentCourses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-all flex flex-col">
              <CardHeader>
                <CardTitle className="text-base line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="text-xs">
                  {course.instructor || 'Unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <Badge className="w-fit capitalize">{course.level || "beginner"}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{course.duration || "Self-paced"}</p>
                </div>
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
                        <AlertDialogAction onClick={() => handleDelete(course._id)} className="bg-destructive">Delete</AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!loading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCourses.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}
