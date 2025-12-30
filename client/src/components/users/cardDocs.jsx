import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faEye } from "@fortawesome/free-regular-svg-icons";
const CardDocs = ({title, description, downloads, views,level,type}) => {
  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
                <div className="h-16 w-16 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faFileLines} size="2x" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-2">
                        {title}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                    </div>
                    <button className="px-4 py-4 text-primary border border-primary rounded-md hover-elevate">
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  </div>

                  <div className="flex justify-between ">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-bold text-primary">{type}</span>
                      <span>{downloads} <FontAwesomeIcon icon={faDownload} /></span>
                      <span>{views} <FontAwesomeIcon icon={faEye} /></span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {level}
                    </div>
                  </div>
                </div>
              </div>
  );
};
export default CardDocs;