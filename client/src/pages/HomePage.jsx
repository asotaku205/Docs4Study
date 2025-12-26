import React from "react";
import { useState } from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <section className="min-h-screen relative overflow-hidden bg-primary ">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-[url('/herobg.png')] bg-cover">
        </div>
        <div className="text-left text-white grid grid-cols-2 gap-12 ">
          <div className="">
            <div className="rounded-md bg-white p-4 inline-block text-primary font-semibold  ">
              Welcome to Docs4Study
            </div> 
            <div className="">
            <h1 className="text-5xl font-bold mt-8 mb-4">Unlock Your Potential with <span className="font-semibold text-blue-200"> Quality Knowledge</span></h1>
            <p>
              Access thousands of study documents, expert-led courses, and insightful articles to accelerate your learning journey.
            </p>
            <div className=" ">
              <button className="mt-6 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors cursor-pointer select-none">
              Start Reading
              </button>
              <button>
                Explore Courses
              </button>
            </div>
          </div>
          </div>
          
          <div>
              <img src="/library.jpg" alt="library" />
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
    </div>
  );
};
export default HomePage;
