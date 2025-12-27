import React from "react";
import { useState } from "react";

const HomePage = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-primary py-20 lg:py-32">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-[url('/herobg.png')] bg-cover"></div>
        <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="whitespace-nowrap inline-flex items-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover-elevate border-transparent bg-secondary text-secondary-foreground px-4 py-1 text-sm font-medium tracking-wide  ">
              Welcome to Docs4Study
            </div>

            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-white leading-tight">
              Unlock Your Potential with{" "}
              <span className="font-semibold text-blue-200">
                {" "}
                Quality Knowledge
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto lg:mx-0">
              Access thousands of study documents, expert-led courses, and
              insightful articles to accelerate your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 ">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
                Start Reading
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium hover-elevate active-elevate-2 border [border-color:var(--button-outline)] shadow-xs active:shadow-none min-h-10 rounded-md px-8 border-white/30 text-white hover:bg-white/10 hover:text-white text-base">
                Explore Courses
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="/library.jpg"
                alt="library"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 text-white bg-gradient-to-t from-black/80 to-transparent p-8">
                "The best investment you can make is in yourself."
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-screen flex items-center justify-center bg-background/50">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Explore Our Features</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Discover a wide range of documents, online courses, and community
              insights tailored for students and professionals.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-slate-300 mb-6">
              Connect with fellow learners and educators to share knowledge,
              collaborate on projects, and grow together.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-screen flex items-center justify-center bg-background/50">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Sign up now to access a wealth of resources and take your learning
              journey to the next level with Docs4Study.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
export default HomePage;
