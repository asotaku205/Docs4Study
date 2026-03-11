import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUserPen, faClock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "wouter";
import { useLanguage } from "../../../i18n/LanguageContext";
import { resolveFileUrl } from "../../../utils/url";

const ContentHeader = ({ 
  category, 
  title, 
  description, 
  createdAt, 
  author, 
  views, 
  showAuthor = true,
  badgeText = null,
  children 
}) => {
  const { t, language } = useLanguage();
  return (
    <div className="bg-card rounded-2xl shadow-lg p-8 lg:p-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="px-4 py-2 bg-primary text-white rounded transition text-xs">
          {badgeText || category?.name || t.common.general}
        </div>
        {createdAt && (
          <span className="text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faCalendar} /> {new Date(createdAt).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        )}
      </div>
      
      <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
        {title}
      </h1>
      
      {description && (
        <p className="text-lg leading-relaxed text-muted-foreground mb-6">
          {description}
        </p>
      )}
      
      {(showAuthor || views !== undefined || children) && (
        <div className="flex items-center justify-between pb-8 border-b border-border">
          {showAuthor && author && (
            <Link href={`/other-profile/${author._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {resolveFileUrl(author.avatar) ? (
                  <img src={resolveFileUrl(author.avatar)} alt={author.fullName} className="h-full w-full object-cover" />
                ) : (
                  <FontAwesomeIcon icon={faUserPen} />
                )}
              </div>
              <div>
                <p className="font-bold text-sm">{author.fullName || t.common.unknown}</p>
                <p className="text-xs text-muted-foreground">{author.email || t.contentHeader.editor}</p>
              </div>
            </Link>
          )}
          
          {children}
          
          {views !== undefined && (
            <p className="text-sm text-muted-foreground">
              <FontAwesomeIcon icon={faClock} /> {views} {t.contentHeader.views}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
