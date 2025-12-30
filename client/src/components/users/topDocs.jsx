import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
const TopDocs = ({ category, title, description, dowloaded, view }) => {
  return (
    <div className="h-full ">
      <button className="h-full flex flex-col p-6 border border-border rounded-lg hover-elevate bg-card text-card-foreground w-full">
        <div className="flex justify-between shrink-0 items-start mb-2">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faFileLines} />
          </div>
          <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
            {category}
          </div>
        </div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
          {description}
        </p>
        <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
          <span>
            {dowloaded} <FontAwesomeIcon icon={faDownload} />
          </span>
          <span>{view} <FontAwesomeIcon icon={faEye} /></span>
        </div>
      </button>
    </div>
  );
};
export default TopDocs;
