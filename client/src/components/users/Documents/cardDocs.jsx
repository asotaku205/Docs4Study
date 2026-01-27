import React from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines, faDownload } from "@fortawesome/free-solid-svg-icons";


const CardDocs = ({ id, title, description, downloads, views, type, category, fileSize }) => {
  return (
    <Link href={`/documents/${id}`} className="block">
      <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
        {/* Icon Section */}
        <div className="h-16 w-16 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
          <FontAwesomeIcon icon={faFileLines} size="2x" />
        </div>

        {/* Content Section */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground text-lg mb-2">
                {title}
              </h4>
              <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
            </div>
            <button className="px-2 py-2 text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-all active:scale-95">
              <FontAwesomeIcon icon={faDownload}  />
            </button>
          </div>

          {/* Stats Section */}
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="font-bold text-primary">{type}</span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faDownload} /> {downloads}
              </span>
              <span className="flex items-center gap-1">
                Views: {views}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {category} • {fileSize}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardDocs;
