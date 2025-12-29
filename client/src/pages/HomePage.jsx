import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";

const HomePage = () => {
  return (
    <Layout>
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
                src="/library.png"
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
      <section className="py-16 bg-background">
        <div className="mx-auto px-4 container">
          <div className="flex items-center justify-between mb-8">
            <div className=" ">
              <h2 className="font-bold font-leading text-foreground text-3xl">
                Featured Insights
              </h2>
              <p className="text-muted-foreground mt-2 ">
                Our topic for this week.
              </p>
            </div>
            <div>
              <button>View all blog</button>
              <icon></icon>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 border rounded-lg p-6 hover-elevate bg-card">
            <img
              src="library.png"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            ></img>
            <div className="p-8 lg:p-12 flex flex-col justify-center text-left">
              <div className="flex items-center mb-4 gap-2">
                <div className="border rounded-md bg-card text-primary boder-primary/20 px-2 py-1 text-sm font-medium">
                  Development
                </div>
                <span className="text-sm text-muted-foreground">
                  Dev 15,2025
                </span>
              </div>

              <h3 className="font-bold text-2xl mb-4 font-leading">
                Mastering React in 2025: A Comprehensive Guide
              </h3>

              <p className="text-muted-foreground mb-6">
                Everything you need to know about the latest features in React
                ecosystem.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex item-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    S
                  </div>
                  <div className="">
                    <p className="font-sm font-semibold">Anh Son</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                  </div>
                </div>
                <button className="bg-primary text-secondary px-3 py-2 rounded">
                  Read Article
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-3xl mb-8 text-foreground text-center">
            Latest Update
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="overflow-hidden">
                <img
                  src="/library.png"
                  alt="Article Image"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 gap-2 justify-between">
                  <div className="text-sm text-secondary-foreground font-medium border rounded-md bg-card bg-secondary px-2 py-1 border-primary/20">
                    Developement
                  </div>
                  <span className="text-sm text-muted-foreground ">
                    Dec 25, 2025
                  </span>
                </div>
                <div className="text-leading text-primary font-bold">
                  Mastering React in 2025: A Comprehensive Guide
                </div>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Everything you need to know about the latest features in React
                  ecosystem.
                </p>
              </div>
              <div className="flex items-center p-6 border-t border-border pt-4 mt-auto">
                <span className="text-xs text-muted-foreground font-semibold">
                  By Anh Son
                </span>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="overflow-hidden">
                <img
                  src="/library.png"
                  alt="Article Image"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 gap-2 justify-between">
                  <div className="text-sm text-secondary-foreground font-medium border rounded-md bg-card bg-secondary px-2 py-1 border-primary/20">
                    Developement
                  </div>
                  <span className="text-sm text-muted-foreground ">
                    Dec 25, 2025
                  </span>
                </div>
                <div className="text-leading text-primary font-bold">
                  Mastering React in 2025: A Comprehensive Guide
                </div>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Everything you need to know about the latest features in React
                  ecosystem.
                </p>
              </div>
              <div className="flex items-center p-6 border-t border-border pt-4 mt-auto">
                <span className="text-xs text-muted-foreground font-semibold">
                  By Anh Son
                </span>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden border-border hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="overflow-hidden">
                <img
                  src="/library.png"
                  alt="Article Image"
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 gap-2 justify-between">
                  <div className="text-sm text-secondary-foreground font-medium border rounded-md bg-card bg-secondary px-2 py-1 border-primary/20">
                    Developement
                  </div>
                  <span className="text-sm text-muted-foreground ">
                    Dec 25, 2025
                  </span>
                </div>
                <div className="text-leading text-primary font-bold">
                  Mastering React in 2025: A Comprehensive Guide
                </div>
              </div>
              <div className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">
                  Everything you need to know about the latest features in React
                  ecosystem.
                </p>
              </div>
              <div className="flex items-center p-6 border-t border-border pt-4 mt-auto">
                <span className="text-xs text-muted-foreground font-semibold">
                  By Anh Son
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-foreground">
                    Popular Documents
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Most viewed study materials
                  </p>
                </div>
                <button className="text-sm font-medium">View all</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
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
                        Intermediate
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
                      Calculus I - Final Exam Cheatsheet
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
                      Comprehensive formula sheet for derivatives and integrals.
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
                      <span>340 downloaded</span>
                      <span>1.2k views</span>
                    </div>
                  </button>
                </div>
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
                        Intermediate
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
                      Calculus I - Final Exam Cheatsheet
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
                      Comprehensive formula sheet for derivatives and integrals.
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
                      <span>340 downloaded</span>
                      <span>1.2k views</span>
                    </div>
                  </button>
                </div>
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
                        Intermediate
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
                      Calculus I - Final Exam Cheatsheet
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
                      Comprehensive formula sheet for derivatives and integrals.
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
                      <span>340 downloaded</span>
                      <span>1.2k views</span>
                    </div>
                  </button>
                </div>
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
                        Intermediate
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm h-10 text-left">
                      Calculus I - Final Exam Cheatsheet
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-2 min-h-8 text-left">
                      Comprehensive formula sheet for derivatives and integrals.
                    </p>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-auto border-t pt-4">
                      <span>340 downloaded</span>
                      <span>1.2k views</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="flex  justify-between items-end mb-8">
                <div className="">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                    Recommended Courses
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Top-rated learning paths{" "}
                  </p>
                </div>
                <button className="text-sm font-medium">View all</button>
              </div>

              <div className="space-y-4">
                <button className="group w-full overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left">
                  <div className="flex gap-4 h-32">
                    <div className="h-full w-32 overflow-hidden shrink-0">
                      <img
                        src="library.png"
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
                            Advance
                          </div>
                          <span className="text-primary font-bold text-md">
                            99$
                          </span>
                        </div>

                        <h4>Advanced Web Development</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                           12 Lessons
                        </span>
                       <span>
                        4.8 Rating
                       </span>
                      
                      </div>
                      
                    </div>
                  </div>
                </button>
                <button className="group w-full overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left">
                  <div className="flex gap-4 h-32">
                    <div className="h-full w-32 overflow-hidden shrink-0">
                      <img
                        src="library.png"
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
                            Advance
                          </div>
                          <span className="text-primary font-bold text-md">
                            99$
                          </span>
                        </div>

                        <h4>Advanced Web Development</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                           12 Lessons
                        </span>
                       <span>
                        4.8 Rating
                       </span>
                      
                      </div>
                      
                    </div>
                  </div>
                </button>
                <button className="group w-full overflow-hidden rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left">
                  <div className="flex gap-4 h-32">
                    <div className="h-full w-32 overflow-hidden shrink-0">
                      <img
                        src="library.png"
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="rounded-md px-2  text-sm border border-primary/20 inline-block whitespace-nowrap">
                            Advance
                          </div>
                          <span className="text-primary font-bold text-md">
                            99$
                          </span>
                        </div>

                        <h4>Advanced Web Development</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                           12 Lessons
                        </span>
                       <span>
                        4.8 Rating
                       </span>
                      
                      </div>
                      
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold">
            Ready to Elevate Your Learning Journey?
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-blue-100">
            Join Docs4Study today and unlock a world of knowledge at your
            fingertips. Whether you're a student, professional, or lifelong
            learner, we have the resources to help you succeed.
          </p>
          
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap hover-elevate active-elevate-2 border border-primary-border min-h-10 rounded-md bg-white text-primary hover:bg-blue-50 text-base font-semibold px-8">
              Create Your Free Account
            </button>
            
          
        </div>
      </section>
    </Layout>
  );
};
export default HomePage;
