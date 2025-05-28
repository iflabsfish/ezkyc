"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header, Footer, BackButton, Toast, useToast } from "@/components";
import { Loading } from "@/components/ui/Loading";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Search,
  Filter,
  Calendar,
  Hash,
  TrendingUp,
  ChevronDown,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { useAuthUserContext } from "@/app/context/AuthUserContext";

interface AddressInfo {
  blockchainAddress: string;
  createdAt: number;
  updatedAt: number;
  verificationId: string;
}

interface FlowAddressesData {
  flow: {
    id: string;
    projectName: string;
    startDate: number;
    endDate: number | null;
  };
  addresses: {
    pending: AddressInfo[];
    approved: AddressInfo[];
    rejected: AddressInfo[];
  };
  totalCount: number;
}

export default function FlowAddressesPage() {
  const params = useParams();
  const router = useRouter();
  const { accountId } = useAuth();
  const { token } = useAuthUserContext();
  const { showToast, toastProps } = useToast();
  const [data, setData] = useState<FlowAddressesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const kycFlowId = params?.kycFlowId as string;

  useEffect(() => {
    if (!accountId) {
      router.push("/");
      return;
    }
  }, [accountId, router]);

  useEffect(() => {
    const fetchFlowAddresses = async () => {
      if (!token || !kycFlowId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/kyc/${kycFlowId}/addresses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const errorResult = await response.json();
          setError(errorResult.message || "Failed to fetch flow addresses");
        }
      } catch (err) {
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowAddresses();
  }, [token, kycFlowId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown")) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen && typeof document !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isFilterOpen]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDateShort = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const getStatusIcon = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-800 hover:from-green-100 hover:to-emerald-100";
      case "rejected":
        return "bg-gradient-to-br from-red-50 to-pink-50 border-red-200 text-red-800 hover:from-red-100 hover:to-pink-100";
      case "pending":
        return "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 text-yellow-800 hover:from-yellow-100 hover:to-orange-100";
    }
  };

  const getStatusBadgeColor = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 8
    )}`;
  };

  const truncateFlowId = (id: string) => {
    if (id.length <= 16) return id;
    return `${id.substring(0, 8)}...${id.substring(id.length - 8)}`;
  };

  const filterAddresses = (addresses: AddressInfo[], status: string) => {
    return addresses.filter((address) =>
      address.blockchainAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAllAddresses = () => {
    if (!data) return [];

    const allAddresses = [
      ...data.addresses.pending.map((addr) => ({
        ...addr,
        status: "pending" as const,
      })),
      ...data.addresses.approved.map((addr) => ({
        ...addr,
        status: "approved" as const,
      })),
      ...data.addresses.rejected.map((addr) => ({
        ...addr,
        status: "rejected" as const,
      })),
    ];

    let filtered = allAddresses;

    if (selectedStatus !== "all") {
      filtered = filtered.filter((addr) => addr.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((addr) =>
        addr.blockchainAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  };

  const exportToCSV = () => {
    const filteredAddresses = getAllAddresses();

    if (filteredAddresses.length === 0) {
      showToast("No data to export");
      return;
    }

    const headers = [
      "Blockchain Address",
      "Status",
      "Created At",
      "Updated At",
      "Verification ID",
    ];

    const csvData = filteredAddresses.map((address) => [
      address.blockchainAddress,
      address.status === "pending"
        ? "Pending"
        : address.status === "approved"
        ? "Approved"
        : "Rejected",
      formatDate(address.createdAt),
      formatDate(address.updatedAt),
      address.verificationId,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const projectName = data?.flow.projectName || "KYC Project";
    const statusText =
      selectedStatus === "all"
        ? "All Status"
        : selectedStatus === "pending"
        ? "Pending"
        : selectedStatus === "approved"
        ? "Approved"
        : "Rejected";
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const filename = `${projectName}_${statusText}_Addresses_${timestamp}.csv`;

    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      `Successfully exported ${filteredAddresses.length} addresses`,
      "success"
    );
  };

  const getStatusDisplayText = (
    status: "all" | "pending" | "approved" | "rejected"
  ) => {
    switch (status) {
      case "all":
        return "All Status";
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
    }
  };

  const getStatusDisplayIcon = (
    status: "all" | "pending" | "approved" | "rejected"
  ) => {
    switch (status) {
      case "all":
        return <Filter className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const AddressCard = ({
    address,
    status,
  }: {
    address: AddressInfo;
    status: "pending" | "approved" | "rejected";
  }) => (
    <div
      className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${getStatusColor(
        status
      )}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/70 rounded-full shadow-sm">
            {getStatusIcon(status)}
          </div>
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(address.blockchainAddress)}
            className="p-2 bg-white/70 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            title="Copy address"
          >
            <Copy className="w-4 h-4" />
          </button>
          <Link
            href={`/kyc/${kycFlowId}/${address.blockchainAddress}`}
            target="_blank"
            className="p-2 bg-white/70 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            title="View details"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/50 rounded-lg p-3 border border-white/60">
          <div className="flex items-center mb-2">
            <Hash className="w-4 h-4 mr-2 opacity-60" />
            <span className="text-xs font-medium opacity-75">
              Blockchain Address
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm font-medium break-all">
              {truncateAddress(address.blockchainAddress)}
            </p>
            {copiedAddress === address.blockchainAddress && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full animate-pulse">
                Copied!
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/50 rounded-lg p-3 border border-white/60">
            <div className="flex items-center mb-1">
              <Calendar className="w-3 h-3 mr-1 opacity-60" />
              <span className="text-xs font-medium opacity-75">Submitted</span>
            </div>
            <p className="text-xs font-medium">
              {formatDateShort(address.createdAt)}
            </p>
          </div>
          <div className="bg-white/50 rounded-lg p-3 border border-white/60">
            <div className="flex items-center mb-1">
              <TrendingUp className="w-3 h-3 mr-1 opacity-60" />
              <span className="text-xs font-medium opacity-75">Updated</span>
            </div>
            <p className="text-xs font-medium">
              {formatDateShort(address.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!accountId || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loading text="Loading flow addresses..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
              <p className="text-gray-600 mb-8">{error}</p>
              <BackButton href="/company/dashboard">
                Back to Dashboard
              </BackButton>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredAddresses = getAllAddresses();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <BackButton href="/company/dashboard" className="mb-6">
              Back to Dashboard
            </BackButton>

            {data && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                      {data.flow.projectName}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {data.totalCount}
                    </div>
                    <div className="text-sm text-gray-500">Total Addresses</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <span className="text-2xl font-bold text-yellow-900">
                        {data.addresses.pending.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-800">
                      Pending
                    </h3>
                    <p className="text-sm text-yellow-600">
                      Awaiting verification
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-green-900">
                        {data.addresses.approved.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Approved
                    </h3>
                    <p className="text-sm text-green-600">
                      Successfully verified
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-2xl font-bold text-red-900">
                        {data.addresses.rejected.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Rejected
                    </h3>
                    <p className="text-sm text-red-600">Verification failed</p>
                  </div>
                </div>
              </div>
            )}

            {data && data.totalCount > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search addresses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={exportToCSV}
                      className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 font-medium text-gray-700"
                      title="Export current list as CSV file"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <div className="relative filter-dropdown">
                      <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 min-w-[140px]"
                      >
                        {getStatusDisplayIcon(selectedStatus)}
                        <span className="font-medium text-gray-700">
                          {getStatusDisplayText(selectedStatus)}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isFilterOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                          {(
                            ["all", "pending", "approved", "rejected"] as const
                          ).map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                setSelectedStatus(status);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                selectedStatus === status
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {getStatusDisplayIcon(status)}
                              <span className="font-medium">
                                {getStatusDisplayText(status)}
                              </span>
                              {selectedStatus === status && (
                                <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {data && filteredAddresses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAddresses.map((address) => (
                <AddressCard
                  key={address.verificationId}
                  address={address}
                  status={address.status}
                />
              ))}
            </div>
          )}

          {data && data.totalCount > 0 && filteredAddresses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                No addresses match your current search and filter criteria.
              </p>
            </div>
          )}

          {data && data.totalCount === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Verifications Yet
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                No blockchain addresses have been submitted for verification in
                this flow yet. Share your flow ID to start receiving
                verifications.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <Toast {...toastProps} />
    </div>
  );
}
