import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import InProgess from "./InProgess";
import Completed from "./Completed";
const MyCourses = () => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm overflow-hidden ">
      <div className="px-4 py-4 border-b border-border bg-muted/20">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/80">
          <FontAwesomeIcon icon={faClock} />
          In Progress
        </h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <InProgess />

          <InProgess />
        </div>
      </div>

      <div className="px-6 py-4 border-b border-border bg-muted/20">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground/80">
          <FontAwesomeIcon icon={faTrophy} />
          Completed
        </h3>

        <div className="grid sm:grid-cols-2 gap-6">
          <Completed />

          <Completed />
        </div>
      </div>
    </div>
  );
};
export default MyCourses;
