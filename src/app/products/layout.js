"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

export default function ProductsLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
