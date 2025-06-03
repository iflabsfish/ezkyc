"use client";
import { Header, Footer } from "@/components";
import { DestinationCards } from "../components/home/DestinationCards";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useUserInfo } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/Loading";

export default function DestinationsPage() {
  const { accountId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowId = searchParams?.get('flowId') || null;
  const { isLoading, account, accountType, error } = useUserInfo();

  const shouldAutoSelectUser = useMemo(() => {
    return flowId && !isLoading && !account;
  }, [flowId, isLoading, account]);

  useEffect(() => {
    // If the user is not logged in, redirect to the home page
    if (!accountId) {
      router.push("/");
      return;
    }

    if (!isLoading && account) {
      if (accountType === "user") {
        const dashboardUrl = flowId 
          ? `/user/dashboard?flowId=${encodeURIComponent(flowId)}`
          : "/user/dashboard";
        router.push(dashboardUrl);
      } else if (accountType === "company") {
        router.push("/company/dashboard");
      }
      return;
    }

    if (shouldAutoSelectUser) {
      const userPageUrl = flowId 
        ? `/user?flowId=${encodeURIComponent(flowId)}`
        : "/user";
      router.push(userPageUrl);
    }
  }, [accountId, isLoading, account, accountType, router, flowId, shouldAutoSelectUser]);

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

  if (shouldAutoSelectUser) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Setting up your account..." />
        </main>
        <Footer />
      </div>
    );
  }

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
            <DestinationCards flowId={flowId} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
