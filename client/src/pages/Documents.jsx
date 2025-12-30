import React from "react";
import Layout from "../components/Layout";
import CardDocs from "../components/users/cardDocs";
const Documents = () => {
  return (
    <Layout>
      <section className="bg-muted/30 py-12 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-4xl mb-4 text-foreground text-center">
            Study Documents
          </h2>
          <p className="text-muted-foreground mx-auto mb-6">
            Access thousands of study notes, cheat sheets, and research papers
            shared by the community.
          </p>
          <div className="max-w-xl mx-auto relative">
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
              class="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5"
              aria-hidden="true"
              data-replit-metadata="client/src/pages/documents.tsx:38:12"
              data-component-name="Search"
            >
              <path d="m21 21-4.34-4.34"></path>
              <circle cx="11" cy="11" r="8"></circle>
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground pl-10"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                Filters
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Level
                </label>
                <select className="w-full mt-2 p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div className="mt-8 border-t">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Category
                </label>
                <div className="mt-4 flex flex-col gap-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm bg-primary text-primary-foreground font-medium">
                    All Category
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted">
                    Science
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted">
                    History
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted">
                    Computer Science
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted">
                    Chemical
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-muted">
                    Literature
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center">
              <h3 className="text-muted-foreground">4 results found</h3>
              <select className="border border-border rounded-md p-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Sort by: Relevance</option>
                <option>Sort by: Most Downloaded</option>
              </select>
            </div>
            <div className="space-y-4 mt-4">
              <CardDocs
                title="Introduction to Computer Science"
                description="Comprehensive notes covering fundamental concepts in computer science."
                downloads="120"
                views="450"
                level="Beginner"
                type="PDF"
              />
              <CardDocs
                title="Introduction to Computer Science"
                description="Comprehensive notes covering fundamental concepts in computer science."
                downloads="120"
                views="450"
                level="Beginner"
                type="PDF"
              />
                <CardDocs
                title="Introduction to Computer Science"
                description="Comprehensive notes covering fundamental concepts in computer science."
                downloads="120"
                views="450"
                level="Beginner"
                type="PDF"
              />
              <CardDocs
                title="Introduction to Computer Science"
                description="Comprehensive notes covering fundamental concepts in computer science."
                downloads="120"
                views="450"
                level="Beginner"
                type="PDF"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Documents;
