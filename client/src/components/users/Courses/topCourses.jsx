import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";


const TopCourses = ({image,level,price,title,time,rating}) => {
    return (
      <Link href ="/courses/detail"> 
        <button className="group w-full overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left">
                  <div className="flex gap-4 h-32">
                    <div className="h-full w-32 overflow-hidden shrink-0">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
                            {level}
                          </div>
                          <span className="text-primary font-bold text-md">
                            {price}$
                          </span>
                        </div>

                        <h4>{title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                           <FontAwesomeIcon icon={faBookOpen} /> {time} Lessons
                        </span>
                       <span>
                        {rating} <FontAwesomeIcon icon={faStar} style={{color: "#FFD43B",}} />
                       </span>
                      
                      </div>
                      
                    </div>
                  </div>
                </button>
      </Link>
    );
};
export default TopCourses;