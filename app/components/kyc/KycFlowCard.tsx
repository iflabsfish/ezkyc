"use client";
import { useState } from "react";
import { KycFlowWithStats } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  CalendarClock,
  Users,
  Globe,
  AlertCircle,
  Trash2,
  Copy,
  Check,
  Fingerprint,
  UserCheck,
  UserPlus,
  Settings,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface KycFlowCardProps {
  flow: KycFlowWithStats;
  onDelete: (flowId: string) => void;
}

export function KycFlowCard({ flow, onDelete }: KycFlowCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { fetchWithToken } = useAuth();

  const handleDelete = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetchWithToken(
        `/api/kyc/delete-flow?id=${flow.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response || !response.ok) {
        throw new Error("Failed to delete KYC flow");
      }

      onDelete(flow.id);
    } catch (error) {
      console.error("Error deleting KYC flow:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "No end date";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getVerificationOptionsCount = () => {
    return Object.values(flow.verificationOptions).filter(Boolean).length;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(flow.id);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const formatId = (id: string) => {
    if (id.length <= 15) return id;
    return `${id.substring(0, 15)}...${id.substring(id.length - 6)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 truncate">
            {flow.projectName}
          </h3>
          <div>
            {showConfirmDelete ? (
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowConfirmDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="flex items-center"
                >
                  {isDeleting && (
                    <span className="h-4 w-4 mr-1 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  )}
                  Confirm
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 text-sm">
        <div className="space-y-3">
          <div className="flex items-center text-gray-500 group">
            <Fingerprint className="w-4 h-4 mr-2 text-indigo-500" />
            <div className="flex items-center flex-1 overflow-hidden">
              <span className="font-medium mr-1">ID:</span>
              <span
                className="text-xs bg-gray-100 py-1 px-2 rounded truncate"
                title={flow.id}
              >
                {formatId(flow.id)}
              </span>
              <button
                onClick={copyToClipboard}
                className="ml-2 p-1 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors"
                title="Copy ID to clipboard"
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center text-gray-500">
            <CalendarClock className="w-4 h-4 mr-2" />
            <div>
              <span className="font-medium">Active period:</span>{" "}
              {formatDate(flow.startDate)} - {formatDate(flow.endDate)}
            </div>
          </div>

          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-2" />
            <div>
              <span className="font-medium">Age requirement:</span>{" "}
              {flow.ageRequirement}+ years
            </div>
          </div>

          <div className="flex items-center text-gray-500">
            <Globe className="w-4 h-4 mr-2" />
            <div>
              <span className="font-medium">Restricted countries:</span>{" "}
              {(flow as any).options?.excludedCountries?.length ??
                flow.countryRestrictions?.length ??
                0}{" "}
              countries
            </div>
          </div>

          <div className="flex items-center text-gray-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            <div>
              <span className="font-medium">OFAC check:</span>{" "}
              {flow.enableOfacSanctionsCheck ? "Enabled" : "Disabled"}
            </div>
          </div>

          {/* Disclosure options moved here */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500">
              <Settings className="w-4 h-4 mr-2" />
              <div>
                <span className="font-medium">Disclosure options:</span>{" "}
                <span className="text-gray-900">
                  {getVerificationOptionsCount()}/7 selected
                </span>
              </div>
            </div>

            <div className="flex space-x-1">
              {Object.entries(flow.verificationOptions).map(([key, value]) => {
                const option = key.replace("disclose", "");
                return (
                  <span
                    key={key}
                    className={`w-2 h-2 rounded-full ${
                      value ? "bg-indigo-500" : "bg-gray-200"
                    }`}
                    title={option}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* User participation statistics moved to bottom with enhanced styling */}
        {(flow.participantCount !== undefined ||
          flow.completedCount !== undefined) && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="ml-2">
                      <div className="text-xs font-medium text-blue-700">
                        Participants
                      </div>
                      <div className="text-lg font-bold text-blue-900">
                        {flow.participantCount ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-1.5 bg-green-100 rounded-md">
                      <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div className="ml-2">
                      <div className="text-xs font-medium text-green-700">
                        Completed
                      </div>
                      <div className="text-lg font-bold text-green-900">
                        {flow.completedCount ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/kyc/flow/${flow.id}/addresses`}
              className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Address Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
