export function AdminHeader({ title, onAdd, buttonText = "New" }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export function AdminFormInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>
  );
}

export function AdminFormTextarea({ label, value, onChange, rows = 4 }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      />
    </div>
  );
}

export function AdminFormSelect({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AdminFormCheckbox({ label, checked, onChange }) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm">{label}</span>
      </label>
    </div>
  );
}

export function AdminStatusBadge({ status, isActive }) {
  const getStatusClass = () => {
    if (status === 'Deleted' || status === 'deleted') return 'bg-gray-300';
    if (isActive || status === 'Active' || status === 'active' || status === 'published') {
      return 'bg-gray-900 text-white';
    }
    return 'bg-gray-300';
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${getStatusClass()}`}>
      {status}
    </span>
  );
}

export function AdminDeleteModal({ isOpen, title, itemName, onConfirm, onCancel, cancelText, confirmText }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm mb-4">
          <strong>{itemName}</strong>
        </p>
        <div className="flex justify-end gap-3">
          <button
            className="border px-4 py-2 rounded hover:bg-gray-50"
            onClick={onCancel}
          >
            {cancelText || "Cancel"}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
