import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CommentCard from "../components/users/commentCard";
import BackButton from "../components/ui/BackButton";
import { faCalendar, faComment, faShareFromSquare, faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import AboutAuthor from "../components/users/AboutAuthor";
const DocumentDetail = () => {
  return (
    <Layout>
      <div class="container mx-auto px-4 py-12">
        <BackButton link="/documents" />
        <div class="grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-card rounded-2xl p-8 shadow-lg">
              <div class="flex items-center justify-between mb-6">
                <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent shadow-xs bg-primary text-white">
                  Intermediate
                </div>
                <span class="text-sm text-muted-foreground flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendar} /> Updated 2 days ago
                </span>
              </div>
              <h1 class="text-4xl font-heading font-bold mb-4">
                Calculus I - Final Exam Cheatsheet
              </h1>
              <p class="text-lg text-muted-foreground mb-6">
                Comprehensive formula sheet for derivatives and integrals.
              </p>
              <div class="flex items-center gap-6 py-6 border-y border-border">
                <div class="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} />
                  <span class="font-semibold">1205</span>
                  <span class="text-muted-foreground">Views</span>
                </div>
                <div class="flex items-center gap-2">
                  <FontAwesomeIcon icon={faDownload} />
                  <span class="font-semibold">340</span>
                  <span class="text-muted-foreground">Downloads</span>
                </div>
                <div class="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
                  <span class="font-semibold">4.5</span>
                  <span class="text-muted-foreground">(128 ratings)</span>
                </div>
              </div>
            </div>
            <div class="bg-card rounded-2xl p-12 shadow-lg border-2 border-dashed border-border min-h-96 flex items-center justify-center">
              <div class="text-center">
                <div class="text-6xl mb-4">
                  {" "}
                  <FontAwesomeIcon icon={faFileLines} size="2x" />
                </div>
                <p class="text-xl font-semibold text-muted-foreground mb-4">
                  Document Preview
                </p>
                <p class="text-muted-foreground mb-6">PDF Preview Loading...</p>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 gap-2">
                  <FontAwesomeIcon icon={faDownload}  /> Open Full
                  Document
                </button>
              </div>
            </div>
            <div class="bg-card rounded-2xl p-8 border border-border">
              <h2 class="text-2xl font-bold font-heading mb-6">
                Document Information
              </h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-muted-foreground mb-2">Type</p>
                  <p class="font-semibold text-lg">PDF</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground mb-2">File Size</p>
                  <p class="font-semibold text-lg">4.2 MB</p>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground mb-2">Level</p>
                  <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground">
                    Intermediate
                  </div>
                </div>
                <div>
                  <p class="text-sm text-muted-foreground mb-2">Subject</p>
                  <p class="font-semibold">Mathematics</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between p-6 bg-muted/50 rounded-2xl border border-border">
              <div class="flex items-center gap-4">
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-9 px-4 py-2 gap-2">
                  <FontAwesomeIcon icon={faThumbsUp} />
                  42 Helpful
                </button>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-9 px-4 py-2 gap-2">
                  <FontAwesomeIcon icon={faComment} />{" "}
                  14 Comments
                </button>
              </div>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 border border-transparent min-h-9 px-4 py-2 gap-2">
                <FontAwesomeIcon icon={faShareFromSquare} />{" "}
                Share
              </button>
            </div>
            <AboutAuthor />
          </div>
          <div class="lg:col-span-1">
            <div class="rounded-xl border bg-card text-card-foreground sticky top-20 shadow-xl">
              <div class="flex flex-col space-y-1.5 p-6">
                <div class="font-semibold tracking-tight text-2xl text-primary">
                  Free to Download
                </div>
              </div>
              <div class="p-6 pt-0 space-y-4">
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full h-12 gap-2 font-semibold text-base">
                  <FontAwesomeIcon icon={faDownload}  />{" "}
                  Download Now
                </button>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-9 px-4 py-2 w-full h-12 gap-2">
                  <FontAwesomeIcon icon={faShareFromSquare} />{" "}
                  Share Document
                </button>
                <div class="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <div>
                    <p class="text-muted-foreground">
                      <strong>Uploaded:</strong> 15 days ago
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">
                      <strong>Last Updated:</strong> 2 days ago
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">
                      <strong>Pages:</strong> 28
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">
                      <strong>Language:</strong> English
                    </p>
                  </div>
                </div>
                <div class="mt-6 pt-6 border-t border-border">
                  <h3 class="font-semibold mb-3">Topics Covered</h3>
                  <div class="flex flex-wrap gap-2">
                    <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground text-xs">
                      Derivatives
                    </div>
                    <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground text-xs">
                      Integrals
                    </div>
                    <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground text-xs">
                      Limits
                    </div>
                    <div class="whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground text-xs">
                      Functions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommentCard />
      </div>
    </Layout>
  );
};
export default DocumentDetail;
