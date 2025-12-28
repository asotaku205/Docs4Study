import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { is } from "zod/v4/locales";
import authService from "../services/authService";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Wrong password"),
});

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const {
    register,
    handleSubmit: handleRegisterSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitRegister = async (data) => {
    try {
      const response = await authService.signup(
        data.email,
        data.password,
        data.fullName
      );
      if (response.success) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.replace("/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration.";
      alert(errorMessage);
    }
  };

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const onSubmitLogin = async (data) => {
    try {
      const response = await authService.signin(data.email, data.password);
      if (response.success) {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.replace("/home");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during login.";
      alert(errorMessage);
    }
  };

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
                <form
                  className="flex flex-col space-y-4 p-6 pt-0 "
                  onSubmit={handleLoginSubmit(onSubmitLogin)}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      {...loginRegister("email")}
                    />
                    {loginErrors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      autoComplete="current-password"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      {...loginRegister("password")}
                    />
                    {loginErrors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {loginErrors.password.message}
                      </p>
                    )}
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
                    <hr className="grow border-t border-border" />
                    <span className="px-3 text-sm text-muted-foreground">
                      Or continue with
                    </span>
                    <hr className="grow border-t border-border" />
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
                      disabled={isLoginSubmitting}
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
                <form
                  className="flex flex-col space-y-4 p-6 pt-0"
                  onSubmit={handleRegisterSubmit(onSubmitRegister)}
                >
                  <div className=" gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Peter Parker"
                        className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      autoComplete="new-password"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      autoComplete="new-password"
                      className="w-full p-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                    disabled={isSubmitting}
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
