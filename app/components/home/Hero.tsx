"use client";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
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
  flowValidationStatus: 'idle' | 'loading' | 'valid' | 'invalid' | 'inactive' | 'error';
  flowData: KycObject | null;
}

export function Hero({ 
  flowId, 
  flowExists, 
  isValidatingFlow, 
  isFlowActive, 
  flowValidationStatus, 
  flowData 
}: HeroProps) {
  const user = useUser();
  const { accountId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const hasAttemptedLoginRef = useRef(false);
  const { saveUser, isSavingUser } = useAuthUserContext();
  const isSavingUserRef = useStateRef(isSavingUser);

  const isFlowValidForRedirection = flowExists && isFlowActive;

  useEffect(() => {
    if (user && hasAttemptedLoginRef.current && !isSavingUserRef.current) {
      saveUser(user)
        .then(() => {
          const destinationUrl = flowId && isFlowValidForRedirection 
            ? `/destinations?flowId=${encodeURIComponent(flowId)}`
            : "/destinations";
          router.push(destinationUrl);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, hasAttemptedLoginRef, isSavingUserRef, saveUser, router, flowId, isFlowValidForRedirection]);

  useEffect(() => {
    if (accountId) {
      const destinationUrl = flowId && isFlowValidForRedirection 
        ? `/destinations?flowId=${encodeURIComponent(flowId)}`
        : "/destinations";
      router.push(destinationUrl);
    }
  }, [accountId, flowId, isFlowValidForRedirection, router]);

  const handleGetStarted = useCallback(() => {
    if (accountId) {
      const destinationUrl = flowId && isFlowValidForRedirection 
        ? `/destinations?flowId=${encodeURIComponent(flowId)}`
        : "/destinations";
      router.push(destinationUrl);
    } else {
      openAuthModal();
      hasAttemptedLoginRef.current = true;
    }
  }, [accountId, openAuthModal, router, flowId, isFlowValidForRedirection]);

  const isButtonDisabled = flowId ? flowValidationStatus !== 'valid' : false;

  const renderButtonWithStatus = () => {
    if (!flowId) {
      return (
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
            font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          Get Started
        </button>
      );
    }
    
    if (flowValidationStatus === 'loading') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-base font-medium">Validating flow...</span>
          </div>
          <button
            disabled
            className="px-8 py-3 bg-gray-400 text-white rounded-full font-medium cursor-not-allowed"
          >
            Please Wait
          </button>
        </div>
      );
    }

    if (flowValidationStatus === 'valid') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span className="text-base font-medium">Ready to verify</span>
            {flowData && (
              <span className="text-sm text-green-600">• {flowData.projectName}</span>
            )}
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
              font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Start KYC Verification
          </button>
        </div>
      );
    }

    if (flowValidationStatus === 'invalid') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Invalid flow link</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
              font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Login
          </button>
        </div>
      );
    }

    if (flowValidationStatus === 'inactive') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-yellow-50 border border-yellow-200 rounded-full text-yellow-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Flow not active</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
              font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Login
          </button>
        </div>
      );
    }

    if (flowValidationStatus === 'error') {
      return (
        <div className="flex flex-col items-center">
          <div className="mb-6 flex items-center space-x-3 px-6 py-3 bg-red-50 border border-red-200 rounded-full text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="text-base font-medium">Validation error</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
              font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
          >
            Login
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleGetStarted}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
          font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        Get Started
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 text-center">
      {isSavingUser && <Loading text="Processing..." />}
      
      <div className="rounded-full bg-indigo-100 p-4 mb-4">
        <Shield className="h-12 w-12 text-indigo-600" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Your Privacy <span className="text-indigo-600">Matters</span>
      </h1>

      <p className="mx-auto max-w-2xl text-lg text-gray-600">
        We&apos;re committed to protecting your data and privacy during KYC with
        zero-knowledge proofs.
      </p>

      {renderButtonWithStatus()}
    </div>
  );
}
