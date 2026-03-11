import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import DocItem from "./DocItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../../../i18n/LanguageContext";

const SavedDocs = ({ documents = [] }) => {
  const { t } = useLanguage();
  return (
    <div className="mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none">
      <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <FontAwesomeIcon icon={faFileLines} />
            {t.savedDocs.title}
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            {documents.length} {documents.length === 1 ? t.savedDocs.item : t.savedDocs.items} {t.savedDocs.total}
          </span>
        </div>
        
        <div className="divide-y divide-border">
          {documents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FontAwesomeIcon icon={faFileLines} className="text-4xl text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">{t.savedDocs.noDocs}</p>
              <p className="text-sm text-muted-foreground">{t.savedDocs.docsAppearHere}</p>
            </div>
          ) : (
            documents.map((doc) => (
              <DocItem key={doc._id} doc={doc} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedDocs;
