import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBook } from "@fortawesome/free-solid-svg-icons"; 
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Link } from "wouter";

const ProfileCard = ({ 
  setActiveTab, 
  userData = {
    name: "Anh Son",
    email: "anh.son@docs4study.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nguyễn Minh Anh",
    role: "Intermediate",
    badge: "Pro Member",
    joined: "Dec 2024",
    learningStreak: "18 Days",
    enrolledCourses: null
  },
  showEditButton = true
}) => {
    return(
         <div className="rounded-xl border bg-card text-card-foreground border-border shadow-md overflow-hidden">
              <div className="p-8 text-center border-b border-border">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 border-4 border-card shadow-xl mx-auto mb-6">
                  <img
                    className="aspect-square h-full w-full"
                    src={userData.avatar}
                    alt="Profile"
                  />
                </span>
                <h1 className="text-2xl font-heading font-bold mb-1">
                  {userData.name}
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  {userData.email}
                </p>
                <div className="flex justify-center gap-2">
                  <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-primary/10 text-primary border-none">
                    {userData.role}
                  </div>
                  <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-amber-100 text-amber-700 border-none">
                    {userData.badge}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-muted/30 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    Joined
                  </span>
                  <span className="font-medium text-foreground">{userData.joined}</span>
                </div>
                
                {userData.learningStreak && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <FontAwesomeIcon icon={faBolt} />
                      Learning Streak
                    </span>
                    <span className="font-medium text-green-600">{userData.learningStreak}</span>
                  </div>
                )}

                {userData.enrolledCourses !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <FontAwesomeIcon icon={faBook} />
                      Enrolled Courses
                    </span>
                    <span className="font-medium text-foreground">{userData.enrolledCourses}</span>
                  </div>
                )}

                {showEditButton && (
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 border border-input shadow-xs active:shadow-none min-h-9 px-4 py-2 w-full mt-2"
                  onClick={() => setActiveTab("Setting")}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
    )
}
export default ProfileCard;