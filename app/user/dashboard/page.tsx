"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { User, UserKycVerificationWithFlow } from "@/types";
import { useUserInfo } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { KycVerificationList } from "@/app/components/kyc/KycVerificationList";
import { Plus, RefreshCw } from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useAuthUserContext } from "@/app/context/AuthUserContext";
import { Loading } from "@/components/ui/Loading";
import { useFlowValidation } from "@/hooks/useFlowValidation";

export default function UserDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flowId = searchParams?.get("flowId") || null;
  const { accountId } = useAuth();
  const { userInfo } = useAuthUserContext();
  const [verifications, setVerifications] = useState<
    UserKycVerificationWithFlow[]
  >([]);
  const [isLoadingVerifications, setIsLoadingVerifications] = useState(false);
  const [isCheckingFlow, setIsCheckingFlow] = useState(false);
  const { fetchWithToken } = useAuth();

  const { flowData, flowValidationStatus, isFlowActive, flowExists } =
    useFlowValidation(flowId);

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

  const checkAndStartKycFlow = useCallback(async () => {
    if (!flowId || !accountId) return;

    if (flowValidationStatus !== "valid") {
      console.log("Flow is not valid or active, skipping auto-start");
      return;
    }

    try {
      setIsCheckingFlow(true);

      const hasPendingVerification = verifications.some(
        (v) => v.status === "pending"
      );
      if (hasPendingVerification) {
        console.log(
          "User already has pending verification, skipping auto-start"
        );
        return;
      }

      const hasParticipatedInFlow = verifications.some(
        (v) => v.kycFlowId === flowId
      );
      if (hasParticipatedInFlow) {
        console.log(
          "User already participated in this flow, skipping auto-start"
        );
        return;
      }

      const verifyUrl = `/kyc/verify?flowId=${encodeURIComponent(flowId)}`;
      router.push(verifyUrl);
    } catch (error) {
      console.error("Error checking flow for auto-start:", error);
    } finally {
      setIsCheckingFlow(false);
    }
  }, [flowId, accountId, flowValidationStatus, verifications, router]);

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

  useEffect(() => {
    if (
      flowId &&
      !isLoadingVerifications &&
      verifications.length >= 0 &&
      flowValidationStatus !== "loading"
    ) {
      checkAndStartKycFlow();
    }
  }, [
    flowId,
    isLoadingVerifications,
    verifications,
    flowValidationStatus,
    checkAndStartKycFlow,
  ]);

  const handleDeleteVerification = useCallback((verificationId: string) => {
    setVerifications((prev) =>
      prev.filter((verification) => verification.id !== verificationId)
    );
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

  if (isCheckingFlow && flowId) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Setting up verification..." />
        </main>
        <Footer />
      </div>
    );
  }

  const handleStartVerification = () => {
    const verifyUrl = flowId
      ? `/kyc/verify?flowId=${encodeURIComponent(flowId)}`
      : "/kyc/verify";
    router.push(verifyUrl);
  };

  // Check if there's any pending verification
  const hasPendingVerification = verifications.some(
    (v) => v.status === "pending"
  );

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

            {flowId && (
              <div
                className={`mb-4 p-4 rounded-lg border ${
                  flowValidationStatus === "valid"
                    ? "bg-blue-50 border-blue-200"
                    : flowValidationStatus === "inactive"
                    ? "bg-yellow-50 border-yellow-200"
                    : flowValidationStatus === "invalid"
                    ? "bg-red-50 border-red-200"
                    : flowValidationStatus === "loading"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`font-medium ${
                        flowValidationStatus === "valid"
                          ? "text-blue-700"
                          : flowValidationStatus === "inactive"
                          ? "text-yellow-700"
                          : flowValidationStatus === "invalid"
                          ? "text-red-700"
                          : "text-gray-700"
                      }`}
                    >
                      {flowValidationStatus === "valid"
                        ? "Quick Verification Available"
                        : flowValidationStatus === "inactive"
                        ? "Flow Not Currently Active"
                        : flowValidationStatus === "invalid"
                        ? "Invalid Flow"
                        : flowValidationStatus === "loading"
                        ? "Validating Flow..."
                        : "Flow Validation"}
                    </p>
                    <p
                      className={`text-sm ${
                        flowValidationStatus === "valid"
                          ? "text-blue-600"
                          : flowValidationStatus === "inactive"
                          ? "text-yellow-600"
                          : flowValidationStatus === "invalid"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      Flow ID: {flowId}
                      {flowData && (
                        <span className="block mt-1">
                          Project: {flowData.projectName}
                          {flowValidationStatus === "inactive" && (
                            <span className="block">
                              Active:{" "}
                              {new Date(
                                flowData.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {flowData.endDate
                                ? new Date(
                                    flowData.endDate
                                  ).toLocaleDateString()
                                : "No end date"}
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                  {flowValidationStatus === "valid" && (
                    <Button
                      onClick={handleStartVerification}
                      variant="primary"
                      size="sm"
                    >
                      Start Verification
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                KYC Verifications
              </h2>
              <div className="flex gap-2">
                <Tooltip content="Refresh verifications" showTip={true}>
                  <Button
                    onClick={fetchVerifications}
                    variant="outline"
                    size="sm"
                    disabled={isLoadingVerifications}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isLoadingVerifications ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </Tooltip>
                <Tooltip
                  content={
                    hasPendingVerification
                      ? "You have a pending verification. Please complete or delete it before starting a new one."
                      : "Start a new KYC verification"
                  }
                  showTip={true}
                >
                  <div>
                    <Button
                      onClick={handleStartVerification}
                      variant="primary"
                      size="sm"
                      disabled={hasPendingVerification}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Verification
                    </Button>
                  </div>
                </Tooltip>
              </div>
            </div>

            {isLoadingVerifications ? (
              <div className="flex justify-center py-8">
                <Loading text="Loading verifications..." />
              </div>
            ) : (
              <KycVerificationList
                verifications={verifications}
                onDelete={handleDeleteVerification}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
