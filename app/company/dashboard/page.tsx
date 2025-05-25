"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components";
import { Button } from "@/components/ui/button";
import { KycFlowCard } from "@/app/components/kyc/KycFlowCard";
import { Company, KycFlow, KycObject } from "@/types";
import { useUserInfo } from "@/hooks";
import { Plus, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useCall } from "wagmi";
import { Loading } from "@/components/ui/Loading";

function normalizeKycFlow(data: KycObject): KycFlow {
  return {
    id: data.id,
    userId: data.userId,
    projectName: data.projectName,
    startDate: data.startDate,
    endDate: data.endDate,
    verificationOptions: {
      discloseIssuingState: !!data.options?.issuing_state,
      discloseName: !!data.options?.name,
      discloseNationality: !!data.options?.nationality,
      discloseDateOfBirth: !!data.options?.date_of_birth,
      disclosePassportNumber: !!data.options?.passport_number,
      discloseGender: !!data.options?.gender,
      discloseExpiryDate: !!data.options?.expiry_date,
    },
    ageRequirement: data.options?.minimumAge ?? 0,
    countryRestrictions: data.options?.excludedCountries ?? [],
    enableOfacSanctionsCheck: data.options?.ofac ?? false,
    isDeleted: data.isDeleted,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export default function CompanyDashboard() {
  const router = useRouter();
  const { accountId } = useAuth();
  const { isLoading, account, accountType, error } = useUserInfo();
  const [kycFlows, setKycFlows] = useState<KycFlow[]>([]);
  const [isLoadingFlows, setIsLoadingFlows] = useState(false);
  const { fetchWithToken } = useAuth();

  const fetchKycFlows = useCallback(async () => {
    if (!accountId) return;

    try {
      setIsLoadingFlows(true);
      const response = await fetchWithToken("/api/kyc/flow-list");

      if (!response || !response.ok) {
        throw new Error("Failed to fetch KYC flows");
      }

      const data = await response.json();
      setKycFlows(data.flows.map(normalizeKycFlow) || []);
    } catch (error) {
      console.error("Error fetching KYC flows:", error);
    } finally {
      setIsLoadingFlows(false);
    }
  }, [accountId, fetchWithToken]);

  useEffect(() => {
    if (!accountId) {
      router.push("/");
      return;
    }

    if (!isLoading && accountType !== "company") {
      router.push("/destinations");
    }

    if (accountId) {
      fetchKycFlows();
    }
  }, [accountId, isLoading, accountType, router, fetchKycFlows]);

  const handleDeleteFlow = useCallback((flowId: string) => {
    setKycFlows((flows) => flows.filter((flow) => flow.id !== flowId));
  }, []);

  if (!accountId || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Loading..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!account || accountType !== "company") {
    return null;
  }

  const company = account as Company;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="flex items-center mb-6">
              {company.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover mr-4"
                  unoptimized
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <span className="text-indigo-600 text-xl font-bold">
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {company.name}
                </h1>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    {company.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                KYC Verification Flows
              </h2>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={fetchKycFlows}
                  disabled={isLoadingFlows}
                  className="flex items-center"
                >
                  {isLoadingFlows ? (
                    <span className="h-4 w-4 mr-1 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></span>
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/kyc/create")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Flow
                </Button>
              </div>
            </div>

            {isLoadingFlows ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading KYC flows...</p>
              </div>
            ) : kycFlows.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No KYC Flows Yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Create your first KYC verification flow to start verifying
                  user identities.
                </p>
                <Button
                  onClick={() => router.push("/kyc/create")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Flow
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kycFlows.map((flow) => (
                  <KycFlowCard
                    key={flow.id}
                    flow={flow}
                    onDelete={handleDeleteFlow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
