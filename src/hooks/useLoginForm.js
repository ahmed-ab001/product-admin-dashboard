"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Custom hook to manage login form state, validation, submission,
 * and error handling cleanly decoupled from the UI component.
 */
export function useLoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Ref lock to strictly guard against concurrent submissions
  const lockRef = useRef(false);

  // Validate form fields before dispatching API calls
  const validate = useCallback(() => {
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 3) {
      errors.password = "Password must be at least 3 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [username, password]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      // Prevent duplicate submissions if already submitting or locked
      if (isSubmitting || lockRef.current) {
        return;
      }

      setErrorMessage("");

      if (!validate()) {
        return;
      }

      lockRef.current = true;
      setIsSubmitting(true);

      try {
        await login(username.trim(), password);
        setIsSuccess(true);
        // Redirect to /products upon successful authentication
        router.replace("/products");
      } catch (err) {
        // Human-friendly error messaging for incorrect credentials or network issues
        const message =
          err?.message || "Invalid credentials. Please verify and try again.";
        setErrorMessage(message);
        setIsSuccess(false);
      } finally {
        setIsSubmitting(false);
        lockRef.current = false;
      }
    },
    [username, password, isSubmitting, validate, login, router]
  );

  const fillDemoCredentials = useCallback((demoUser = "emilys", demoPass = "emilyspass") => {
    setUsername(demoUser);
    setPassword(demoPass);
    setFieldErrors({});
    setErrorMessage("");
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage("");
  }, []);

  return {
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
  };
}

export default useLoginForm;
