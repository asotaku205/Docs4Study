export default function Sidebar({ activeTab, onChangeTab }) {
  const items = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "documents", label: "Documents" },
    { id: "courses", label: "Courses" },
    { id: "blog", label: "Blog Posts" },
    { id: "categories", label: "Categories" }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-8 pb-4 border-b border-gray-700">Admin Panel</h2>

      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`block w-full text-left px-4 py-3 rounded transition ${
              activeTab === item.id
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}