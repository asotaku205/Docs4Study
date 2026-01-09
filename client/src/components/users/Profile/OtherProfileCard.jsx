import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPen, faFileLines } from "@fortawesome/free-solid-svg-icons";

const OtherProfileCard = ({ userData }) => {
    return(
         <div className="rounded-xl border bg-card text-card-foreground border-border shadow-md overflow-hidden">
              <div className="p-8 text-center border-b border-border">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 border-4 border-card shadow-xl mx-auto mb-6">
                  <img
                    className="aspect-square h-full w-full"
                    src={userData.avatar}
                    alt={userData.name}
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
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faPen} />
                    Published Posts
                  </span>
                  <span className="font-medium text-primary">{userData.publishedPosts || 0}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileLines} />
                    Uploaded Docs
                  </span>
                  <span className="font-medium text-primary">{userData.uploadedDocs || 0}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faBook} />
                    Courses Created
                  </span>
                  <span className="font-medium text-primary">{userData.coursesCreated || 0}</span>
                </div>
              </div>
            </div>
    )
}

export default OtherProfileCard;
