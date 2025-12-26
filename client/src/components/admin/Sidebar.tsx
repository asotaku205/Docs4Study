import React from "react";
export default function Sidebar({ activeTab, onChangeTab }) {
  const items = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: "Documents" },
    { id: "courses", label: "Courses" },
    { id: "blog", label: "Blog Posts" }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChangeTab(item.id)}
          className={`block w-full text-left px-3 py-2 rounded mb-2 transition
            ${
              activeTab === item.id
                ? "bg-gray-700 font-bold"
                : "hover:bg-gray-800"
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
}

  