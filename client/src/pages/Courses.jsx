import React from "react";
import Layout from "../components/Layout";
import CardCourses from "../components/users/cardCourses";
const Courses = () => {
  return (
    <Layout>
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 space-y-4">
          <h1 className="text-4xl font-bold font-heading">Online Courses</h1>
          <p>
            Explore our wide range of courses designed to help you enhance your
            skills and knowledge across various subjects.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-6">
            <button className="bg-white text-primary px-4 py-2 rounded-md ">
              All
            </button>
            <button className="px-4 py-2 rounded-md  hover:bg-white hover:text-primary  ">
              Development
            </button>
            <button className="px-4 py-2 rounded-md  hover:bg-white hover:text-primary  ">
              Design
            </button>
            <button className="px-4 py-2 rounded-md  hover:bg-white hover:text-primary  ">
              Marketing
            </button>
            <button className="px-4 py-2 rounded-md  hover:bg-white hover:text-primary  ">
              Business
            </button>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardCourses
            image="library.png"
            title="Advanced Web Development"
            description="Full stack journey with Node.js and React."
            duration="8 weeks"
            students="120"
            price="199"
            />
            <CardCourses
            image="library.png"
            title="Advanced Web Development"
            description="Full stack journey with Node.js and React."
            duration="8 weeks"
            students="120"
            price="199"
            />
            <CardCourses
            image="library.png"
            title="Advanced Web Development"
            description="Full stack journey with Node.js and React."
            duration="8 weeks"
            students="120"
            price="199"
            />
            <CardCourses
            image="library.png"
            title="Advanced Web Development"
            description="Full stack journey with Node.js and React."
            duration="8 weeks"
            students="120"
            price="199"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
