import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/i18n/LanguageContext";

const AboutAuthor = () => {
  const { t } = useLanguage();
  return (
    <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
      <h3 className="text-lg font-bold mb-4">{t.aboutAuthor.title}</h3>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
          <FontAwesomeIcon icon={faUserPen} />
        </div>
        <div>
          <p className="font-bold text-sm">{t.aboutAuthor.name}</p>
          <p className="text-sm text-muted-foreground max-w-lg">
            {t.aboutAuthor.bio}
          </p>
        </div>
      </div>
    </div>
  );
};
export default AboutAuthor;
