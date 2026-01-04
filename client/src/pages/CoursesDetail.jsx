import React from "react";
import Layout from "../components/Layout";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faStar } from "@fortawesome/free-solid-svg-icons";
import { faUsers, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import LockPart from "../components/users/Courses/LockPart";
import CompletedPart from "../components/users/Courses/CompletedPart";
import CommentCard from "../components/users/commentCard";
import AboutAuthor from "../components/users/AboutAuthor";

const CoursesDetail = () => {
  return (
    <Layout>
      <BackgroundPhoto image="/library.png" />
      <div className="container mx-auto px-4 -mt-32 relative z-10 max-w-5xl">
        <BackButton 
          link="/courses"
        />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <div className="px-4 py-2 bg-primary text-white rounded transition text-xs inline-flex mb-6">
                Development
              </div>
              <h1 className="text-4xl font-heading font-bold mb-4">
                Advance Web Development Course
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Full stack journey with Node.js and React.
              </p>
              <div className="flex items-center gap-6 py-6 border-y border-border">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />{" "}
                  <span className="font-semibold">4.8</span>{" "}
                  <span className="text-muted-foreground">(312 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} />{" "}
                  <span className="font-semibold">1,245</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} />{" "}
                  <span className="font-semibold">12 weeks</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold font-heading mb-6">
                What You'll Learn
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Build dynamic web
                    applications using React and Node.js
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Implement RESTful
                    APIs and work with databases
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Deploy applications
                    to cloud platforms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Best practices in
                    modern web development
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Hands-on projects
                    to build your portfolio
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-muted-foreground">
                    {" "}
                    <FontAwesomeIcon icon={faCircleCheck} /> Collaboration and
                    version control with Git
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8">
              <h2 className="text-2xl font-text-2xl font-bold font-heading mb-6">
                Course Course Syllabus
              </h2>
              <div className="space-y-3">
                <CompletedPart />
                <CompletedPart />
                <CompletedPart />
                <LockPart />
                <LockPart />
                <LockPart />
              </div>
            </div>
            <AboutAuthor  />
          </div>
          <div className="lg:col-span-1">
            <div class="rounded-xl border bg-card text-card-foreground sticky top-20 shadow-xl">
              <div class="p-6 pt-6">
                <div class="h-40 rounded-lg overflow-hidden mb-6">
                  <img
                    alt="Advanced Web Development"
                    class="w-full h-full object-cover"
                    src="/library.png"
                  />
                </div>
                <div class="space-y-4 mb-6">
                  <div>
                    <p class="text-sm text-muted-foreground">Price</p>
                    <div class="flex items-baseline gap-2">
                      <span class="text-3xl font-bold text-primary">$99</span>
                      <span class="text-lg line-through text-muted-foreground">
                        $129
                      </span>
                    </div>
                  </div>
                </div>
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full mb-3 gap-2 h-12 font-semibold">
                  Enroll Now
                  <FontAwesomeIcon icon={faCirclePlay} />
                </button>
                <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-9 px-4 py-2 w-full">
                  Add to Wishlist
                </button>
                <div class="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                  <p class="text-muted-foreground">
                    <strong>Lifetime Access:</strong> Learn at your own pace
                    with lifetime access to all materials.
                  </p>
                  <p class="text-muted-foreground">
                    <strong>Certificate:</strong> Get a completion certificate
                    upon finishing the course.
                  </p>
                  <p class="text-muted-foreground">
                    <strong>Support:</strong> Join our community for Q&amp;A and
                    discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommentCard/>
      </div>
    </Layout>
  );
};
export default CoursesDetail;
