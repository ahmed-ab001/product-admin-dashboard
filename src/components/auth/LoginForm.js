"use client";

import { useLoginForm } from "@/hooks/useLoginForm";
import Button from "@/components/ui/Button";

/**
 * Pure visual presentation component for the Login screen.
 * All authentication logic, duplicate request prevention, and state management
 * are encapsulated in the useLoginForm hook.
 */
export default function LoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    fieldErrors,
    errorMessage,
    clearError,
    isSubmitting,
    isSuccess,
    handleSubmit,
    fillDemoCredentials,
  } = useLoginForm();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 backdrop-blur-sm transition-all duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the Product Admin Dashboard
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div
            id="login-error-alert"
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 border border-red-200 text-red-800 animate-fadeIn"
          >
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 text-sm font-medium">
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div
            role="status"
            className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800"
          >
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium">Login successful! Redirecting...</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Username
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) clearError();
                }}
                disabled={isSubmitting}
                placeholder="e.g. emilys"
                className={`block w-full rounded-lg border pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  fieldErrors.username
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-100"
                }`}
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) clearError();
                }}
                disabled={isSubmitting}
                placeholder="••••••••"
                className={`block w-full rounded-lg border pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50/50 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  fieldErrors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-100"
                }`}
              />
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              id="login-submit-btn"
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100/80 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800">
                Demo Credentials
              </span>
              <button
                type="button"
                id="fill-demo-credentials-btn"
                onClick={() => fillDemoCredentials("emilys", "emilyspass")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors underline underline-offset-2"
              >
                Auto-fill
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-indigo-950 font-mono">
              <div className="bg-white/80 rounded-md px-2.5 py-1.5 border border-indigo-100">
                <span className="text-gray-400 block text-[10px] uppercase font-sans">User</span>
                emilys
              </div>
              <div className="bg-white/80 rounded-md px-2.5 py-1.5 border border-indigo-100">
                <span className="text-gray-400 block text-[10px] uppercase font-sans">Pass</span>
                emilyspass
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
