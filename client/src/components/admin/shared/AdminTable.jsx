export function AdminTable({ children }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function AdminTableHeader({ columns }) {
  return (
    <thead className="bg-gray-50 border-b">
      <tr>
        {columns.map((col, idx) => (
          <th key={idx} className="p-3 text-left font-medium">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function AdminTableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function AdminTableRow({ isDeleted, children }) {
  return (
    <tr className={isDeleted ? 'bg-gray-50' : 'hover:bg-gray-50'}>
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, isGray }) {
  return (
    <td className={`p-3 border-b ${isGray ? 'text-gray-600' : ''}`}>
      {children}
    </td>
  );
}
