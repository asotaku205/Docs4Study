import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { usersAPI, coursesAPI, documentsAPI, blogPostsAPI, ordersAPI } from "@/services/api";

const COLORS = ["#1f2937", "#374151", "#6b7280", "#9ca3af"];

export default function Overview() {
  const [stats, setStats] = useState({ users: 0, activeUsers: 0, courses: 0, documents: 0, revenue: 0 });
  const [chartData, setChartData] = useState([]);
  const [docChartData, setDocChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, blogsRes, docsRes, coursesRes, activeUsersRes, ordersRes] = await Promise.all([
        usersAPI.getAll({ limit: 100 }),
        blogPostsAPI.getAll({ limit: 100 }),
        documentsAPI.getAll({ limit: 100 }),
        coursesAPI.getAll({ limit: 100 }),
        usersAPI.getAll({ limit: 1, isActive: true }),
        ordersAPI.getAll({ limit: 100 }),
      ]);

      const totalRevenue = ordersRes.data.data?.reduce((sum, order) => {
        const amount = typeof order.amount === 'string' 
          ? parseFloat(order.amount.replace(/[^0-9.]/g, '')) 
          : (order.amount || 0);
        return sum + amount;
      }, 0) || 0;
      
      setStats({
        users: usersRes.data.pagination?.total || 0,
        activeUsers: activeUsersRes.data.pagination?.total || 0,
        courses: coursesRes.data.pagination?.total || 0,
        documents: docsRes.data.pagination?.total || 0,
        revenue: totalRevenue,
      });

      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const revenueByMonth = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        
        const monthRevenue = ordersRes.data.data?.reduce((sum, order) => {
          const orderDate = new Date(order.createdAt);
          if (orderDate >= monthStart && orderDate <= monthEnd) {
            const amount = typeof order.amount === 'string' 
              ? parseFloat(order.amount.replace(/[^0-9.]/g, '')) 
              : (order.amount || 0);
            return sum + amount;
          }
          return sum;
        }, 0) || 0;
        
        revenueByMonth.push({ name: monthName, revenue: monthRevenue });
      }
      
      setChartData(revenueByMonth);

      const categoryCount = {};
      docsRes.data.data?.forEach((doc) => {
        const category = doc.category || "Uncategorized";
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
      
      const docDistribution = Object.entries(categoryCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4);
      
      setDocChartData(docDistribution.length > 0 ? docDistribution : [{ name: "No Data", value: 1 }]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, change: "+12.5%", icon: "📊" },
          { label: "Users", value: stats.users.toString(), change: "+3.2%", icon: "👥" },
          { label: "Documents", value: stats.documents.toString(), change: "+18%", icon: "📄" },
          { label: "Courses", value: stats.courses.toString(), change: "+2%", icon: "📚" },
        ].map((kpi, i) => (
          <Card key={i} className="p-3 md:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{kpi.value}</p>
              </div>
              <span className="text-lg md:text-2xl text-center">{kpi.icon}</span>
            </div>
            <Badge className="mt-2 text-xs bg-green-100 text-green-800 hover:bg-green-100">{kpi.change}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1f2937" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">Document Distribution by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={docChartData} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80} 
                  fill="#8884d8" 
                  dataKey="value"
                >
                  {docChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
