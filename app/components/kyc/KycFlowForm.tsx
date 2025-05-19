"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/datePicker";
import { Button } from "@/components/ui/button";
import { countries as QR_COUNTRIES } from "@selfxyz/qrcode";
import { CreateKycFlowRequest, KycFlow, KycObject, KycFlowInDB } from "@/types";
import {
  AlertCircle,
  CalendarClock,
  Flag,
  Info,
  Plus,
  Save,
  X,
  CheckCircle2,
  Shield,
  FileText,
  User,
  Globe,
  Clock,
  Settings,
} from "lucide-react";

interface KycFlowFormProps {
  userId: string;
  onSuccess?: (flow: KycFlow) => void;
}

export function KycFlowForm({ userId, onSuccess }: KycFlowFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1, 2, 3 for multi-step form

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ageRequirement, setAgeRequirement] = useState(18);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([
    QR_COUNTRIES.IRAN,
    QR_COUNTRIES.IRAQ,
    QR_COUNTRIES.NORTH_KOREA,
    QR_COUNTRIES.RUSSIA,
    QR_COUNTRIES.SYRIAN_ARAB_REPUBLIC,
    QR_COUNTRIES.VENEZUELA,
  ]);
  const [enableOfacSanctionsCheck, setEnableOfacSanctionsCheck] =
    useState(false);

  const [verificationOptions, setVerificationOptions] = useState({
    discloseIssuingState: false,
    discloseName: false,
    discloseNationality: false,
    discloseDateOfBirth: false,
    disclosePassportNumber: false,
    discloseGender: false,
    discloseExpiryDate: false,
  });

  const [countrySearch, setCountrySearch] = useState("");

  const [localExcludedCountries, setLocalExcludedCountries] = useState<
    string[]
  >([]);

  const handleVerificationOptionChange = (
    option: keyof typeof verificationOptions
  ) => {
    setVerificationOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleExcludedCountriesChange = (countries: string[]) => {
    setExcludedCountries(countries);
  };

  const validateForm = (): boolean => {
    if (!projectName.trim()) {
      setError("Project name is required");
      return false;
    }

    if (!startDate) {
      setError("Start date is required");
      return false;
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const options = {
        issuing_state: verificationOptions.discloseIssuingState,
        name: verificationOptions.discloseName,
        nationality: verificationOptions.discloseNationality,
        date_of_birth: verificationOptions.discloseDateOfBirth,
        passport_number: verificationOptions.disclosePassportNumber,
        gender: verificationOptions.discloseGender,
        expiry_date: verificationOptions.discloseExpiryDate,
        minimumAge: ageRequirement > 0 ? ageRequirement : undefined,
        excludedCountries,
        ofac: enableOfacSanctionsCheck,
      };
      const flow: CreateKycFlowRequest = {
        userId,
        projectName,
        startDate: new Date(startDate).getTime(),
        endDate: endDate ? new Date(endDate).getTime() : null,
        options,
      };

      const response = await fetch("/api/kyc/add-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flow),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create KYC flow");
      }

      setFormSubmitted(true);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data.flow);
        } else {
          router.push("/company/dashboard");
        }
      }, 1500);
    } catch (err) {
      console.error("Error creating KYC flow:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 3) {
      handleFinalSubmit();
    }
  };

  const handleNextStep = () => {
    if (activeStep === 1 && !projectName.trim()) {
      setError("Project name is required");
      return;
    }

    if (activeStep === 1 && !startDate) {
      setError("Start date is required");
      return;
    }

    setError("");
    setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
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
            KYC Flow Created Successfully
          </h3>
          <p className="text-gray-600 mb-10 max-w-md mx-auto text-base">
            Your KYC flow has been created and is now ready to use. You can
            manage it from your dashboard.
          </p>
          <div className="animate-pulse mb-6">
            <div className="h-1 w-32 bg-indigo-200 rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderProgressSteps = () => {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between px-6">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeStep >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Basic Info</span>
          </div>

          <div
            className={`flex-1 h-1 mx-4 ${
              activeStep >= 2 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeStep >= 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Verification</span>
          </div>

          <div
            className={`flex-1 h-1 mx-4 ${
              activeStep >= 3 ? "bg-indigo-600" : "bg-gray-200"
            }`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeStep >= 3
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-xs mt-2 font-medium">Requirements</span>
          </div>
        </div>
      </div>
    );
  };

  const handleOpenCountrySelector = () => {
    setLocalExcludedCountries(excludedCountries);
    setShowCountrySelector(true);
  };

  const handleSaveCountrySelector = () => {
    setExcludedCountries(localExcludedCountries);
    setShowCountrySelector(false);
  };

  const handleCancelCountrySelector = () => {
    setShowCountrySelector(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100">
        <h2 className="text-2xl font-semibold text-indigo-800">
          Create New KYC Flow
        </h2>
        <p className="text-base text-indigo-600 mt-2">
          Configure how you want your users to verify their identity.
        </p>
      </div>

      {error && (
        <div className="mx-8 mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-base">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8">
        {renderProgressSteps()}

        {/* Step 1: Basic Information */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-blue-50 p-5 rounded-lg mb-8 flex items-start">
              <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-blue-700 text-base">
                Start by naming your KYC flow and setting its active period.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-6">
                  <FileText className="text-indigo-500 w-6 h-6 mr-2" />
                  <h3 className="text-xl font-medium text-gray-900">
                    Basic Information
                  </h3>
                </div>

                <div className="mb-8">
                  <Input
                    id="projectName"
                    label="Project Name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name (e.g. User Onboarding)"
                    required
                    hint="The name of the project that will use this KYC flow"
                    className="transition-all focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker
                    id="startDate"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    hint="When this KYC flow becomes active"
                  />
                  <DatePicker
                    id="endDate"
                    label="End Date (Optional)"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    hint="Leave blank for no end date"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Verification Options */}
        {activeStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-indigo-50 p-5 rounded-lg mb-8 flex items-start">
              <Info className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-indigo-700 text-base">
                Select what personal information you need to collect during
                verification.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center mb-8">
                <User className="text-indigo-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-medium text-gray-900">
                  Verification Options
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseName"
                    label="Disclose Name"
                    description="Collect the user's full name from their ID"
                    checked={verificationOptions.discloseName}
                    onChange={() =>
                      handleVerificationOptionChange("discloseName")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseNationality"
                    label="Disclose Nationality"
                    description="Collect the user's nationality from their ID"
                    checked={verificationOptions.discloseNationality}
                    onChange={() =>
                      handleVerificationOptionChange("discloseNationality")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseDateOfBirth"
                    label="Disclose Date of Birth"
                    description="Collect the user's date of birth from their ID"
                    checked={verificationOptions.discloseDateOfBirth}
                    onChange={() =>
                      handleVerificationOptionChange("discloseDateOfBirth")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="disclosePassportNumber"
                    label="Disclose ID/Passport Number"
                    description="Collect the user's ID or passport number"
                    checked={verificationOptions.disclosePassportNumber}
                    onChange={() =>
                      handleVerificationOptionChange("disclosePassportNumber")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseGender"
                    label="Disclose Gender"
                    description="Collect the user's gender from their ID"
                    checked={verificationOptions.discloseGender}
                    onChange={() =>
                      handleVerificationOptionChange("discloseGender")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseExpiryDate"
                    label="Disclose Expiry Date"
                    description="Collect the expiry date of the user's ID"
                    checked={verificationOptions.discloseExpiryDate}
                    onChange={() =>
                      handleVerificationOptionChange("discloseExpiryDate")
                    }
                  />
                </div>

                <div className="p-5 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors">
                  <Checkbox
                    id="discloseIssuingState"
                    label="Disclose Issuing State"
                    description="Collect the state that issued the user's ID"
                    checked={verificationOptions.discloseIssuingState}
                    onChange={() =>
                      handleVerificationOptionChange("discloseIssuingState")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Requirements */}
        {activeStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-violet-50 p-5 rounded-lg mb-8 flex items-start">
              <Info className="w-5 h-5 text-violet-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-violet-700 text-base">
                Set additional requirements and restrictions for the
                verification process.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center mb-8">
                <Settings className="text-indigo-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-medium text-gray-900">
                  Additional Requirements
                </h3>
              </div>

              <div className="space-y-8">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <label
                    htmlFor="ageRequirement"
                    className="block text-base font-medium text-gray-700 mb-2"
                  >
                    Age Requirement
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      id="ageRequirement"
                      value={ageRequirement}
                      onChange={(e) =>
                        setAgeRequirement(parseInt(e.target.value, 10) || 18)
                      }
                      min="0"
                      className="w-24 py-3 px-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base"
                    />
                    <span className="ml-2 text-gray-500 text-base">
                      years old
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Minimum age required for verification
                  </p>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-base font-medium text-gray-700 flex items-center">
                      <Globe className="w-5 h-5 text-indigo-500 mr-1" />
                      Country Restrictions
                    </label>
                    <button
                      type="button"
                      onClick={handleOpenCountrySelector}
                      className="text-base text-indigo-600 hover:text-indigo-500 flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </button>
                  </div>

                  <div className="mt-3 border border-gray-200 rounded-md bg-gray-50 p-4">
                    {excludedCountries.length === 0 ? (
                      <p className="text-gray-500 text-sm">
                        No restricted countries selected
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {excludedCountries.map((code) => {
                          const name =
                            Object.entries(QR_COUNTRIES).find(
                              ([_name, _code]) => _code === code
                            )?.[0] || code;
                          return (
                            <div
                              key={code}
                              className="inline-flex items-center bg-white px-3 py-1.5 rounded-md border border-gray-200 text-xs"
                            >
                              <span>{name}</span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({code})
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setExcludedCountries((prev) =>
                                    prev.filter((c) => c !== code)
                                  )
                                }
                                className="ml-2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Users from these countries will be restricted from
                    verification
                  </p>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="enableOfacSanctionsCheck"
                    label="Enable OFAC Sanctions Check"
                    description="Check against the U.S. Office of Foreign Assets Control sanctions list"
                    checked={enableOfacSanctionsCheck}
                    onChange={() =>
                      setEnableOfacSanctionsCheck(!enableOfacSanctionsCheck)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 mt-10 border-t border-gray-200 flex justify-between">
          {activeStep > 1 ? (
            <Button type="button" variant="secondary" onClick={handlePrevStep}>
              Previous
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/company/dashboard")}
            >
              Cancel
            </Button>
          )}

          {activeStep < 3 ? (
            <Button type="button" onClick={handleNextStep}>
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => handleFinalSubmit()}
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Create KYC Flow
            </Button>
          )}
        </div>
      </form>

      {showCountrySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Select Restricted Countries
              </h2>
              <button
                onClick={handleCancelCountrySelector}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search countries..."
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => setCountrySearch(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
                {(Object.entries(QR_COUNTRIES) as [string, string][])
                  .filter(([name, code]) =>
                    name
                      .toLowerCase()
                      .includes(countrySearch?.toLowerCase() || "")
                  )
                  .map(([name, code]) => (
                    <div
                      key={code}
                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                        localExcludedCountries.includes(code)
                          ? "bg-indigo-100 hover:bg-indigo-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setLocalExcludedCountries((prev) =>
                          prev.includes(code)
                            ? prev.filter((c) => c !== code)
                            : [...prev, code]
                        );
                      }}
                    >
                      <div className="flex items-center flex-grow">
                        <div className="w-6 h-6 flex items-center justify-center mr-3">
                          {localExcludedCountries.includes(code) && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{name}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({code})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={handleCancelCountrySelector}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCountrySelector}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
