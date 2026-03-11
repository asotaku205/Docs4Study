import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import authService from "../services/authService";
import { useLanguage } from "../i18n/LanguageContext";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const registerSchema = z
    .object({
      fullName: z.string().min(2, t.validation.fullNameMin),
      email: z.string().email(t.validation.invalidEmail),
      password: z.string().min(6, t.validation.passwordMin),
      confirmPassword: z
        .string()
        .min(6, t.validation.confirmPasswordMin),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.validation.passwordsDontMatch,
      path: ["confirmPassword"],
    });

  const loginSchema = z.object({
    email: z.string().email(t.validation.invalidEmail),
    password: z.string().min(1, t.validation.wrongPassword),
  });

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
        window.location.replace("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        t.alerts.registrationError;
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
        window.location.replace("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || t.alerts.loginError;
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
          {t.auth.tagline}
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
                {t.auth.loginTab}
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
                {t.auth.registerTab}
              </button>
            </div>
            {activeTab === "login" ? (
              <div>
                <div className="p-6">
                  <p className="font-bold ">{t.auth.welcomeBack}</p>
                  <p className="text-muted-foreground text-sm">
                    {t.auth.loginSubtitle}
                  </p>
                </div>
                <form
                  className="flex flex-col space-y-4 p-6 pt-0 "
                  onSubmit={handleLoginSubmit(onSubmitLogin)}
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.auth.email}
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
                      {t.auth.password}
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
                    onClick={() => setLocation("/forgot-password")}
                    className="text-sm text-primary hover:underline self-end cursor-pointer"
                  >
                    {t.auth.forgotPassword}
                  </a>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                  >
                    {t.auth.loginButton}
                  </button>

                  <div className="flex items-center">
                    <hr className="grow border-t border-border" />
                    <span className="px-3 text-sm text-muted-foreground">
                      {t.auth.orContinueWith}
                    </span>
                    <hr className="grow border-t border-border" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="px-4 py-2 border border-var(--input) rounded-md hover:bg-accent transition-colors "
                    >
                      {t.auth.google}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-var(--input) rounded-md hover:bg-accent transition-colors"
                      disabled={isLoginSubmitting}
                    >
                      {t.auth.facebook}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="p-6">
                  <p className="font-bold ">{t.auth.createAccount}</p>
                  <p className="text-muted-foreground text-sm">
                    {t.auth.registerSubtitle}
                  </p>
                </div>
                <form
                  className="flex flex-col space-y-4 p-6 pt-0"
                  onSubmit={handleRegisterSubmit(onSubmitRegister)}
                >
                  <div className=" gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t.auth.fullName}
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
                      {t.auth.email}
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
                      {t.auth.password}
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
                      {t.auth.confirmPassword}
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
                    {t.auth.registerButton}
                  </button>
                </form>
              </div>
            )}
          </div>

          <a
            href="/"
            className="text-center block mt-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.auth.backToHome}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
