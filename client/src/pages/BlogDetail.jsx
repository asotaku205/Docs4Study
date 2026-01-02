import React from "react";
import Layout from "../components/Layout";
import { Link } from "wouter";
import {
  faAngleLeft,
  faUserPen,
  faThumbsUp,
  faComment,
  faShareFromSquare,
  faClock,
  faCalendar
  
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogCard from "../components/users/blogCard";
import CommentCard from "../components/users/commentCard";
import BackgroundPhoto from "../components/users/BackgroundPhoto";
import BackButton from "../components/ui/BackButton";
import AboutAuthor from "../components/users/AboutAuthor";

const BlogDetail = () => {
  return (
    <Layout>
      <BackgroundPhoto image="/library.png" />
      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        <BackButton />
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3">
            <div className="bg-card rounded-2xl shadow-lg p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-4 py-2 bg-primary text-white rounded transition text-xs">
                  Development
                </div>
                <span className="text-sm text-muted-foreground">
                  <FontAwesomeIcon icon={faCalendar} /> December 31,2025
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 leading-tight">
                Mastering React in 2025: A Comprehensive Guide
              </h1>
              <div className="flex items-center justify-between pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserPen} />
                  </div>
                  <div className="">
                    <p className="font-bold text-sm">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">Editor</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {" "}
                  <FontAwesomeIcon icon={faClock} />8 min read
                </p>
              </div>
              <div className="max-w-none mt-8 mb-12 space-y-6 text-foreground">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Everything you need to know about the latest features in React
                  ecosystem.
                </p>
                <h2 className="text-2xl font-bold font-heading scroll-mt-20">
                  Introduction
                </h2>
                <p className="text-lg leading-relaxed ">
                  This comprehensive guide walks you through everything you need
                  to know. Whether you're a beginner or an experienced
                  professional, you'll find valuable insights and practical tips
                  that you can apply immediately.
                </p>
                <h2 className="text-2xl font-bold font-heading scroll-mt-20">
                  Key Takeaways
                </h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Understanding React 18 and its new features.</li>
                  <li>
                    Effective state management with Redux and Context API.
                  </li>
                  <li>
                    Building performant applications with React Suspense and
                    Concurrent Mode.
                  </li>
                  <li>
                    Best practices for testing and deploying React applications.
                  </li>
                </ul>
                <h2 className="text-2xl font-bold font-heading scroll-mt-20">
                  Getting Started with React 18
                </h2>
                <p className="text-lg leading-relaxed ">
                  By the end of this guide, you'll have a solid understanding of
                  React's capabilities in 2025 and be well-equipped to build
                  modern, efficient web applications.
                </p>
                <h2 className="text-2xl font-bold font-heading scroll-mt-20">
                  Conclusion
                </h2>
                <p className="text-lg leading-relaxed ">
                  As you implement these strategies, remember that learning is a
                  continuous journey. Stay curious, keep experimenting, and
                  don't hesitate to explore new approaches. The knowledge you
                  gain today will become the foundation for your future growth.
                </p>
              </div>
              <div className="flex items-center justify-between py-6 border-t border-b border-border">
                <div>
                  <button>
                    <FontAwesomeIcon icon={faThumbsUp} /> 36 Likes
                  </button>
                  <button className="ml-4">
                    <FontAwesomeIcon icon={faComment} /> 36 Comments
                  </button>
                </div>
                <button className="px-4 py-2 text-primary text-sm">
                  <FontAwesomeIcon icon={faShareFromSquare} /> Share
                </button>
              </div>
              <AboutAuthor  />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="rounded-xl border bg-card text-card-foreground shadow sticky top-4 overflow-hidden">
              <div className="p-6">
                <div className="border-b border-border">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    Index
                  </h3>
                </div>
                <div className="space-y-2 mt-4">
                  <button className="block w-full text-left px-3 py-2 rounded-lg transition-all text-sm bg-primary/10 text-primary font-semibold">
                    {" "}
                    Introduction
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg transition-all text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    {" "}
                    Key Takeaways
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg transition-all text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    {" "}
                    Getting Started
                  </button>
                  <button className="block w-full text-left px-3 py-2 rounded-lg transition-all text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                    {" "}
                    Conclusion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-3xl font-heading font-bold mb-8">
            Related Articles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogCard
              image="/library.png"
              category="Design"
              date="Dec 23, 2025"
              title="UI/UX Design Principles"
              description="Master the fundamentals of modern design"
              author="Anh Son"
            />
            <BlogCard
              image="/library.png"
              category="Development"
              date="Dec 20, 2025"
              title="Advanced JavaScript Techniques"
              description="Take your JS skills to the next level"
              author="Anh Son"
            />
            <BlogCard
              image="/library.png"
              category="Marketing"
              date="Dec 18, 2025"
              title="Digital Marketing Trends in 2025"
              description="Stay ahead with the latest marketing strategies"
              author="Anh Son"
            />
          </div>
        </div>
      </div>
        <CommentCard />
      
    </Layout>
  );
};
export default BlogDetail;
