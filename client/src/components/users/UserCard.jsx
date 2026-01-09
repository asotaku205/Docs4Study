import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "wouter";

const UserCard = ({ name, email, avatar, role, badge, joined, courses, blogs }) => {
    return(
        <Link href="/other-profile" className="block">
         <div className="rounded-xl border bg-card text-card-foreground border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-8 text-center border-b border-border">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-32 w-32 border-4 border-card shadow-xl mx-auto mb-6">
                  <img
                    className="aspect-square h-full w-full"
                    src={avatar}
                    alt={name}
                  />
                </span>
                <h4 className="text-2xl font-heading font-bold mb-1">
                  {name}
                </h4>
                <p className="text-muted-foreground text-sm mb-4">
                  {email}
                </p>
                <div className="flex justify-center gap-2">
                  <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-primary/10 text-primary border-none">
                    {role}
                  </div>
                  <div className="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-amber-100 text-amber-700 border-none">
                    {badge}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-muted/30 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    Joined
                  </span>
                  <span className="font-medium text-foreground">{joined}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faBook} />
                    Enrolled Courses
                  </span>
                  <span className="font-medium text-foreground">{courses}</span>
                </div>
        
                {blogs !== "0" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <FontAwesomeIcon icon={faUsers} />
                        Published Blogs
                    </span>
                    <span className="font-medium text-green-600">{blogs}</span>
                  </div>
                )}
              </div>
            </div>
        </Link>
    )
}

export default UserCard;
