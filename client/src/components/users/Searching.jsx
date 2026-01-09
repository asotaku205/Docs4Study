
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const Searching = ({title,description}) => {
  return (
    <section className="bg-muted/30 py-12 border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-bold text-4xl mb-4 text-foreground text-center">
          {title}
        </h2>
        <p className="text-muted-foreground mx-auto mb-6">
            {description}
        </p>
        <div className="max-w-xl mx-auto relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground pl-10"
          />
        </div>
      </div>
    </section>
  );
};
export default Searching;
