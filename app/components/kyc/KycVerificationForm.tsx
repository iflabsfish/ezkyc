"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KycFlow, KycObject } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  LinkIcon,
  Calendar,
  FileText,
  User,
  Settings,
  ShieldCheck,
  Info,
} from "lucide-react";
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import { getVerifierUrl } from "@/lib/api/env";
import { useAuth } from "@/hooks/useAuth";

interface KycVerificationFormProps {}

export function KycVerificationForm() {
  const [kycFlowId, setKycFlowId] = useState("");
  const [blockchainAddress, setBlockchainAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flowDetails, setFlowDetails] = useState<KycObject | null>(null);
  const [isLoadingFlow, setIsLoadingFlow] = useState(false);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const { fetchWithToken } = useAuth();
  const { accountId } = useAuth();

  const handleFetchFlowDetails = async () => {
    if (!kycFlowId.trim()) {
      setFlowError("Please enter a KYC Flow ID");
      setFlowDetails(null);
      return;
    }

    try {
      setIsLoadingFlow(true);
      setFlowError(null);

      const response = await fetchWithToken(
        `/api/kyc/get-flow?id=${encodeURIComponent(kycFlowId)}`
      );
      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.message || "Failed to fetch KYC flow details");
      }

      setFlowDetails(data.flow);
      setCurrentStep(2);
    } catch (err) {
      console.error("Error fetching KYC flow details:", err);
      setFlowError(
        err instanceof Error ? err.message : "Failed to load flow details"
      );
      setFlowDetails(null);
    } finally {
      setIsLoadingFlow(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!kycFlowId.trim() || !blockchainAddress.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!flowDetails) {
      setError("Please verify the KYC Flow ID first");
      return;
    }

    if (!accountId) {
      setError("Please sign in to continue");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const qrcodeData = mapKycFlowToSelfAppParams(flowDetails, accountId);
      const app = new SelfAppBuilder({
        ...qrcodeData,
      } as Partial<SelfApp>).build();
      setSelfApp(app);

      const response = await fetchWithToken("/api/kyc/add-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kycFlowId,
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
                onSuccess={() => {}}
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
            Enter the KYC Flow ID provided by the project and your blockchain
            address to complete the verification process. All information is
            securely protected and only disclosed according to project
            requirements.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {currentStep === 1 && (
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
                    {flowDetails && (
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

          {currentStep === 2 && flowDetails && (
            <div className="animate-fadeIn">
              <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 mb-6">
                <h4 className="text-sm font-medium text-indigo-800 mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  KYC Flow Verified
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-indigo-700 w-24">
                      Project:
                    </span>
                    <span className="text-indigo-900">
                      {flowDetails.projectName}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-indigo-700 w-24">
                      Start Date:
                    </span>
                    <span className="text-indigo-900 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(flowDetails.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  {flowDetails.endDate && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-indigo-700 w-24">
                        End Date:
                      </span>
                      <span className="text-indigo-900 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(flowDetails.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="blockchainAddress"
                  className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1 text-indigo-500" />
                  Blockchain Address{" "}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="blockchainAddress"
                  type="text"
                  value={blockchainAddress}
                  onChange={(e) => setBlockchainAddress(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="Enter your blockchain address"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the blockchain address you want to associate with this
                  KYC verification
                </p>
              </div>
            </div>
          )}

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between">
            {currentStep === 2 && (
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
                  disabled={isLoading || !blockchainAddress.trim()}
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
