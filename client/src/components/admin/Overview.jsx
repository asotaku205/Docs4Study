import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usersAPI, coursesAPI, documentsAPI, blogPostsAPI } from "@/services/api";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Overview() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ users: 0, courses: 0, documents: 0, blogPosts: 0 });
  const [statusData, setStatusData] = useState({ blogs: { published: 0, pending: 0 }, docs: { published: 0, pending: 0 } });
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, blogsRes, docsRes, coursesRes] = await Promise.all([
        usersAPI.getAll({ limit: 100 }),
        blogPostsAPI.getAll({ limit: 100 }),
        documentsAPI.getAll({ limit: 100 }),
        coursesAPI.getAll({ limit: 100 }),
      ]);

      const blogs = blogsRes.data.data || [];
      const docs = docsRes.data.data || [];

      setStats({
        users: usersRes.data.pagination?.total || 0,
        courses: coursesRes.data.pagination?.total || 0,
        documents: docsRes.data.pagination?.total || 0,
        blogPosts: blogsRes.data.pagination?.total || 0,
      });

      // Phân tích trạng thái nội dung
      setStatusData({
        blogs: {
          published: blogs.filter(b => b.status === 'published' && !b.isDeleted).length,
          pending: blogs.filter(b => b.status === 'pending' && !b.isDeleted).length,
        },
        docs: {
          published: docs.filter(d => d.status === 'published' && !d.isDeleted).length,
          pending: docs.filter(d => d.status === 'pending' && !d.isDeleted).length,
        },
      });

      // Hoạt động nội dung theo tháng
      const now = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const activityByMonth = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthNames[date.getMonth()];
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        const countInMonth = (items) =>
          items?.filter((item) => {
            const d = new Date(item.createdAt);
            return d >= monthStart && d <= monthEnd;
          }).length || 0;

        activityByMonth.push({
          name: monthName,
          blogs: countInMonth(blogs),
          docs: countInMonth(docs),
          courses: countInMonth(coursesRes.data.data),
        });
      }

      setActivityData(activityByMonth);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">{t("admin.overview.loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: t("admin.overview.users"), value: stats.users.toString(), icon: "👥" },
          { label: t("admin.overview.blogPosts"), value: stats.blogPosts.toString(), icon: "📝" },
          { label: t("admin.overview.documents"), value: stats.documents.toString(), icon: "📄" },
          { label: t("admin.overview.courses"), value: stats.courses.toString(), icon: "📚" },
        ].map((kpi, i) => (
          <Card key={i} className="p-3 md:p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{kpi.value}</p>
              </div>
              <span className="text-lg md:text-2xl text-center">{kpi.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">{t("admin.overview.contentActivity")}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="blogs" name={t("admin.overview.blogPosts")} fill="#1f2937" radius={[4, 4, 0, 0]} />
                <Bar dataKey="docs" name={t("admin.overview.documents")} fill="#6b7280" radius={[4, 4, 0, 0]} />
                <Bar dataKey="courses" name={t("admin.overview.courses")} fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-4 md:p-6">
            <h3 className="text-lg font-bold mb-4">{t("admin.overview.pendingReview")}</h3>
            <div className="space-y-4">
              {/* Blog Posts Status */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{t("admin.overview.blogPosts")}</span>
                  <span className="text-muted-foreground">
                    {statusData.blogs.published + statusData.blogs.pending} {t("admin.overview.total")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 flex overflow-hidden">
                  {statusData.blogs.published > 0 && (
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(statusData.blogs.published / Math.max(statusData.blogs.published + statusData.blogs.pending, 1)) * 100}%`, minWidth: statusData.blogs.published > 0 ? '30px' : '0' }}
                    >
                      {statusData.blogs.published}
                    </div>
                  )}
                  {statusData.blogs.pending > 0 && (
                    <div
                      className="bg-orange-400 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(statusData.blogs.pending / Math.max(statusData.blogs.published + statusData.blogs.pending, 1)) * 100}%`, minWidth: statusData.blogs.pending > 0 ? '30px' : '0' }}
                    >
                      {statusData.blogs.pending}
                    </div>
                  )}
                  {statusData.blogs.published === 0 && statusData.blogs.pending === 0 && (
                    <div className="bg-gray-200 h-full w-full" />
                  )}
                </div>
              </div>

              {/* Documents Status */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{t("admin.overview.documents")}</span>
                  <span className="text-muted-foreground">
                    {statusData.docs.published + statusData.docs.pending} {t("admin.overview.total")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 flex overflow-hidden">
                  {statusData.docs.published > 0 && (
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(statusData.docs.published / Math.max(statusData.docs.published + statusData.docs.pending, 1)) * 100}%`, minWidth: statusData.docs.published > 0 ? '30px' : '0' }}
                    >
                      {statusData.docs.published}
                    </div>
                  )}
                  {statusData.docs.pending > 0 && (
                    <div
                      className="bg-orange-400 h-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(statusData.docs.pending / Math.max(statusData.docs.published + statusData.docs.pending, 1)) * 100}%`, minWidth: statusData.docs.pending > 0 ? '30px' : '0' }}
                    >
                      {statusData.docs.pending}
                    </div>
                  )}
                  {statusData.docs.published === 0 && statusData.docs.pending === 0 && (
                    <div className="bg-gray-200 h-full w-full" />
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 pt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>{t("admin.overview.published")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span>{t("admin.overview.pending")}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
