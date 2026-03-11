import { Link } from "wouter";
import { useLanguage } from "../../../i18n/LanguageContext";

const Completed = ({ courseData }) => {
  const { course, enrolledAt } = courseData || {};
  const { t, language } = useLanguage();
  
  if (!course) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link href={`/courses-detail/${course._id}`}>
      <div className="rounded-xl border bg-card text-card-foreground shadow group overflow-hidden border-border hover:shadow-sm transition-all">
        <div className="flex p-4 gap-4">
          <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-border">
            <img
              className="w-full h-full object-cover grayscale opacity-60"
              src={course.thumbnail || "library.png"}
              alt={course.title}
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-1">
              {course.title}
            </h4>
            <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
              {t.completedCourse.completed} {formatDate(enrolledAt)}
            </p>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md h-7 px-3 text-[10px] bg-primary/5 text-primary hover:bg-primary/10">
              {t.completedCourse.viewCourse}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Completed;