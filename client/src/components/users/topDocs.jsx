const TopDocs = ({category,title, description,dowloaded,view}) => {
    return (
<div className="h-full ">
                  <button className="h-full flex flex-col p-6 border border-border rounded-lg hover-elevate bg-card text-card-foreground w-full">
                    <div className="flex justify-between shrink-0 items-start mb-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-file-text h-5 w-5"
                          aria-hidden="true"
                        >
                          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                          <path d="M10 9H8"></path>
                          <path d="M16 13H8"></path>
                          <path d="M16 17H8"></path>
                        </svg>
                      </div>
                      <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
                        {category}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
                      {description}
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
                      <span>{dowloaded} downloaded</span>
                      <span>{view} views</span>
                    </div>
                  </button>
                </div>

    );
}
export default TopDocs;