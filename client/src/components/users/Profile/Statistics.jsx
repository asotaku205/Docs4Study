import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../../i18n/LanguageContext";
const Statistics = ({ stats = {} }) => {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border text-card-foreground border-border shadow-sm bg-muted/20">
      <div className="flex flex-col space-y-1.5 p-6 pb-3 border-b border-border/50">
        <div className="font-semibold tracking-tight text-base font-heading">
          {t.statistics.title}
        </div>
      </div>
      <div className="p-0">
        <div className="divide-y divide-border/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
             <FontAwesomeIcon icon={faFileLines} />
              <span className="text-sm font-medium">{t.statistics.documents}</span>
            </div>
            <span className="text-sm font-bold">{stats.documents ?? 0}</span>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPen} />
              <span className="text-sm font-medium">{t.statistics.myPosts}</span>
            </div>
            <span className="text-sm font-bold">{stats.blogs ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;