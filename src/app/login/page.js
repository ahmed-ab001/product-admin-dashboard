"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect immediately to /products
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/products");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingSpinner fullPage label="Checking session..." />;
  }

  // Prevent flash of login form while redirecting authenticated user
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50">
      <LoginForm />
      <p className="mt-8 text-center text-xs text-gray-500">
        Product Admin Dashboard &bull; Powered by DummyJSON Auth API
      </p>
    </div>
  );
}
