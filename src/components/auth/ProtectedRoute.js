"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Route guard component that protects private routes.
 * While checking authentication status, renders a clean full-page spinner.
 * If unauthenticated after checking, redirects to /login.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // While hydrating credentials from storage, show a polite loading state
  if (isLoading) {
    return <LoadingSpinner fullPage label="Authenticating session..." />;
  }

  // Prevent flash of protected content before redirect completes
  if (!isAuthenticated) {
    return null;
  }

  return children;
}
