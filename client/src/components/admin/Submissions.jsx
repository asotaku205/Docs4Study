import { useState, useEffect } from "react";
import { blogPostsAPI, categoriesAPI } from "../../services/api";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await blogPostsAPI.getAll({ includeDeleted: false });
      const pendingPosts = (response.data.data || []).filter(p => p.status === 'pending');
      setSubmissions(pendingPosts);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission) => {
    try {
      await blogPostsAPI.update(submission._id, { 
        status: 'published',
        publishedAt: new Date()
      });
      await fetchSubmissions();
      setViewMode("list");
      setActiveSubmission(null);
      alert("Blog approved and published successfully!");
    } catch (error) {
      console.error("Error approving submission:", error);
      alert("Failed to approve submission");
    }
  };

  const handleReject = async (submission) => {
    if (!confirm(`Reject submission: ${submission.title}?`)) return;
    
    try {
      await blogPostsAPI.delete(submission._id);
      await fetchSubmissions();
      setViewMode("list");
      setActiveSubmission(null);
      alert("Submission rejected successfully!");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("Failed to reject submission");
    }
  };

  let content = null;

  if (viewMode === "detail") {
    content = (
      <SubmissionDetail
        submission={activeSubmission}
        onBack={() => setViewMode("list")}
        onApprove={() => handleApprove(activeSubmission)}
        onReject={() => handleReject(activeSubmission)}
      />
    );
  } else {
    content = (
      <SubmissionList
        submissions={submissions}
        loading={loading}
        onView={(s) => {
          setActiveSubmission(s);
          setViewMode("detail");
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return content;
}

function SubmissionList({ submissions, loading, onView, onApprove, onReject }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pending Submissions</h1>
          <p className="text-gray-600 text-sm mt-1">Review and approve user-submitted blog posts</p>
        </div>
        <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
          {submissions.length} Pending
        </span>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pending submissions</p>
          <p className="text-gray-400 text-sm mt-2">All blog posts have been reviewed</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-orange-50 border-b border-orange-200">
              <tr>
                <th className="p-4 text-left text-sm font-semibold">Title</th>
                <th className="p-4 text-left text-sm font-semibold">Author</th>
                <th className="p-4 text-left text-sm font-semibold">Category</th>
                <th className="p-4 text-left text-sm font-semibold">Submitted</th>
                <th className="p-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s._id} className="hover:bg-orange-50 border-b">
                  <td className="p-4">
                    <div className="font-medium">{s.title}</div>
                    {s.description && (
                      <div className="text-sm text-gray-500 line-clamp-1">{s.description}</div>
                    )}
                  </td>
                  <td className="p-4">{s.author?.fullName || s.author?.email || 'Unknown'}</td>
                  <td className="p-4">{s.category?.name || s.category}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onView(s)} 
                        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => onApprove(s)} 
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReject(s)} 
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SubmissionDetail({ submission, onBack, onApprove, onReject }) {
  return (
    <div>
      <button 
        onClick={onBack} 
        className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
      >
        ← Back to Submissions
      </button>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{submission.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {submission.author?.fullName || submission.author?.email}</span>
              <span>•</span>
              <span>{submission.category?.name || submission.category}</span>
              <span>•</span>
              <span>Submitted {new Date(submission.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded text-xs bg-orange-500 text-white font-semibold">
            Pending Review
          </span>
        </div>

        {submission.description && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{submission.description}</p>
          </div>
        )}

        {submission.image && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Featured Image</h3>
            <img src={submission.image} alt={submission.title} className="max-w-md rounded-lg border" />
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Content</h3>
          <div className="prose max-w-none bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {submission.content}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t">
          <button 
            onClick={onApprove}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            Approve & Publish
          </button>
          <button 
            onClick={onReject}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          >
            Reject
          </button>
          <button 
            onClick={onBack}
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
