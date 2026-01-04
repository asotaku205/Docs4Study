import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
const Statistics = () => {
  return (
    <div className="rounded-xl border text-card-foreground border-border shadow-sm bg-muted/20">
      <div className="flex flex-col space-y-1.5 p-6 pb-3 border-b border-border/50">
        <div className="font-semibold tracking-tight text-base font-heading">
          Account Statistics
        </div>
      </div>
      <div className="p-0">
        <div className="divide-y divide-border/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBookOpen} />
              <span className="text-sm font-medium">Courses</span>
            </div>
            <span className="text-sm font-bold">12</span>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
             <FontAwesomeIcon icon={faFileLines} />
              <span className="text-sm font-medium">Documents</span>
            </div>
            <span className="text-sm font-bold">85</span>
          </div>

          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faPen} />
              <span className="text-sm font-medium">My Posts</span>
            </div>
            <span className="text-sm font-bold">2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;