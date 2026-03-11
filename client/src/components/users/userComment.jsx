import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import { useLanguage } from "../../i18n/LanguageContext";
import { resolveFileUrl } from "../../utils/url";

const UserComment = ({ userId, name, avatar, content = "", date = "" }) => {
    const { t } = useLanguage();
    const displayName = name || t.common.anonymous;
    const resolvedAvatar = resolveFileUrl(avatar);
    
    const nameContent = (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {resolvedAvatar ? (
            <img src={resolvedAvatar} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            <FontAwesomeIcon icon={faUser} />
          )}
        </div>
        <div>
          <p className="font-semibold">{displayName}</p>
          <span className="text-xs text-muted-foreground">
            {date}
          </span>
        </div>
      </div>
    );

    return(
        <div className="flex flex-col gap-2">
            {userId ? (
              <Link href={`/other-profile/${userId}`} className="hover:opacity-80 transition-opacity w-fit">
                {nameContent}
              </Link>
            ) : (
              nameContent
            )}
            <p className="mt-1 text-sm ml-[52px]">
              {content}
            </p>
        </div>
    );
}
export default UserComment;