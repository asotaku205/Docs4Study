import { faComment, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const PostItem = () => {
  return (
    <div className="p-6 hover:bg-muted/30 transition-colors group">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="h-24 w-40 rounded-lg overflow-hidden shrink-0 border border-border">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src="library.png"
            alt="Modern React Patterns for 2026"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent shadow-xs bg-primary/10 text-primary border-none text-[10px] h-5">
              Development
            </div>
            <span className="text-[11px] text-muted-foreground">
              Dec 11, 2025
            </span>
          </div>
          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
            Modern React Patterns for 2026
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
            Exploring the latest trends and techniques in frontend development
            for the next year.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faThumbsUp} className="h-3.5 w-3.5" />
              45
            </span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faComment} className="h-3.5 w-3.5" />
              12
            </span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
              800
            </span>
            <div className="ml-auto flex gap-2">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md h-7 px-2 text-[10px]">
                Edit
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md h-7 px-2 text-[10px] text-destructive hover:text-destructive">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostItem;

