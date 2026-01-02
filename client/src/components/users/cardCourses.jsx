import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";

const CardCourses = ({image, title, description, duration, students, price}) => {
  return (
    <Link href="/courses/detail">
    <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className=" text-muted-foreground text-sm">
          {description}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-xs"><FontAwesomeIcon icon={faClock} /> {duration}</span>
          <span className="text-muted-foreground text-xs"> <FontAwesomeIcon icon={faPeopleGroup} /> {students} </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary text-xl font-bold">{price} $</span>
          <button className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover-elevate">
            Enroll Now <FontAwesomeIcon icon={faCirclePlay} />
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
};
export default CardCourses;
