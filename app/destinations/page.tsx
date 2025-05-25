"use client";
import { Header, Footer } from "@/components";
import { DestinationCards } from "../components/home/DestinationCards";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useUserInfo } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/Loading";

export default function DestinationsPage() {
  const { accountId } = useAuth();
  const router = useRouter();
  const { isLoading, account, accountType, error } = useUserInfo();

  useEffect(() => {
    // If the user is not logged in, redirect to the home page
    if (!accountId) {
      router.push("/");
      return;
    }

    // If user information is loaded and exists, redirect to the corresponding dashboard
    if (!isLoading && account) {
      if (accountType === "user") {
        router.push("/user/dashboard");
      } else if (accountType === "company") {
        router.push("/company/dashboard");
      }
    }
  }, [accountId, isLoading, account, accountType, router]);

  // If the user is not logged in or information is loading, do not display content
  if (!accountId || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          {isLoading && <Loading text="Loading..." />}
        </main>
        <Footer />
      </div>
    );
  }

  // If the user is logged in but has not completed information, show the selection page
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome,{" "}
            <span className="text-indigo-600">
              {account?.name || "Anonymous User"}
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Please select your account type to continue
          </p>
          <div className="w-full max-w-4xl mx-auto">
            <DestinationCards />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
