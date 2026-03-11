import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/i18n/LanguageContext";

const InteractionBar = ({ 
  likes, 
  commentsCount, 
  liked, 
  onLike, 
  onShare 
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between py-6 border-t border-b border-border">
      <div>
        <button 
          onClick={onLike}
          className={`transition-colors ${liked ? 'text-primary font-semibold' : 'hover:text-primary'}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} /> {likes || 0} {t("interaction.likes")}
        </button>
        <button className="ml-4">
          <FontAwesomeIcon icon={faComment} /> {commentsCount || 0} {t("interaction.comments")}
        </button>
      </div>
      <button 
        onClick={onShare}
        className="px-4 py-2 text-primary text-sm"
      >
        <FontAwesomeIcon icon={faShareFromSquare} /> {t("interaction.share")}
      </button>
    </div>
  );
};

export default InteractionBar;
