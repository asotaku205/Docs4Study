import {
  faAngleLeft,
  faUserPen,
  faThumbsUp,
  faComment,
  faShareFromSquare,
  faClock,
  faCalendar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserComment = ({  }) => {
    return(
        <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <div>
                <p>Anh Son</p>
                <span className="text-xs text-muted-foreground">
                  2 hours ago
                </span>
              </div>
              <p className="mt-2 text-sm">
                Great article! Really helped me understand the new features in
                React 18.
              </p>
              <button className="text-sm text-primary hover:underline mt-3 p-2 flex items-center justify-center">
                reply
              </button>
            </div>
          </div>

    );
}
export default UserComment;