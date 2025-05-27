"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer, BackButton } from "@/components";
import { useAuth, useUserInfo } from "@/hooks";
import { KycVerificationForm } from "@/app/components/kyc/KycVerificationForm";
import { Loading } from "@/components/ui/Loading";

export default function KycVerifyPage() {
  const router = useRouter();
  const { accountId } = useAuth();
  const { isLoading, account, accountType } = useUserInfo();

  useEffect(() => {
    if (!accountId) {
      router.push("/");
      return;
    }

    if (!isLoading && (!account || accountType !== "user")) {
      router.push("/destinations");
    }
  }, [accountId, isLoading, account, accountType, router]);

  if (!accountId || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Loading..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!account || accountType !== "user") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <BackButton href="/user/dashboard">Back to Dashboard</BackButton>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200">
            <KycVerificationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
