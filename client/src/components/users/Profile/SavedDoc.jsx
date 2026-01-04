import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import DocItem from "./DocItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const SavedDocs = () => {
  return (
    <div className="mt-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none">
      <div className="rounded-xl border bg-card text-card-foreground border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <FontAwesomeIcon icon={faFileLines} />
            Saved Documents
          </h3>
          <span className="text-xs text-muted-foreground font-medium">
            23 items total
          </span>
        </div>
        
        <div className="divide-y divide-border">
          <DocItem />
          <DocItem />
          <DocItem />
          <DocItem />
          <DocItem />
         
        </div>
        
        <div className="p-4 text-center bg-muted/10 border-t border-border">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 underline-offset-4 hover:underline min-h-9 px-4 py-2 text-xs font-medium text-muted-foreground">
            View all saved items
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedDocs;
