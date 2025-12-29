import React from "react";
import Layout from "../components/Layout";
import { Link } from "wouter";
import BlogCard from "../components/users/blogCard";
import HeroPost from "../components/users/heroPost";
const Blog = () => {
  return (
    <Layout>
      <section className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-12">
          <div className="flex item-start justify-between gap-4 mb-8">
            <h1 className="font-bold font-leading text-4xl">Knowledge Hub</h1>
            <Link href="/blog/create">
              <button className="ml-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition">
                Create Post
              </button>
            </Link>
          </div>
          <HeroPost
            image="/library.png"
            category="Development"
            date="Dec 25, 2025"
            title="Mastering React in 2025: A Comprehensive Guide"
            description="Everything you need to know about the latest features in React ecosystem."
            author="Anh Son"
          />
          <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border">
            <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition whitespace-nowrap">
              All Post
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Development
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Design
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Marketing
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Business
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Productivity
            </button>
            <button className="px-4 py-2 bg-card text-muted-foreground rounded-full font-medium text-sm hover:bg-accent/80 transition whitespace-nowrap">
              Lifestyle
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 md:grid-cols-2 ">
            <BlogCard
              image="/library.png"
              category="Development"
              date="Dec 25, 2025"
              title="Mastering React in 2025: A Comprehensive Guide"
              description="Everything you need to know about the latest features in React ecosystem."
              author="Anh Son"
            />
            <BlogCard
              image="/library.png"
              category="Development"
              date="Dec 25, 2025"
              title="Mastering React in 2025: A Comprehensive Guide"
              description="Everything you need to know about the latest features in React ecosystem."
              author="Anh Son"
            />
            <BlogCard
              image="/library.png"
              category="Development"
              date="Dec 25, 2025"
              title="Mastering React in 2025: A Comprehensive Guide"
              description="Everything you need to know about the latest features in React ecosystem."
              author="Anh Son"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Blog;
