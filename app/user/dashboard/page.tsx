"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components";
import { User, UserKycVerificationWithFlow } from "@/types";
import { useUserInfo } from "@/hooks";
import { Button } from "@/components/ui/button";
import { KycVerificationList } from "@/app/components/kyc/KycVerificationList";
import { Plus, RefreshCw } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUserContext } from "@/app/context/AuthUserContext";
import { Loading } from "@/components/ui/Loading";

export default function UserDashboard() {
  const router = useRouter();
  const { accountId } = useAuth();
  const { userInfo } = useAuthUserContext();
  const [verifications, setVerifications] = useState<
    UserKycVerificationWithFlow[]
  >([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(false);
  const { fetchWithToken } = useAuth();

  const fetchVerifications = useCallback(async () => {
    if (!accountId) return;

    try {
      setIsLoadingVerifications(true);
      const response = await fetchWithToken("/api/kyc/get-user-verifications");

      if (!response || !response.ok) {
        throw new Error("Failed to fetch KYC verifications");
      }

      const data = await response.json();
      setVerifications(data.verifications || []);
    } catch (error) {
      console.error("Error fetching KYC verifications:", error);
    } finally {
      setIsLoadingVerifications(false);
    }
  }, [accountId, fetchWithToken]);

  useEffect(() => {
    if (!accountId) {
      router.push("/");
      return;
    }

    if (!userInfo.isLoading && userInfo.accountType !== "user") {
      router.push("/destinations");
      return;
    }

    fetchVerifications();
  }, [accountId, userInfo, router, fetchVerifications]);

  const handleDeleteVerification = useCallback((verificationId: string) => {
    setVerifications((verifs) => verifs.filter((v) => v.id !== verificationId));
  }, []);

  if (!accountId || userInfo.isLoading) {
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

  if (!userInfo.account || userInfo.accountType !== "user") {
    return null;
  }

  const userData = userInfo.account as User;
  const hasPending = verifications.some((v) => v.status === "pending");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <span className="text-indigo-600 text-xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.name}
                </h1>
                {userData.email && (
                  <p className="text-gray-600">{userData.email}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                KYC Verifications
              </h2>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={fetchVerifications}
                  disabled={isLoadingVerifications}
                  className="flex items-center"
                >
                  {isLoadingVerifications ? (
                    <span className="h-4 w-4 mr-1 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"></span>
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Refresh
                </Button>
                <Tooltip
                  showTip={hasPending}
                  content={
                    <>
                      You have a pending verification. Please scan the QR code
                      to continue,
                      <br />
                      or delete the pending verification.
                    </>
                  }
                >
                  <span>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (hasPending) {
                          alert(
                            "You have a pending verification. Please scan the QR code to continue verification, or delete the pending verification."
                          );
                          return;
                        }
                        router.push("/kyc/verify");
                      }}
                      className="flex items-center"
                      disabled={hasPending}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Verification
                    </Button>
                  </span>
                </Tooltip>
              </div>
            </div>

            {isLoadingVerifications ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading verifications...</p>
              </div>
            ) : verifications.length === 0 ? (
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
                  No KYC Verifications Yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Complete your first KYC verification to participate in
                  blockchain projects.
                </p>
                <Button
                  onClick={() => router.push("/kyc/verify")}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Start Verification
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <KycVerificationList
                  verifications={verifications}
                  onDelete={handleDeleteVerification}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
