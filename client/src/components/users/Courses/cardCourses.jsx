import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from "wouter";
import { useLanguage } from "../../../i18n/LanguageContext";


const CardCourses = React.memo(({ id, image, title, description, duration, level }) => {
  const { t } = useLanguage();
  return (
    <Link href={`/courses-detail/${id}`}>
      <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
        {/* Image Section */}
        <div className="h-48 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <img
              src={image || "/library.png"}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
          {level && (
            <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs rounded-full capitalize">
              {level}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description || t.cardCourses.defaultDescription}
          </p>

          {/* Course Stats */}
          <div className="mt-auto pt-4 mb-4">
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} /> {duration || t.cardCourses.selfPaced}
            </span>
          </div>

          {/* Action */}
          <div className="flex justify-end items-center">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all active:scale-95">
              {t.cardCourses.viewCourse} <FontAwesomeIcon icon={faCirclePlay} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
});

CardCourses.displayName = 'CardCourses';

export default CardCourses;
