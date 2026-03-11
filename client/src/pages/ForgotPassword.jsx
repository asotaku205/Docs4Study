import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import authService from "../services/authService";
import { useLanguage } from "../i18n/LanguageContext";

const ForgotPassword = () => {
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  const forgotPasswordSchema = z.object({
    email: z.string().email(t.validation.invalidEmail),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const response = await authService.forgotPassword(data.email);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occurred. Please try again.";
      setErrorMessage(message);
    }
  };

  if (isSuccess) {
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
            <div className="shadow-lg rounded-lg bg-card border border-border p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.forgotPassword.checkEmail}</h2>
                <p className="text-muted-foreground">
                  {t.forgotPassword.checkEmailDescription}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>{t.alerts.note}</strong> {t.forgotPassword.resetLinkExpire}
                </p>
              </div>

              <button
                onClick={() => setLocation("/auth")}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                {t.forgotPassword.backToLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="shadow-lg rounded-lg bg-card border border-border">
            <div className="bg-muted rounded-t-lg p-6">
              <h2 className="text-2xl font-bold">{t.forgotPassword.title}?</h2>
              <p className="text-muted-foreground text-sm mt-2">
                {t.forgotPassword.subtitle}
              </p>
            </div>

            <form
              className="flex flex-col space-y-4 p-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">{t.forgotPassword.emailLabel}</label>
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

              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.forgotPassword.sending : t.forgotPassword.sendButton}
              </button>

              <button
                type="button"
                onClick={() => setLocation("/auth")}
                className="w-full px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                {t.forgotPassword.backToLogin}
              </button>
            </form>
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

export default ForgotPassword;
