import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import PostItem from './PostItem';
import { Link } from 'wouter';
import { useLanguage } from '../../../i18n/LanguageContext';

const MyPost = ({ blogs = [] }) => {
  const { t } = useLanguage();
  return (
    <div className="mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none">
      <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <FontAwesomeIcon icon={faPenToSquare} className="h-4 w-4 text-primary" />
            {t.myPost.title}
          </h3>
          <Link href="/create-post">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-8 rounded-md px-3 h-8 text-xs gap-1.5">
              <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
              {t.myPost.newPost}
            </button>
          </Link>
        </div>

        <div className="divide-y divide-border">
          {blogs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FontAwesomeIcon icon={faPenToSquare} className="text-4xl text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">{t.myPost.noPosts}</p>
              <p className="text-sm text-muted-foreground">{t.myPost.startSharing}</p>
            </div>
          ) : (
            blogs.map((post) => (
              <PostItem key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPost;
