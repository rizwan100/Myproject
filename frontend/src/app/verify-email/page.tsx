"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

function VerifyEmailContent() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(result.message);
        } else {
          setStatus("error");
          setMessage(result.detail || "Verification failed");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-rose-600 font-medium">
                Home
              </Link>
              <Link href="/register" className="text-gray-700 hover:text-rose-600 font-medium">
                Register Free
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-rose-600 font-medium">
                Advanced Search
              </Link>
              <Link href="/proposals" className="text-gray-700 hover:text-rose-600 font-medium">
                Proposals
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-rose-600 font-medium">
                Login
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild className="hidden sm:inline-flex bg-rose-600 hover:bg-rose-700">
                <Link href="/login">Login</Link>
              </Button>
              <button
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-rose-600 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Free
                </Link>
                <Link
                  href="/search"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Advanced Search
                </Link>
                <Link
                  href="/proposals"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Proposals
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-4 sm:mx-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === "loading" && <Loader2 className="h-12 w-12 text-rose-600 animate-spin" />}
              {status === "success" && <CheckCircle className="h-12 w-12 text-green-600" />}
              {status === "error" && <XCircle className="h-12 w-12 text-red-600" />}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <CardDescription>
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" && (
              <div className="space-y-4">
                <Button asChild className="w-full bg-rose-600 hover:bg-rose-700">
                  <Link href="/login">Continue to Login</Link>
                </Button>
              </div>
            )}
            {status === "error" && (
              <div className="space-y-4">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/register">Back to Registration</Link>
                </Button>
              </div>
            )}
            {status === "loading" && (
              <div className="text-center text-sm text-gray-600">
                Please wait while we verify your email address...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-rose-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
