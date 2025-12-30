import React from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

const HeroPost = ({image, category, date, title, description, author}) => {
  return (
    <div className="mb-16">
      <Link href="/">
        <button className="w-full grid lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left">
          <div className=" h-full overflow-hidden">
            <img
              src={image}
              alt="Blog Post Image"
              className="w-full h-full object-cover rounded-md mb-4"
            />
          </div>
          <div className="p-8 lg:p-12 ">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition text-xs">
                {category}
              </div>
              <span className="text-sm text-muted-foreground">
                {date}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {title}
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              {description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                 <FontAwesomeIcon icon={faUserPen} />
                </div>
                <div>
                  <p className="font-medium text-sm">{author}</p>
                  <p className="text-xs text-muted-foreground">Editor</p>
                </div>
              </div>
              <button className="items-center rounded-md px-4 py-2 font-medium gap-2 justify-center text-sm border border-primary inline-flex whitespace-nowrap">
                Read full story
              </button>
            </div>
          </div>
        </button>
      </Link>
    </div>
  );
};
export default HeroPost;