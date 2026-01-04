import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const LockPart = () => {
  return (
    <div className="p-4 rounded-lg border-2 transition-all cursor-pointer border-border hover:border-primary/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faLock} />
          <div>
            <p className="font-font-semibold text-lg">HTML & CSS Basics</p>
            <p className="text-xs text-muted-foreground">2 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LockPart;
