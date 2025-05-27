"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  useAuthContext,
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStateRef } from "@/hooks/useDataRef";
import { useUserInfo } from "@/hooks";
import Image from "next/image";
import { Company } from "@/types";
import { useAuthUserContext } from "@/app/context/AuthUserContext";

export function Header() {
  const user = useUser();
  const { accountId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const hasAttemptedLoginRef = useRef(false);
  const { account, accountType, isLoading } = useUserInfo();
  const { setTokenAndAccountId, setUserInfo, saveUser, isSavingUser } =
    useAuthUserContext();
  const isSavingUserRef = useStateRef(isSavingUser);

  useEffect(() => {
    if (user && hasAttemptedLoginRef.current && !isSavingUserRef) {
      saveUser(user)
        .then(() => {
          router.push("/destinations");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, hasAttemptedLoginRef, isSavingUserRef, saveUser]);

  const handleSignIn = useCallback(() => {
    if (accountId) {
      router.push("/destinations");
    } else {
      openAuthModal();
      hasAttemptedLoginRef.current = true;
    }
  }, [accountId, router, openAuthModal, hasAttemptedLoginRef]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToDashboard = () => {
    if (accountType === "user") {
      router.push("/user/dashboard");
    } else if (accountType === "company") {
      router.push("/company/dashboard");
    } else {
      router.push("/destinations");
    }
    setMenuOpen(false);
  };

  const hasCompanyLogo =
    accountType === "company" && (account as Company)?.logo;

  const handleLogout = useCallback(() => {
    setTokenAndAccountId(null, null);
    setUserInfo({
      isLoading: true,
      error: null,
      account: null,
      accountType: null,
    });
    logout();
    setMenuOpen(false);
  }, [logout, setTokenAndAccountId, setUserInfo, setMenuOpen]);

  if (signerStatus.isInitializing) {
    return (
      <header className="sticky top-0 z-50 py-4 px-6 bg-gradient-to-r from-indigo-50 via-white to-blue-50 shadow-sm border-b border-indigo-200 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-extrabold text-2xl tracking-widest text-indigo-700 drop-shadow-sm">
            EZKYC
          </div>
          <div className="animate-pulse bg-gray-200 rounded-full h-8 w-20"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 py-4 px-6 bg-gradient-to-r from-indigo-50 via-white to-blue-50 shadow-sm border-b border-indigo-200 backdrop-blur-md bg-opacity-90">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-extrabold text-2xl tracking-widest text-indigo-700 drop-shadow-sm">
          EZKYC
        </div>

        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 
                text-gray-700 border border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center">
                {account && !isLoading ? (
                  <>
                    {hasCompanyLogo ? (
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2 overflow-hidden border border-gray-200">
                        <Image
                          src={(account as Company).logo!}
                          alt="Company Logo"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-2">
                        {account.name
                          ? account.name.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                    )}
                    <span className="font-medium">{account.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-2">
                      {user.email ? user.email.charAt(0).toUpperCase() : "A"}
                    </div>
                    <span className="font-medium">
                      {user.email || "Anonymous User"}
                    </span>
                  </>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 overflow-hidden">
                <div className="py-2 px-4 bg-gray-50 border-b border-gray-100">
                  <p className="text-sm text-gray-500">Signed in as</p>
                  <div className="flex items-center mt-1">
                    {hasCompanyLogo && (
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mr-2 overflow-hidden border border-gray-200">
                        <Image
                          src={(account as Company).logo!}
                          alt="Company Logo"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <p className="font-medium text-gray-700 truncate">
                      {account ? account.name : user.email || "Anonymous User"}
                    </p>
                  </div>
                  {accountType && (
                    <p className="text-xs text-gray-500 mt-1">
                      {accountType === "user"
                        ? "Individual User"
                        : "Business User"}
                    </p>
                  )}
                </div>

                {account && (
                  <button
                    onClick={navigateToDashboard}
                    className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 
                      transition-colors duration-150"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Dashboard</span>
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 
                    transition-colors duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700
              font-medium transition-all duration-200 hover:shadow-md active:scale-95"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
