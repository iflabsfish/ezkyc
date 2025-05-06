"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import SelfQRcodeWrapper, { SelfApp, SelfAppBuilder } from '@selfxyz/qrcode';
import { getVerifierUrl } from "@/lib/utils"
import { v4 as uuidv4 } from 'uuid';

export default function UserPage() {
  const [companyId, setCompanyId] = useState("")
  const [userId, setUserId] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [verificationStatus, setVerificationStatus] = useState("pending") // pending, loading, verifying, complete, error
  const [companyOptions, setCompanyOptions] = useState<any>(null)
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (companyOptions) {
      if (verificationStatus === "verifying") {
        const app = new SelfAppBuilder({
          appName: "Self Playground",
          scope: "self-playground",
          endpoint: getVerifierUrl(),
          endpointType: "https",
          logoBase64: "https://i.imgur.com/Rz8B3s7.png",
          userId: userId,
          disclosures: {
            ...companyOptions,
            minimumAge: companyOptions.minimumAge > 0 ? companyOptions.minimumAge : undefined,
          },
          devMode: false,
        } as Partial<SelfApp>).build();
        setSelfApp(app);
      }
    }
  }, [companyOptions, companyId, verificationStatus]);

  // Verify company KYC process is active
  const handleCompanyOptions = async () => {
    if (!companyId.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter the company ID.",
        variant: "destructive",
      })
      return null;
    }

    setError(null);

    try {
      const response = await fetch(`/api/company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyId,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Expected JSON response but received ${contentType || 'unknown content type'}`);
        throw new Error("Server returned an invalid response");
      }

      const data = await response.json();
      console.log("Company KYC information:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Company KYC program not found');
      }

      if (!data.options) {
        console.warn("No options found in response:", data);
        throw new Error('No verification options found for this company');
      }

      if (!data.companyName) {
        console.warn("No company name found in response:", data);
        throw new Error('No company name found for this company');
      }

      return data;
    } catch (error) {
      console.error('Error fetching company options:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch company information');
      return null;
    }
  };

  const handleStartVerification = async () => {
    if (!companyId || !address) {
      toast({
        title: "Missing information",
        description: "Please fill in both company ID and address.",
        variant: "destructive",
      })
      return;
    }

    setVerificationStatus("loading");

    const data = await handleCompanyOptions();
    const uid = uuidv4();
    setUserId(uid);
    setCompanyName(data.companyName);
    setCompanyOptions(data.options);

    await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId,
        address,
        userId: uid,
      }),
    });

    setVerificationStatus("verifying");

    toast({
      title: "Verification Started",
      description: "Please scan the QR code with selfApp on your mobile device.",
    });
  };

  const handleSuccess = () => {
    setVerificationStatus("complete");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 -ml-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">User Verification</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Complete your verification process securely and privately
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {verificationStatus === "complete" && companyName ? (
              <VerificationComplete companyName={companyName} />
            ) : (
              <Card className="p-6 mb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="company-id" className="block mb-2 text-sm font-medium text-gray-700">
                        Company ID
                      </label>
                      <Input
                        id="company-id"
                        placeholder="Enter company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        disabled={verificationStatus === "verifying" || verificationStatus === "loading"}
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Input
                        id="address"
                        placeholder="Enter your address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={verificationStatus === "verifying" || verificationStatus === "loading"}
                      />
                    </div>

                    {verificationStatus === "pending" && (
                      <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleStartVerification}
                      >
                        Start Verification
                      </Button>
                    )}

                    {verificationStatus === "loading" && (
                      <Button className="w-full bg-indigo-600" disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </Button>
                    )}

                    {verificationStatus === "verifying" && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Verification in progress...</span>
                        </div>
                      </div>
                    )}

                    {verificationStatus === "error" && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Verification Error</p>
                          <p className="text-sm">{error || "An error occurred during verification."}</p>
                          <Button
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => setVerificationStatus("pending")}
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    {selfApp !== null && (<SelfQRcodeWrapper
                      selfApp={selfApp}
                      onSuccess={handleSuccess}
                      darkMode={false}
                    />)}
                    <p className="text-sm text-gray-600 text-center">
                      {verificationStatus === "verifying"
                        ? "Scan this QR code with selfApp on your mobile device to complete verification"
                        : verificationStatus === "loading"
                          ? "Loading verification requirements..."
                          : "QR code will appear here when verification starts"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function VerificationComplete({ companyName }: { companyName: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Verification Complete!</h2>

        <p className="text-gray-600 max-w-md mx-auto">
          Congratulations! Your identity has been successfully verified with {companyName}. You can now access their
          services to check your eligibility.
        </p>

        <Link href="/">
          <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">Return to Home</Button>
        </Link>
      </div>
    </Card>
  )
}

