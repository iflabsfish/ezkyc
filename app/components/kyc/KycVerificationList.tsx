"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { UserKycVerificationWithFlow } from "@/types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, X } from "lucide-react";
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import { useAuth } from "@/hooks/useAuth";

interface KycVerificationListProps {
  verifications?: UserKycVerificationWithFlow[];
  onDelete?: (id: string) => void;
}

export function KycVerificationList({
  verifications: externalVerifications,
  onDelete,
}: KycVerificationListProps) {
  const router = useRouter();
  const [verifications, setVerifications] = useState<
    UserKycVerificationWithFlow[]
  >(externalVerifications || []);
  const [isLoading, setIsLoading] = useState(!externalVerifications);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const selfApps = useMemo(() => {
    return verifications.map((item) => {
      return new SelfAppBuilder(JSON.parse(item.qrcodeData)).build();
    });
  }, [verifications]);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrIndex, setQrIndex] = useState<number | null>(null);
  const handleShowQr = (idx: number) => {
    setQrIndex(idx);
    setShowQrModal(true);
  };
  const handleCloseQr = () => {
    setShowQrModal(false);
    setQrIndex(null);
  };

  const { fetchWithToken } = useAuth();

  useEffect(() => {
    if (externalVerifications) {
      setVerifications(externalVerifications);
      return;
    }

    const fetchVerifications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchWithToken(
          "/api/kyc/get-user-verifications"
        );
        const data = await response?.json();

        if (!response?.ok) {
          throw new Error(data.message || "Failed to fetch KYC verifications");
        }

        setVerifications(data.verifications);
      } catch (err) {
        console.error("Error fetching KYC verifications:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load verifications"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifications();
  }, [externalVerifications, fetchWithToken]);

  const handleDelete = async (id: string) => {
    if (!confirmingId) {
      setConfirmingId(id);
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetchWithToken(
        `/api/kyc/delete-verification?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response?.json();

      if (!response?.ok) {
        throw new Error(data.message || "Failed to delete verification");
      }

      setVerifications(verifications.filter((v) => v.id !== id));

      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error("Error deleting verification:", err);
      alert("Failed to delete verification. Please try again later.");
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        <p className="ml-2 text-gray-600">Loading verifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Error: {error}</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={() => setError(null)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (verifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              You have not participated in any KYC verification processes yet.
            </p>
            <Button onClick={() => router.push("/kyc/verify")}>
              Start KYC Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      {verifications.map((verification, index) => (
        <div
          key={verification.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardHeader className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <CardTitle className="truncate">
                  {verification.flow.projectName}
                </CardTitle>
                <Badge variant={getBadgeVariant(verification.status)}>
                  {verification.status.charAt(0).toUpperCase() +
                    verification.status.slice(1)}
                </Badge>
              </div>
              <div>
                {confirmingId === verification.id ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setConfirmingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={deletingId === verification.id}
                      onClick={() => handleDelete(verification.id)}
                      className="flex items-center"
                    >
                      {deletingId === verification.id && (
                        <span className="h-4 w-4 mr-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      )}
                      Confirm
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(verification.id)}
                    className="text-gray-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">KYC Flow ID:</span>
                <span className="font-mono text-gray-700 text-xs bg-gray-100 py-1 px-2 rounded">
                  {verification.kycFlowId}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Blockchain Address:</span>
                <span className="font-mono text-gray-700 text-xs bg-gray-100 py-1 px-2 rounded truncate max-w-[240px]">
                  {verification.blockchainAddress.length > 24
                    ? verification.blockchainAddress.slice(0, 15) +
                      "..." +
                      verification.blockchainAddress.slice(-6)
                    : verification.blockchainAddress}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Submitted:</span>
                <span className="text-gray-700">
                  {new Date(verification.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShowQr(index)}
                className="rounded-full px-5 py-2 flex items-center gap-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
                Show QR Code
              </Button>
            </div>
          </CardContent>
        </div>
      ))}
      {showQrModal && qrIndex !== null && selfApps[qrIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 relative max-w-full w-[360px] flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={handleCloseQr}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              KYC QR Code
            </h3>
            <SelfQRcodeWrapper
              selfApp={selfApps[qrIndex]}
              onSuccess={() => {}}
              darkMode={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
