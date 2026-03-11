import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Link } from "wouter";
import { resolveFileUrl } from "../../../utils/url";
import { useLanguage } from "../../../i18n/LanguageContext";

const DocItem = ({ doc = {} }) => {
  const { t } = useLanguage();

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return t.common.today;
    if (diffDays === 1) return t.common.oneDayAgo;
    if (diffDays < 30) return t.common.daysAgo.replace("{n}", diffDays);
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return t.common.oneMonthAgo;
    return t.common.monthsAgo.replace("{n}", diffMonths);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (doc.fileUrl) {
      window.open(resolveFileUrl(doc.fileUrl), '_blank');
    }
  };

  return (
    <Link href={`/documents/${doc._id}`} className="block">
      <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
            <FontAwesomeIcon icon={faFileLines} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground truncate mb-0.5">
              {doc.title || t.common.untitledDocument}{doc.fileType ? `.${doc.fileType}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} />
              {timeAgo(doc.createdAt)}{doc.fileSize ? ` • ${doc.fileSize}` : ""}
            </p>
          </div>
        </div>
        {doc.fileUrl && (
          <div className="flex items-center gap-3 ml-4 shrink-0">
            <button 
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md text-xs h-8 w-8 p-0"
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
export default DocItem;