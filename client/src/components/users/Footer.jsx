import React from "react";
import { useState } from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-background/30 backdrop-blur text-center py-12 w-full">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mx-auto px-4 text-left">
            <div className=" space-y-4 ">
              <span className="text-2xl font-bold gap-2 flex items-center select-none">
                <span className="bg-primary text-white px-2 py-1 rounded font-heading">
                  D4S
                </span>
                Docs4Study
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering students and professionals with high-quality
                resources, courses, and community-driven knowledge sharing.
              </p>
            </div>
            <div className=" space-y-4 ">
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Browser Documents</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Online Courses</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Blogs & News</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Help Center</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Terms of Service</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Legal</a>
                </li>
                <li className="mb-2 cursor-pointer text-muted-foreground hover:text-primary">
                  <a>Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Subscribe</h4>
              <p className="mb-4 text-muted-foreground">Get the latest updates and resources directly in your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary/80 transition-colors cursor-pointer select-none">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 ">
            <p className="text-muted-foreground mb-4">
              © 2024 Docs4Study. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
