"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { User, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUserContext } from "../context/AuthUserContext";
import { User as UserType } from "@/types";

export default function UserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowId = searchParams?.get('flowId') || null;
  const { accountId } = useAuth();
  const { fetchWithToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { setUserInfo } = useAuthUserContext();

  useEffect(() => {
    if (!accountId) {
      router.push("/");
    }
  }, [accountId, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!username.trim()) {
        setError("Please fill in your name");
        return;
      }

      // Email validation only if email is provided
      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
        }
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetchWithToken("/api/user/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            email: email.trim() || undefined, // Send undefined if email is empty
            type: "user",
          }),
        });

        const data = await response?.json();

        if (!response?.ok) {
          throw new Error(data.message || "Failed to create user");
        }

        const userData: UserType = data.user;
        setUserInfo({
          isLoading: false,
          error: null,
          account: userData,
          accountType: "user",
        });

        const dashboardUrl = flowId 
          ? `/user/dashboard?flowId=${encodeURIComponent(flowId)}`
          : "/user/dashboard";
        router.push(dashboardUrl);
      } catch (err) {
        console.error("Error creating user:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [username, email, fetchWithToken, setUserInfo, router, flowId]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Personal Profile Setup
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Complete your profile to personalize your experience and access
              all features.
            </p>
            {flowId && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  You'll be automatically set up for KYC verification after completing your profile.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-xl font-medium text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
            </div>

            {error && (
              <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <User className="h-4 w-4 mr-1 text-indigo-500" />
                  Full Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                    transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your legal name as it appears on your ID
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Mail className="h-4 w-4 mr-1 text-indigo-500" />
                  Email Address <span className="text-gray-400 ml-1">(Optional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                    transition-all duration-200"
                  placeholder="Enter your email address (optional)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: We'll use this for account recovery and notifications
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-medium
                    hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                    focus:ring-offset-2 transition-all duration-200 flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Creating Profile...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Your personal information is protected by our privacy policy and
            security measures.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
