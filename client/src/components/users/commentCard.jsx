import { useState } from "react";
import UserComment from "./userComment";
import { blogService } from "../../services/blogService";

const CommentCard = ({ blogId, comments, onCommentAdded }) => {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await blogService.addComment(blogId, commentText);
      setCommentText("");
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please login first.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl mt-10">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-2xl font-bold mb-2">Comments</h2>
          <p className="text-sm text-muted-foreground mt-1">{comments.length} Comments</p>
        </div>
        <div className="px-8 py-8 space-y-6 border-b border-border">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment, index) => (
              <UserComment 
                key={index}
                name={comment.user?.fullName || "Anonymous"}
                content={comment.content}
                date={new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              />
            ))
          )}
        </div>
        <div className="px-8 py-6">
          <h3 className="text-lg font-bold mb-4">Leave a Comment</h3>
          <textarea
            className="w-full p-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button 
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting || !commentText.trim()}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
