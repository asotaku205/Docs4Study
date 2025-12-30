const CardDocs = ({title, description, downloads, views,level,type}) => {
  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start">
                <div className="h-16 w-16 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
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
                    class="lucide lucide-file-text h-8 w-8"
                    aria-hidden="true"
                    data-replit-metadata="client/src/pages/documents.tsx:110:18"
                    data-component-name="FileText"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-2">
                        {title}
                      </h4>
                      <p className="text-muted-foreground mb-4">
                        {description}
                      </p>
                    </div>
                    <button className="px-4 py-4 text-primary border border-primary rounded-md hover-elevate">
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
                        class="lucide lucide-download h-4 w-4"
                        aria-hidden="true"
                        data-replit-metadata="client/src/pages/documents.tsx:121:22"
                        data-component-name="Download"
                      >
                        <path d="M12 15V3"></path>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <path d="m7 10 5 5 5-5"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="flex justify-between ">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-bold text-primary">{type}</span>
                      <span>{downloads} Downloads</span>
                      <span>{views} Views</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {level}
                    </div>
                  </div>
                </div>
              </div>
  );
};
export default CardDocs;