import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import authService from "../services/authService";
import { useLanguage } from "../i18n/LanguageContext";

const ResetPassword = () => {
  const [, setLocation] = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useLanguage();

  const resetPasswordSchema = z
    .object({
      password: z.string().min(6, t.validation.passwordMin),
      confirmPassword: z
        .string()
        .min(6, t.validation.confirmPasswordMin),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.validation.passwordsDontMatch,
      path: ["confirmPassword"],
    });

  
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false);
        setErrorMessage(t.validation.resetTokenMissing);
        return;
      }

      try {
        const response = await authService.validateResetToken(token);
        if (response.success) {
          setIsTokenValid(true);
        }
      } catch (error) {
        const message =
          error.response?.data?.message ||
          t.validation.invalidOrExpiredToken;
        setErrorMessage(message);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const response = await authService.resetPassword(token, data.password);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setErrorMessage(message);
    }
  };

  
  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col justify-center text-center bg-muted/30 pt-5">
          <h1 className="text-3xl font-bold mb-2 font-heading text-primary">
            Docs4Study
          </h1>
          <p className="text-muted-foreground">
            {t.resetPassword.tagline}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 w-full pt-3">
          <div className="w-full max-w-md">
            <div className="shadow-lg rounded-lg bg-card border border-border p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t.resetPassword.validating}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái thành công
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col justify-center text-center bg-muted/30 pt-5">
          <h1 className="text-3xl font-bold mb-2 font-heading text-primary">
            Docs4Study
          </h1>
          <p className="text-muted-foreground">
            {t.resetPassword.tagline}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.resetPassword.successTitle}</h2>
                <p className="text-muted-foreground">
                  {t.resetPassword.successMessage}
                </p>
              </div>

              <button
                onClick={() => setLocation("/auth")}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium"
              >
                {t.resetPassword.goToLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Trạng thái token không hợp lệ
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col justify-center text-center bg-muted/30 pt-5">
          <h1 className="text-3xl font-bold mb-2 font-heading text-primary">
            Docs4Study
          </h1>
          <p className="text-muted-foreground">
            {t.resetPassword.tagline}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 w-full pt-3">
          <div className="w-full max-w-md">
            <div className="shadow-lg rounded-lg bg-card border border-border p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t.resetPassword.invalidTitle}</h2>
                <p className="text-muted-foreground mb-4">
                  {errorMessage ||
                    t.resetPassword.invalidMessage}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.resetPassword.invalidExpiry}
                </p>
              </div>

              <button
                onClick={() => setLocation("/forgot-password")}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium mb-3"
              >
                {t.resetPassword.requestNew}
              </button>

              <button
                onClick={() => setLocation("/auth")}
                className="w-full px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                {t.resetPassword.backToLogin}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form đặt lại mật khẩu
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-col justify-center text-center bg-muted/30 pt-5">
        <h1 className="text-3xl font-bold mb-2 font-heading text-primary">
          Docs4Study
        </h1>
        <p className="text-muted-foreground">
          {t.resetPassword.tagline}
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8 w-full pt-3">
        <div className="w-full max-w-md">
          <div className="shadow-lg rounded-lg bg-card border border-border">
            <div className="bg-muted rounded-t-lg p-6">
              <h2 className="text-2xl font-bold">{t.resetPassword.title}</h2>
              <p className="text-muted-foreground text-sm mt-2">
                {t.resetPassword.subtitle}
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
                <label className="block text-sm font-medium mb-2">
                  {t.resetPassword.newPassword}
                </label>
                <input
                  type="password"
                  placeholder={t.resetPassword.newPasswordPlaceholder}
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
                  {t.resetPassword.confirmPassword}
                </label>
                <input
                  type="password"
                  placeholder={t.resetPassword.confirmPasswordPlaceholder}
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
                {isSubmitting ? t.resetPassword.resetting : t.resetPassword.resetButton}
              </button>

              <button
                type="button"
                onClick={() => setLocation("/auth")}
                className="w-full px-4 py-2 border border-input rounded-lg hover:bg-accent transition-colors"
              >
                {t.resetPassword.backToLogin}
              </button>
            </form>
          </div>

          <a
            href="/"
            className="text-center block mt-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.resetPassword.backToHome}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
