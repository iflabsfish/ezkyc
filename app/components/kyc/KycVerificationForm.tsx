"use client";

import { useState, useEffect, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { KycObject } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  User,
  Settings,
  ShieldCheck,
  Info,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { SelfApp } from "@selfxyz/qrcode";
import { getVerifierUrl } from "@/lib/api/env";
import { useAuth } from "@/hooks/useAuth";
import { useFlowValidation } from "@/hooks/useFlowValidation";
import { isValidEVMAddress, isValidIronAddress } from "@/lib/utils/address";
import { AddressType } from "@/types/address";

const SelfQRcodeWrapper = dynamic(
  () => import("@selfxyz/qrcode").then((mod) => mod.default),
  { ssr: false }
);

interface KycVerificationFormProps {
  flowId?: string | null;
}

export function KycVerificationForm({
  flowId: initialFlowId,
}: KycVerificationFormProps) {
  const [kycFlowId, setKycFlowId] = useState(initialFlowId || "");
  const [blockchainAddress, setBlockchainAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(initialFlowId ? 2 : 1); // Skip step 1 if flowId provided
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const { fetchWithToken } = useAuth();
  const { accountId } = useAuth();
  const router = useRouter();

  const {
    flowData: flowDetails,
    isValidatingFlow: isLoadingFlow,
    flowValidationStatus,
    flowExists,
    isFlowActive,
  } = useFlowValidation(initialFlowId || kycFlowId || null);

  const addressType: AddressType = flowDetails?.addressType || "evm";

  const flowError =
    flowValidationStatus === "invalid"
      ? "Flow not found or has been deleted"
      : flowValidationStatus === "inactive"
      ? "Flow is not currently active"
      : flowValidationStatus === "error"
      ? "Error validating flow"
      : null;

  useEffect(() => {
    if (flowValidationStatus === "valid" && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [flowValidationStatus, currentStep]);

  const handleFetchFlowDetails = async () => {
    if (!kycFlowId?.trim()) {
      setError("Please enter a KYC Flow ID");
      return;
    }
  };

  const validBlockchainAddress = useMemo(() => {
    if (!blockchainAddress) return false;
    switch (addressType) {
      case "evm":
        return isValidEVMAddress(blockchainAddress);
      case "iron":
        return isValidIronAddress(blockchainAddress);
      default:
        return false;
    }
  }, [blockchainAddress, addressType]);

  useEffect(() => {
    if (!blockchainAddress) {
      setError(null);
    } else if (!validBlockchainAddress) {
      setError("Invalid blockchain address");
    } else {
      setError(null);
    }
  }, [blockchainAddress, validBlockchainAddress]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const finalFlowId = kycFlowId || initialFlowId;
    if (!finalFlowId?.trim() || !blockchainAddress.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (flowValidationStatus !== "valid" || !flowDetails) {
      setError("Please verify the KYC Flow ID first and ensure it's active");
      return;
    }

    if (!accountId) {
      setError("Please sign in to continue");
      return;
    }

    if (!blockchainAddress || !validBlockchainAddress) {
      setError("Please enter a valid blockchain address");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const qrcodeData = mapKycFlowToSelfAppParams(flowDetails, accountId);

      if (typeof window !== "undefined") {
        const { SelfAppBuilder } = await import("@selfxyz/qrcode");
        const app = new SelfAppBuilder({
          ...qrcodeData,
        } as Partial<SelfApp>).build();
        setSelfApp(app);
      }

      const response = await fetchWithToken("/api/kyc/add-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kycFlowId: finalFlowId,
          blockchainAddress,
          qrcodeData: JSON.stringify(qrcodeData),
        }),
      });

      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.message || "Failed to submit verification");
      }

      setFormSubmitted(true);
      setCurrentStep(3);
    } catch (err) {
      console.error("Error submitting verification:", err);
      setError(
        err instanceof Error ? err.message : "Failed to submit verification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (formSubmitted) {
    return (
      <div className="animate-fadeIn">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 flex items-center">
          <CheckCircle2 className="w-6 h-6 text-green-500 mr-3" />
          <h2 className="text-2xl font-semibold text-green-800">Success!</h2>
        </div>
        <div className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            KYC Verification Created Successfully
          </h3>
          <p className="text-gray-600 mb-10 max-w-md mx-auto text-base">
            You should scan this QR code to verify your KYC information with
            selfAPP on mobile. You can check its status in your dashboard.
          </p>
          {selfApp && (
            <div className="flex justify-center mt-8">
              <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={() => {
                  router.push("/user/dashboard");
                }}
                darkMode={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <h2 className="text-2xl font-semibold text-indigo-800">
          Verify KYC Information
        </h2>
        <p className="text-base text-indigo-600 mt-2">
          Complete the verification process to participate in blockchain
          projects
        </p>
      </div>

      <div className="p-8">
        <div className="mb-10">
          <div className="flex items-center justify-between px-6">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 font-medium">Enter Flow ID</span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 ${
                currentStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 font-medium">Verify Details</span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 ${
                currentStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
              }`}
            ></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs mt-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-lg mb-8 flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm">
            {initialFlowId
              ? "Your blockchain address is required to complete the verification process. All information is securely protected."
              : "Enter the KYC Flow ID provided by the project and your blockchain address to complete the verification process. All information is securely protected and only disclosed according to project requirements."}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Enter Flow ID - only show if no initial flowId */}
          {!initialFlowId && currentStep === 1 && (
            <div className="animate-fadeIn">
              <div>
                <label
                  htmlFor="kycFlowId"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <Search className="h-4 w-4 mr-1 text-indigo-500" />
                  KYC Flow ID <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-grow">
                    <input
                      id="kycFlowId"
                      type="text"
                      value={kycFlowId}
                      onChange={(e) => setKycFlowId(e.target.value)}
                      className={`w-full pl-3 pr-10 py-2.5 border ${
                        flowError ? "border-red-300" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                      placeholder="Enter the KYC Flow ID provided by the project"
                      required
                    />
                    {flowValidationStatus === "valid" && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleFetchFlowDetails}
                    disabled={isLoadingFlow || !kycFlowId.trim()}
                    className="whitespace-nowrap"
                  >
                    {isLoadingFlow ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 mr-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Verifying...
                      </span>
                    ) : (
                      "Verify ID"
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Enter the KYC Flow ID provided by the project you want to
                  verify for
                </p>
                {flowError && (
                  <div className="mt-1 flex items-start text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                    <span>{flowError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Enter Blockchain Address and Flow Details */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-fadeIn">
              {flowValidationStatus === "valid" && flowDetails && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        KYC Flow Verified & Active
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-700">
                            Project:
                          </span>
                          <span className="ml-2 text-green-600">
                            {flowDetails.projectName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">
                            Address Type:
                          </span>
                          <span className="ml-2 text-green-600">
                            {addressType === "evm" ? "EVM" : "Iron"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">
                            Start Date:
                          </span>
                          <span className="ml-2 text-green-600">
                            {new Date(
                              flowDetails.startDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {flowDetails.endDate && (
                          <div>
                            <span className="font-medium text-green-700">
                              End Date:
                            </span>
                            <span className="ml-2 text-green-600">
                              {new Date(
                                flowDetails.endDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {flowValidationStatus === "inactive" && flowDetails && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        KYC Flow Not Currently Active
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-yellow-700">
                            Project:
                          </span>
                          <span className="ml-2 text-yellow-600">
                            {flowDetails.projectName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-yellow-700">
                            Active Period:
                          </span>
                          <span className="ml-2 text-yellow-600">
                            {new Date(
                              flowDetails.startDate
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {flowDetails.endDate
                              ? new Date(
                                  flowDetails.endDate
                                ).toLocaleDateString()
                              : "No end date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="blockchainAddress"
                  className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                >
                  <User className="h-4 w-4 mr-1 text-indigo-500" />
                  Blockchain Address{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="blockchainAddress"
                  type="text"
                  value={blockchainAddress}
                  onChange={(e) => setBlockchainAddress(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                    transition-all duration-200 font-mono text-sm"
                  placeholder="0x... or wallet address"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the blockchain address you want to verify for this
                  project
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between">
            {currentStep === 2 && !initialFlowId && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !blockchainAddress.trim() ||
                    flowValidationStatus !== "valid"
                  }
                  className="flex items-center"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    "Submit Verification"
                  )}
                </Button>
              </>
            )}

            {currentStep === 2 && initialFlowId && (
              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !blockchainAddress.trim() ||
                    flowValidationStatus !== "valid"
                  }
                  className="flex items-center"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    "Submit Verification"
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Privacy Protected
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  Your KYC verification information is securely processed and
                  only disclosed according to the project requirements. Your
                  data privacy is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function mapKycFlowToSelfAppParams(
  flow: KycObject,
  userId: string
): Partial<SelfApp> {
  return {
    appName: "ezkyc",
    scope: "ezkyc",
    endpoint: getVerifierUrl(),
    endpointType: "https",
    logoBase64: "https://i.imgur.com/Rz8B3s7.png",
    userId,
    userIdType: userId.startsWith("0x") ? "hex" : "uuid",
    disclosures: flow.options,
    devMode: false,
  };
}
