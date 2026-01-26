import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";


const TopCourses = ({ id, image, level, title, duration }) => {
    return (
      <Link href={`/courses-detail/${id}`}> 
        <button className="group w-full overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left">
                  <div className="flex gap-4 h-32">
                    <div className="h-full w-32 overflow-hidden shrink-0">
                      <img
                        src={image || "library.png"}
                        alt={title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="rounded-md px-2 text-sm border border-primary/20 inline-block whitespace-nowrap">
                            {level}
                          </div>
                        </div>

                        <h4 className="line-clamp-2 font-semibold">{title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                           <FontAwesomeIcon icon={faBookOpen} /> {duration || 'N/A'}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </button>
      </Link>
    );
};
export default TopCourses;