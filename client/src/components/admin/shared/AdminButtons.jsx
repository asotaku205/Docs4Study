export function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="border px-4 py-2 rounded hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export function SmallButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
    >
      {children}
    </button>
  );
}

export function DeleteButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
    >
      {children}
    </button>
  );
}

export function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
    >
      ← Back
    </button>
  );
}
