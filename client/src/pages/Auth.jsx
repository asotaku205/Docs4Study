import React from "react";
import { useState } from "react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col justify-center text-center bg-muted/30 pt-5">
        <h1 className="text-3xl font-bold mb-2 font-heading text-primary">
          Docs4Study
        </h1>
        <p className="text-muted-foreground">
          Your gateway to unlimited learning.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 w-full pt-3">
        <div className="w-full max-w-md">
          <div className="shadow-lg rounded-b-lg bg-card border border-border  w-full rounded-t-lg ">
            <div className="bg-muted grid grid-cols-2 text-center rounded-t-lg p-2">
              <button
                className={
                  activeTab === "login"
                    ? " rounded-lg text-primary p-2 bg-white"
                    : "text-muted-foreground p-2"
                }
                onClick={() => {
                  setActiveTab("login");
                }}
              >
                Login
              </button>
              <button
                className={
                  activeTab === "register"
                    ? " rounded-lg text-primary p-2 bg-white"
                    : "text-muted-foreground p-2"
                }
                onClick={() => {
                  setActiveTab("register");
                }}
              >
                Register
              </button>
            </div>
            {activeTab === "login" ? (
              <div>
                <div className="p-6">
                  <p className="font-bold ">Welcome back!</p>
                  <p className="text-muted-foreground text-sm">
                    Log in to continue your learning journey with Docs4Study.
                  </p>
                </div>
                <form className="flex flex-col space-y-4 p-6 pt-0">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="m@example.com"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <a
                    href="#"
                    className="text-sm text-primary hover:underline self-end"
                  >
                    Forgot password?
                  </a>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                  >
                    Login
                  </button>

                  <div className="flex items-center">
                    <hr className="flex-grow border-t border-border" />
                    <span className="px-3 text-sm text-muted-foreground">
                      Or continue with
                    </span>
                    <hr className="flex-grow border-t border-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-var(--input) rounded-md hover:bg-accent transition-colors "
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-var(--input) rounded-md hover:bg-accent transition-colors"
                    >
                      Facebook
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="p-6">
                  <p className="font-bold ">Create an account</p>
                  <p className="text-muted-foreground text-sm">
                    Start your journey with Docs4Study.
                  </p>
                </div>
                <form className="flex flex-col space-y-4 p-6 pt-0">
                  <div className=" gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Peter Parker"
                        className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="m@example.com"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Comfirm Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                  >
                    Register
                  </button>
                </form>
              </div>
            )}
          </div>

          <a
            href="/"
            className="text-center block mt-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
