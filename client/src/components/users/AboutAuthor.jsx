import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
const AboutAuthor = () => {
  return (
    <div className="mt-12 p-6 bg-muted/50 rounded-xl border border-border">
      <h3 className="text-lg font-bold mb-4">About the author</h3>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
          <FontAwesomeIcon icon={faUserPen} />
        </div>
        <div>
          <p className="font-bold text-sm">Jane Doe</p>
          <p className="text-sm text-muted-foreground max-w-lg">
            Jane is a seasoned web developer with over a decade of experience in
            building scalable web applications. She is passionate about sharing
            knowledge and helping others grow in their careers.
          </p>
        </div>
      </div>
    </div>
  );
};
export default AboutAuthor;
