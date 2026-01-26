import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPeopleGroup, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";


const CardCourses = ({ image, title, description, duration, students, price }) => {
  return (
    <Link href="/courses/detail">
      <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
        {/* Image Section */}
        <div className="h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Course Stats */}
          <div className="mt-auto pt-4 flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} /> {duration}
            </span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <FontAwesomeIcon icon={faPeopleGroup} /> {students}
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex justify-between items-center">
            <span className="text-primary text-xl font-bold">{price} $</span>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all active:scale-95">
              Enroll Now <FontAwesomeIcon icon={faCirclePlay} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCourses;
