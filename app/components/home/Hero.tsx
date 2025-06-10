"use client";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Zap,
  Users,
  Globe,
  Sparkles,
  ArrowRight,
  Lock,
  Eye,
} from "lucide-react";
import { useAuthModal, useUser } from "@account-kit/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStateRef } from "@/hooks/useDataRef";
import { useAuthUserContext } from "@/app/context/AuthUserContext";
import { Loading } from "@/components/ui/Loading";
import { KycObject } from "@/types";

interface HeroProps {
  flowId: string | null;
  flowExists: boolean | null;
  isValidatingFlow: boolean;
  isFlowActive: boolean | null;
  flowValidationStatus:
    | "idle"
    | "loading"
    | "valid"
    | "invalid"
    | "inactive"
    | "error";
  flowData: KycObject | null;
}

interface ParticleStyle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export function Hero({
  flowId,
  flowExists,
  isValidatingFlow,
  isFlowActive,
  flowValidationStatus,
  flowData,
}: HeroProps) {
  const user = useUser();
  const { accountId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const hasAttemptedLoginRef = useRef(false);
  const { saveUser, isSavingUser } = useAuthUserContext();
  const isSavingUserRef = useStateRef(isSavingUser);
  const [isVisible, setIsVisible] = useState(false);
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([]);

  const isFlowValidForRedirection = flowExists && isFlowActive;

  useEffect(() => {
    setIsVisible(true);
    // Generate particle styles to avoid hydration mismatch
    const particles = Array.from({ length: 20 }, () => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${6 + Math.random() * 8}s`,
    }));
    setParticleStyles(particles);
  }, []);

  useEffect(() => {
    if (user && hasAttemptedLoginRef.current && !isSavingUserRef.current) {
      saveUser(user)
        .then(() => {
          const destinationUrl =
            flowId && isFlowValidForRedirection
              ? `/destinations?flowId=${encodeURIComponent(flowId)}`
              : "/destinations";
          router.push(destinationUrl);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [
    user,
    hasAttemptedLoginRef,
    isSavingUserRef,
    saveUser,
    router,
    flowId,
    isFlowValidForRedirection,
  ]);

  useEffect(() => {
    if (accountId) {
      const destinationUrl =
        flowId && isFlowValidForRedirection
          ? `/destinations?flowId=${encodeURIComponent(flowId)}`
          : "/destinations";
      router.push(destinationUrl);
    }
  }, [accountId, flowId, isFlowValidForRedirection, router]);

  const handleGetStarted = useCallback(() => {
    if (accountId) {
      const destinationUrl =
        flowId && isFlowValidForRedirection
          ? `/destinations?flowId=${encodeURIComponent(flowId)}`
          : "/destinations";
      router.push(destinationUrl);
    } else {
      openAuthModal();
      hasAttemptedLoginRef.current = true;
    }
  }, [accountId, openAuthModal, router, flowId, isFlowValidForRedirection]);

  const renderButtonWithStatus = () => {
    if (!flowId) {
      return (
        <div className="flex justify-center">
          <button
            onClick={handleGetStarted}
            className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg
              hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-blue-600"
          >
            <span className="flex items-center gap-3">
              Start Free Verification
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      );
    }

    if (flowValidationStatus === "loading") {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-base font-medium">Validating flow...</span>
          </div>
          <button
            disabled
            className="px-8 py-3 bg-gray-400 text-white rounded-full font-medium cursor-not-allowed opacity-50"
          >
            Please Wait
          </button>
        </div>
      );
    }

    if (flowValidationStatus === "valid") {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
            <CheckCircle className="h-5 w-5" />
            <span className="text-base font-medium">Ready to verify</span>
            {flowData && (
              <span className="text-sm text-blue-600">
                • {flowData.projectName}
              </span>
            )}
          </div>
          <button
            onClick={handleGetStarted}
            className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg
              hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Start KYC Verification
              <Shield className="h-5 w-5" />
            </span>
          </button>
        </div>
      );
    }

    if (flowValidationStatus === "invalid") {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Invalid flow link</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg 
              font-medium transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </div>
      );
    }

    if (flowValidationStatus === "inactive") {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Flow not active</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg 
              font-medium transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </div>
      );
    }

    if (flowValidationStatus === "error") {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Verification error</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg 
              font-medium transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleGetStarted}
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-lg 
          font-medium transition-all duration-300 hover:scale-105"
      >
        Get Started
      </button>
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Loading overlay - positioned at the very top to cover everything */}
      {isSavingUser && <Loading text="Processing..." />}

      {/* Minimalist background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Right Shield - Decorative */}
        <div className="absolute top-20 right-20 opacity-20 z-0">
          <div className="relative">
            <div className="w-48 h-48 flex items-center justify-center">
              <Shield
                className="w-40 h-40 text-blue-600 drop-shadow-xl"
                style={{
                  filter: "drop-shadow(0 0 15px rgba(37, 99, 235, 0.3))",
                }}
              />
            </div>

            {/* Small rotating ring */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-48 h-48 border border-blue-400/40 rounded-full"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500/70 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600/70 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Bottom Left Smaller Shield */}
        <div className="absolute bottom-32 left-16 opacity-15 z-0">
          <div className="relative">
            <div className="w-32 h-32 flex items-center justify-center">
              <Shield className="w-24 h-24 text-blue-500" />
            </div>
            <div className="absolute inset-0 animate-reverse-spin">
              <div className="w-32 h-32 border border-blue-300/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Floating Security Icons - Distributed */}
        <div className="absolute top-1/4 left-1/4 opacity-40 z-0">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-full border border-blue-400/30 animate-float">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="absolute top-1/3 right-1/3 opacity-35 z-0">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-full border border-blue-400/30 animate-float-reverse">
            <Eye className="w-7 h-7 text-blue-600" />
          </div>
        </div>

        <div className="absolute bottom-1/4 right-1/4 opacity-40 z-0">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500/20 rounded-full border border-blue-400/30 animate-float">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Data Flow Lines */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Vertical flowing lines */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse"
              style={{
                left: `${15 + i * 15}%`,
                height: "100%",
                animationDelay: `${i * 0.8}s`,
                animationDuration: "3s",
              }}
            />
          ))}

          {/* Horizontal flowing lines */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"
              style={{
                top: `${20 + i * 20}%`,
                width: "100%",
                animationDelay: `${i * 1.2}s`,
                animationDuration: "4s",
              }}
            />
          ))}
        </div>

        {/* Enhanced floating particles with various sizes */}
        {particleStyles.map((style, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${
              index % 4 === 0
                ? "w-2 h-2 bg-blue-400/40 shadow-sm shadow-blue-400/30"
                : index % 4 === 1
                ? "w-1 h-1 bg-blue-500/50 shadow-sm shadow-blue-500/40"
                : index % 4 === 2
                ? "w-1.5 h-1.5 bg-blue-600/45 shadow-sm shadow-blue-600/35"
                : "w-0.5 h-0.5 bg-blue-700/60 shadow-sm shadow-blue-700/50"
            } animate-float`}
            style={{
              ...style,
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Enhanced gradient orbs */}
        <div
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-radial from-blue-400/12 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-400/6 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Main content */}
        <div className="space-y-16">
          {/* Main heading - clean and bold */}
          <div className="space-y-8 pt-20">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
              <span className="block text-gray-900 mb-4">Zero-Knowledge</span>
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                KYC Service
              </span>
            </h1>

            <p className="mx-auto max-w-4xl text-xl md:text-2xl text-gray-600 leading-relaxed">
              Revolutionary identity verification using cutting-edge
              zero-knowledge proofs.
              <span className="text-blue-600 font-semibold">
                {" "}
                Protect your privacy completely
              </span>
              ,
              <span className="text-blue-700 font-semibold">
                {" "}
                absolutely free
              </span>
              .
            </p>
          </div>

          {/* Clean feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                Zero Exposure
              </div>
              <div className="text-gray-600 font-medium">Personal Data</div>
            </div>

            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-blue-700 mb-2">
                Always Free
              </div>
              <div className="text-gray-600 font-medium">No Hidden Costs</div>
            </div>

            <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold text-blue-500 mb-2">
                Instant
              </div>
              <div className="text-gray-600 font-medium">
                Real-time Verification
              </div>
            </div>
          </div>

          {/* CTA buttons - clean design */}
          <div className="pt-8">
            {renderButtonWithStatus()}
            <p className="mt-6 text-sm text-gray-500">
              ✨ No credit card required • No signup fees • Start immediately
            </p>
          </div>

          {/* Key features - minimal and elegant */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto pt-16">
            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Zero Data Exposure
              </h3>
              <p className="text-gray-600">
                Your personal information never leaves your device
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Verification completed in seconds, not days
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Globally Accessible
              </h3>
              <p className="text-gray-600">
                Completely free for everyone, everywhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
