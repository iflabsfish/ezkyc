"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer, BackButton } from "@/components";
import { KycFlowForm } from "@/app/components/kyc/KycFlowForm";
import { useAuth, useUserInfo } from "@/hooks";
import { Loading } from "@/components/ui/Loading";

export default function CreateKycFlowPage() {
  const router = useRouter();
  const { accountId } = useAuth();
  const { isLoading, account, accountType } = useUserInfo();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!accountId) {
      router.push("/");
      return;
    }

    if (!isLoading && (!account || accountType !== "company")) {
      router.push("/company/dashboard");
    }
  }, [accountId, isLoading, account, accountType, router]);

  if (!isClient || !accountId || isLoading || !account || accountType !== "company") {
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <BackButton href="/company/dashboard">Back to Dashboard</BackButton>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden ring-1 ring-gray-200">
            <KycFlowForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
