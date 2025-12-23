import { useState } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Advanced Web Dev",
      instructor: "Alex Code",
      students: 245,
      revenue: "$12,250",
      level: "Advanced",
    },
    {
      id: 2,
      title: "UI/UX Fundamentals",
      instructor: "Design Pro",
      students: 189,
      revenue: "$9,450",
      level: "Beginner",
    },
  ]);

  const [viewMode, setViewMode] = useState("list");
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleAdd = (course) => {
    setCourses((prev) => [
      ...prev,
      { ...course, id: Date.now(), students: 0, revenue: "$0" },
    ]);
    setViewMode("list");
  };

  const handleSave = () => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === activeCourse.id ? activeCourse : c
      )
    );
    setViewMode("detail");
  };

  const handleDelete = () => {
    setCourses((prev) =>
      prev.filter((c) => c.id !== courseToDelete.id)
    );
    setCourseToDelete(null);
    setActiveCourse(null);
    setViewMode("list");
  };

  let content = null;

  if (viewMode === "add") {
    content = (
      <AddCourseForm
        onAdd={handleAdd}
        onCancel={() => setViewMode("list")}
      />
    );
  } else if (viewMode === "edit") {
    content = (
      <EditCourseForm
        course={activeCourse}
        onChange={setActiveCourse}
        onSave={handleSave}
        onCancel={() => setViewMode("detail")}
      />
    );
  } else if (viewMode === "detail") {
    content = (
      <CourseDetail
        course={activeCourse}
        onBack={() => setViewMode("list")}
        onEdit={() => setViewMode("edit")}
        onDelete={() => setCourseToDelete(activeCourse)}
      />
    );
  } else {
    content = (
      <CourseList
        courses={courses}
        onAdd={() => setViewMode("add")}
        onView={(c) => {
          setActiveCourse(c);
          setViewMode("detail");
        }}
        onEdit={(c) => {
          setActiveCourse(c);
          setViewMode("edit");
        }}
        onDelete={(c) => setCourseToDelete(c)}
      />
    );
  }

  return (
    <>
      {content}

      {courseToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-2">
              Delete course?
            </h3>
            <p className="text-sm mb-4">
              Delete <strong>{courseToDelete.title}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="border px-4 py-2 rounded"
                onClick={() => setCourseToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CourseList({ courses, onView, onEdit, onDelete, onAdd }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex justify-between">
        Courses ({courses.length})
        <button onClick={onAdd} className="bg-black text-white px-4 py-2 rounded">
          + Add Course
        </button>
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">Title</th>
            <th className="p-3 border text-left">Instructor</th>
            <th className="p-3 border text-left">Level</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="p-3 border">{c.title}</td>
              <td className="p-3 border">{c.instructor}</td>
              <td className="p-3 border">{c.level}</td>
              <td className="p-3 border">
                <button onClick={() => onView(c)} className="mr-2 text-blue-600">View</button>
                <button onClick={() => onEdit(c)} className="mr-2 text-green-600">Edit</button>
                <button onClick={() => onDelete(c)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CourseDetail({ course, onBack, onEdit, onDelete }) {
  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold">{course.title}</h2>
      <p>Instructor: {course.instructor}</p>
      <p>Level: {course.level}</p>
      <p>Students: {course.students}</p>
      <p>Revenue: {course.revenue}</p>

      <div className="mt-4 flex gap-3">
        <button onClick={onEdit} className="bg-black text-white px-4 py-2 rounded">Edit</button>
        <button onClick={onDelete} className="border border-red-500 text-red-600 px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
}

function EditCourseForm({ course, onChange, onSave, onCancel }) {
  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>

      <Input label="Title" value={course.title} onChange={(v) => onChange({ ...course, title: v })} />
      <Input label="Instructor" value={course.instructor} onChange={(v) => onChange({ ...course, instructor: v })} />
      <Input label="Level" value={course.level} onChange={(v) => onChange({ ...course, level: v })} />

      <div className="mt-4 flex gap-3">
        <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded">Save</button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

function AddCourseForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [level, setLevel] = useState("Beginner");

  return (
    <div>
      <button onClick={onCancel} className="mb-4 text-blue-600">← Back</button>
      <h2 className="text-xl font-bold mb-4">Add Course</h2>

      <Input label="Title" value={title} onChange={setTitle} />
      <Input label="Instructor" value={instructor} onChange={setInstructor} />
      <Input label="Level" value={level} onChange={setLevel} />

      <div className="mt-4 flex gap-3">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => onAdd({ title, instructor, level })}
        >
          Add
        </button>
        <button onClick={onCancel} className="border px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-500">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 mt-1"
      />
    </div>
  );
}
