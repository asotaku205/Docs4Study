import React from "react";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const PageHeader = ({ 
  title, 
  description, 
  actionLabel,
  actionLink,
  actionIcon = faPlus 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && actionLink && (
        <Link href={actionLink}>
          <a className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-semibold">
            <FontAwesomeIcon icon={actionIcon} />
            {actionLabel}
          </a>
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
