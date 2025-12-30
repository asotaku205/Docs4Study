import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
const BlogCard = ({ image, category, date, title, description, author }) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="overflow-hidden">
        <img
          src={image}
          alt="Article Image"
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4 gap-2 justify-between">
          <div className="text-sm text-secondary-foreground font-medium border rounded-md bg-card bg-secondary px-2 py-1 border-primary/20">
            {category}
          </div>
          <span className="text-sm text-muted-foreground ">{date}</span>
        </div>
        <div className="text-leading text-primary font-bold">{title}</div>
      </div>
      <div className="p-6 pt-0">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center p-6 border-t border-border pt-4 mt-auto">
        <span className="text-xs text-muted-foreground font-semibold space-x-2 flex items-center gap-2">
          <FontAwesomeIcon icon={faUserPen} />
          {author}
        </span>
      </div>
    </div>
  );
};
export default BlogCard;
