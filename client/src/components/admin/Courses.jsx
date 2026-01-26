import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { coursesAPI } from "@/services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

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
        level: updatedCourse.level?.toLowerCase() || updatedCourse.level,
      };
      const response = await coursesAPI.update(updatedCourse._id, updateData);
      setCourses(courses.map(c => c._id === updatedCourse._id ? response.data : c));
      if (selectedCourse?._id === updatedCourse._id) setSelectedCourse(response.data);
      setEditCourse(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleAdd = async (title, instructor, level) => {
    if (!title.trim() || !instructor.trim()) return;
    try {
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const response = await coursesAPI.create({ 
        title, 
        instructor, 
        level: level.toLowerCase(), 
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
                if (title && instructor && level) {
                  handleAdd(title, instructor, level);
                  document.getElementById("course-title").value = "";
                  document.getElementById("course-instructor").value = "";
                  document.getElementById("course-level").value = "Beginner";
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
    </div>
  );
}
