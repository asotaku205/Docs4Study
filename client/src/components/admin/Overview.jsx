export default function Overview() {
    const stats = [
        {label: "Total Revenue", value: "24,580"},
        {label: "Active Users", value: "1.245"},
        {label: "Documents", value: "320"},
        {label: "Courses", value: "18"},
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Overview</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item) => (
                <div
                key={item.label}
                className="bg-white border rounded-lg p-4 shadow-sm"
                >
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
                </div>
            ))}
            </div>
        </div>

    )
}