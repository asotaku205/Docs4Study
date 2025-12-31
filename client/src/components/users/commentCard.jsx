import UserComment from "./userComment";

const CommentCard = ({ }) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl mt-10">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="border-b border-border px-8 py-6">
          <h2 className="text-2xl font-bold mb-2">Comments</h2>
          <p className="text-sm text-muted-foreground mt-1">36 Comments</p>
        </div>
        <div className="px-8 py-8 space-y-6 border-b border-border">
            <UserComment  />
            <UserComment />
            <UserComment />
        </div>
        <div className="px-8 py-6">
          <h3 className="text-lg font-bold mb-4">Leave a Comment</h3>
          <textarea
            className="w-full p-4 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            placeholder="Write your comment here..."
          ></textarea>
          <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentCard;
