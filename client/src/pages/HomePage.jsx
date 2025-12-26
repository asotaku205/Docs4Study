import React from "react";
import { useState } from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Docs4Study</h1>
          <p className="text-xl text-slate-300 mb-8">
            Your gateway to quality educational resources and community-driven
            knowledge sharing.
          </p>
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
