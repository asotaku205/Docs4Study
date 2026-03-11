import { useState } from "react";
import UserComment from "./userComment";
import { useLanguage } from "../../i18n/LanguageContext";

const CommentSection = ({ comments = [], onCommentSubmit, submitting = false }) => {
  const [commentText, setCommentText] = useState("");
  const { t, language } = useLanguage();

  const handleSubmit = async () => {
    if (!commentText.trim() || submitting) return;

    try {
      await onCommentSubmit(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl mt-10">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-2xl font-bold mb-2">{t.comment.comments}</h2>
          <p className="text-sm text-muted-foreground mt-1">{comments.length} {t.comment.commentsCount}</p>
        </div>
        <div className="px-8 py-8 space-y-6 border-b border-border">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t.comment.noComments}</p>
          ) : (
            comments.map((comment, index) => (
              <UserComment 
                key={comment._id || index}
                userId={comment.user?._id}
                name={comment.user?.fullName || t.common.anonymous}
                avatar={comment.user?.avatar}
                content={comment.content}
                date={new Date(comment.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              />
            ))
          )}
        </div>
        <div className="px-8 py-6">
          <h3 className="text-lg font-bold mb-4">{t.comment.leaveComment}</h3>
          <textarea
            className="w-full p-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            placeholder={t.comment.placeholder}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button 
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting || !commentText.trim()}
          >
            {submitting ? t.comment.submitting : t.comment.submit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
