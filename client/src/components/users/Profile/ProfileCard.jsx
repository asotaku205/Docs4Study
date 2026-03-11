import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useLanguage } from "../../../i18n/LanguageContext";
import { getAvatarUrl } from "../../../utils/url";

const ProfileCard = ({ 
  setActiveTab, 
  userData = {},
  showEditButton = true
}) => {
    const { t, language } = useLanguage();
    const formatDate = (dateStr) => {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'short' });
    };

    return(
         <div className="rounded-xl border bg-card text-card-foreground border-border shadow-md overflow-hidden">
              <div className="p-8 text-center border-b border-border">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 border-4 border-card shadow-xl mx-auto mb-6">
                  <img
                    className="aspect-square h-full w-full object-cover"
                    src={getAvatarUrl(userData.avatar, userData.fullName)}
                    alt="Profile"
                  />
                </span>
                <h1 className="text-2xl font-heading font-bold mb-1">
                  {userData.fullName || "User"}
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  {userData.email || ""}
                </p>
                <div className="flex justify-center gap-2">
                  <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-primary/10 text-primary border-none capitalize">
                    {userData.role || "student"}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-muted/30 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    {t.profileCard.joined}
                  </span>
                  <span className="font-medium text-foreground">{formatDate(userData.createdAt)}</span>
                </div>

                {showEditButton && (
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-9 px-4 py-2 w-full mt-2"
                  onClick={() => setActiveTab("Setting")}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    {t.profileCard.editProfile}
                  </button>
                )}
              </div>
            </div>
    )
}
export default ProfileCard;