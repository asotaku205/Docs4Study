import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
const DocItem = () => {
  return (
     <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors group">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-11 w-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
               <FontAwesomeIcon icon={faFileLines} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate mb-0.5">
                  Calculus Final Cheatsheet.pdf
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                 <FontAwesomeIcon icon={faClock} />
                  2 days ago • 2.4 MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-8 rounded-md text-xs h-8 w-8 p-0">
               <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
  );
}
export default DocItem;