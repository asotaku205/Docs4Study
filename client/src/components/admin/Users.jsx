import { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      joined: "Dec 1, 2024",
      status: "Active",
      role: "Student",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      joined: "Dec 5, 2024",
      status: "Inactive",
      role: "Instructor",
    },
  ]);

  const [viewMode, setViewMode] = useState("list"); // list | detail
  const [activeUser, setActiveUser] = useState(null);

  const toggleStatus = () => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === activeUser.id
          ? {
              ...u,
              status: u.status === "Active" ? "Inactive" : "Active",
            }
          : u
      )
    );

    setActiveUser((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  let content = null;

  if (viewMode === "detail") {
    content = (
      <UserDetail
        user={activeUser}
        onBack={() => setViewMode("list")}
        onToggleStatus={toggleStatus}
      />
    );
  } else {
    content = (
      <UserList
        users={users}
        onView={(u) => {
          setActiveUser(u);
          setViewMode("detail");
        }}
      />
    );
  }

  return <>{content}</>;
}

function UserList({ users, onView }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        User Management ({users.length})
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">Name</th>
            <th className="p-3 border text-left">Email</th>
            <th className="p-3 border text-left">Role</th>
            <th className="p-3 border text-left">Status</th>
            <th className="p-3 border text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-3 border">{u.name}</td>
              <td className="p-3 border">{u.email}</td>
              <td className="p-3 border">{u.role}</td>
              <td className="p-3 border">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    u.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {u.status}
                </span>
              </td>
              <td className="p-3 border">
                <button
                  className="text-blue-600"
                  onClick={() => onView(u)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserDetail({ user, onBack, onToggleStatus }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-blue-600"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold mb-4">
        {user.name}
      </h2>

      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {user.joined}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 rounded text-sm ${
              user.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {user.status}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <button
          className="px-4 py-2 border rounded"
          onClick={onToggleStatus}
        >
          Toggle Status
        </button>
      </div>
    </div>
  );
}
