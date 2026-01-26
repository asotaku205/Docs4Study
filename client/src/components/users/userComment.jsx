import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserComment = ({ name = "Anonymous", content = "", date = "" }) => {
    return(
        <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <div>
                <p className="font-semibold">{name}</p>
                <span className="text-xs text-muted-foreground">
                  {date}
                </span>
              </div>
              <p className="mt-2 text-sm">
                {content}
              </p>
            </div>
          </div>
    );
}
export default UserComment;