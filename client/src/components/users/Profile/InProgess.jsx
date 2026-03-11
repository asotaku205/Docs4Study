import { Link } from "wouter";
import { useLanguage } from "../../../i18n/LanguageContext";

const InProgess = ({ courseData }) => {
    const { course, progress = 0, enrolledAt } = courseData || {};
    const { t } = useLanguage();
    
    if (!course) return null;

    return (
        <Link href={`/courses-detail/${course._id}`}>
            <div className="rounded-xl border bg-card text-card-foreground shadow group overflow-hidden border-border hover:shadow-md transition-all">
                <div className="h-32 overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src={course.thumbnail || "library.png"}
                    alt={course.title}
                    loading="lazy"
                  />
                  
                  <div className="absolute top-3 left-3">
                    <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold border-transparent shadow-xs bg-white/90 text-primary border-none text-[10px]">
                      {t.inProgressCourse.inProgress}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t.inProgressCourse.progress}</span>
                      <span className="font-bold text-primary">{progress}%</span>
                    </div>
                    <div className="relative w-full overflow-hidden rounded-full bg-primary/20 h-1.5">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-8 rounded-md px-3 w-full mt-4 h-9 text-xs">
                    {t.inProgressCourse.continueLearning}
                  </button>
                </div>
              </div>
        </Link>
    );
}
export default InProgess;