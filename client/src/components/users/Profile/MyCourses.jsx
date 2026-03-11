import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import { useLanguage } from "../../../i18n/LanguageContext";

const MyCourses = () => {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm overflow-hidden">
      <div className="px-6 py-8 text-center">
        <FontAwesomeIcon icon={faGraduationCap} className="text-5xl text-muted-foreground mb-4" />
        <h3 className="text-lg font-bold mb-2 text-foreground">{t.myCourses.title}</h3>
        <p className="text-muted-foreground mb-4">
          {t.myCourses.description}
        </p>
        <Link href="/courses">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 rounded-md px-4 py-2 text-sm">
            {t.myCourses.browseButton}
          </button>
        </Link>
      </div>
    </div>
  );
};
export default MyCourses;
