"use client";
import { Shield } from "lucide-react";
import { useAuthModal, useUser } from "@account-kit/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useStateRef } from "@/hooks/useDataRef";
import { useAuthUserContext } from "@/app/context/AuthUserContext";
import { Loading } from "@/components/ui/Loading";

export function Hero() {
  const user = useUser();
  const { accountId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const hasAttemptedLoginRef = useRef(false);
  const { saveUser, isSavingUser } = useAuthUserContext();
  const isSavingUserRef = useStateRef(isSavingUser);

  useEffect(() => {
    if (user && hasAttemptedLoginRef.current && !isSavingUserRef.current) {
      saveUser(user)
        .then(() => {
          router.push("/destinations");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, hasAttemptedLoginRef, isSavingUserRef, saveUser, router]);

  useEffect(() => {
    if (accountId) {
      router.push("/destinations");
    }
  }, [accountId]);

  const handleGetStarted = useCallback(() => {
    if (accountId) {
      router.push("/destinations");
    } else {
      openAuthModal();
      hasAttemptedLoginRef.current = true;
    }
  }, [accountId, openAuthModal, router]);

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

      <button
        onClick={handleGetStarted}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
          font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        Get Started
      </button>
    </div>
  );
}
