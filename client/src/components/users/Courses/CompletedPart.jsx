import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const CompletedPart = () => {
  return (
    <div className="p-4 rounded-lg border-2 transition-all cursor-pointer border-primary bg-primary/5">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCircleCheck} />
          <div>
            <p className="font-font-semibold text-lg">Getting Started</p>
            <p className="text-xs text-muted-foreground">30 min</p>
          </div>
        </div>

        <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent shadow-xs bg-green-100 text-green-800 hover:bg-green-100">
          Completed
        </div>
      </div>
    </div>
  );
};
export default CompletedPart;