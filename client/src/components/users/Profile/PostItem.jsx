import { faComment, faEye, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import { getImageUrl } from "../../../utils/url";
import { useLanguage } from "../../../i18n/LanguageContext";

const PostItem = ({ post = {} }) => {
  const { t, language } = useLanguage();

  return (
    <Link href={`/blog-detail/${post._id}`} className="block">
      <div className="p-6 hover:bg-muted/30 transition-colors group">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="h-24 w-40 rounded-lg overflow-hidden shrink-0 border border-border">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={getImageUrl(post.image)}
              alt={post.title || "Post"}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent shadow-xs bg-primary/10 text-primary border-none text-[10px] h-5">
                {post.category?.name || t.common.general}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ""}
              </span>
            </div>
            <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">
              {post.title || t.common.untitledPost}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-4">
              {post.description || t.common.noDescription}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faThumbsUp} className="h-3.5 w-3.5" />
                {post.likes || 0}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faComment} className="h-3.5 w-3.5" />
                {post.comments?.length || 0}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
                {post.views || 0}
              </span>
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${
                post.status === 'published' ? 'bg-green-100 text-green-700' :
                post.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {post.status || t.common.draft}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default PostItem;

