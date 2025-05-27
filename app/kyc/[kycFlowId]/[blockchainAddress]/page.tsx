"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components";
import { Loading } from "@/components/ui/Loading";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface VerificationData {
  verification: {
    id: string;
    kycFlowId: string;
    blockchainAddress: string;
    status: "pending" | "approved" | "rejected";
    createdAt: number;
    updatedAt: number;
  };
  flow: {
    id: string;
    projectName: string;
    startDate: number;
    endDate: number | null;
  };
}

export default function VerificationStatusPage() {
  const params = useParams();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kycFlowId = params?.kycFlowId as string;
  const blockchainAddress = params?.blockchainAddress as string;

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/kyc/${kycFlowId}/${blockchainAddress}`
        );

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const errorResult = await response.json();
          setError(
            errorResult.message || "Failed to fetch verification status"
          );
        }
      } catch (err) {
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (kycFlowId && blockchainAddress) {
      fetchVerificationStatus();
    }
  }, [kycFlowId, blockchainAddress]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "rejected":
        return <XCircle className="w-8 h-8 text-red-500" />;
      case "pending":
        return <Clock className="w-8 h-8 text-yellow-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Loading verification status..." />
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
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-8 py-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  KYC Verification Status
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Check the verification status for your blockchain address
                </p>
              </div>

              {error ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Verification Not Found
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">{error}</p>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 max-w-md mx-auto border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Flow ID:
                        </span>
                        <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                          {kycFlowId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                          Address:
                        </span>
                        <span className="text-sm font-mono text-gray-900 bg-white px-2 py-1 rounded border truncate max-w-32">
                          {blockchainAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : data ? (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="relative">
                        <div
                          className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            data.verification.status === "approved"
                              ? "bg-green-100"
                              : data.verification.status === "rejected"
                              ? "bg-red-100"
                              : data.verification.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {data.verification.status === "approved" && (
                            <CheckCircle className="w-12 h-12 text-green-600" />
                          )}
                          {data.verification.status === "rejected" && (
                            <XCircle className="w-12 h-12 text-red-600" />
                          )}
                          {data.verification.status === "pending" && (
                            <Clock className="w-12 h-12 text-yellow-600" />
                          )}
                        </div>
                        {data.verification.status === "pending" && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <div
                          className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold border-2 ${getStatusColor(
                            data.verification.status
                          )}`}
                        >
                          {getStatusText(data.verification.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Project Information
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Project Name
                          </span>
                          <span className="text-sm font-semibold text-gray-900 text-right max-w-48 break-words">
                            {data.flow.projectName}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Flow ID
                          </span>
                          <span className="text-xs font-mono text-gray-900 bg-white px-2 py-1 rounded border max-w-32 truncate">
                            {data.flow.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Start Date
                          </span>
                          <span className="text-sm text-gray-900 text-right">
                            {formatDate(data.flow.startDate)}
                          </span>
                        </div>
                        {data.flow.endDate && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-600">
                              End Date
                            </span>
                            <span className="text-sm text-gray-900 text-right">
                              {formatDate(data.flow.endDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Verification Details
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Blockchain Address
                          </span>
                          <span className="text-xs font-mono text-gray-900 bg-white px-2 py-1 rounded border max-w-32 truncate">
                            {data.verification.blockchainAddress}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Verification ID
                          </span>
                          <span className="text-xs font-mono text-gray-900 bg-white px-2 py-1 rounded border max-w-32 truncate">
                            {data.verification.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Submitted
                          </span>
                          <span className="text-sm text-gray-900 text-right">
                            {formatDate(data.verification.createdAt)}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-600">
                            Last Updated
                          </span>
                          <span className="text-sm text-gray-900 text-right">
                            {formatDate(data.verification.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {data.verification.status === "pending" && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-yellow-800 mb-2">
                            Verification in Progress
                          </h4>
                          <p className="text-yellow-700 leading-relaxed">
                            Your verification is currently being processed.
                            Please check back later for updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.verification.status === "approved" && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-green-800 mb-2">
                            Verification Approved
                          </h4>
                          <p className="text-green-700 leading-relaxed">
                            Your KYC verification has been successfully
                            approved. You can now proceed with confidence.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.verification.status === "rejected" && (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-red-800 mb-2">
                            Verification Rejected
                          </h4>
                          <p className="text-red-700 leading-relaxed">
                            Your KYC verification was not approved. Please
                            contact support for more information and assistance.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
