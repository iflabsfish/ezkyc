"use client";
import { Header } from "@/components";
import { Hero } from "./components/home/Hero";
import { IntroSection } from "./components/home/IntroSection";
import { FeaturesGrid } from "./components/home/FeaturesGrid";
import { HomeFooter } from "./components/home/HomeFooter";
import { InteractiveDots } from "./components/home/InteractiveDots";
import { useSearchParams } from "next/navigation";
import { useFlowValidation } from "@/hooks/useFlowValidation";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal, useUser } from "@account-kit/react";
import { useAuthUserContext } from "@/app/context/AuthUserContext";
import { useStateRef } from "@/hooks/useDataRef";

export default function Home() {
  const searchParams = useSearchParams();
  const flowId = searchParams?.get("flowId") || null;
  const router = useRouter();
  const { accountId } = useAuth();
  const { openAuthModal } = useAuthModal();
  const user = useUser();
  const hasAttemptedLoginRef = useRef(false);
  const { saveUser, isSavingUser } = useAuthUserContext();
  const isSavingUserRef = useStateRef(isSavingUser);

  const {
    flowData,
    isValidatingFlow,
    flowExists,
    isFlowActive,
    flowValidationStatus,
  } = useFlowValidation(flowId);

  // Check if flow is valid for redirection
  const isFlowValidForRedirection = flowExists && isFlowActive;

  // Handle user login completion and redirection
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

  // Handle already logged in user redirection
  useEffect(() => {
    if (accountId) {
      const destinationUrl =
        flowId && isFlowValidForRedirection
          ? `/destinations?flowId=${encodeURIComponent(flowId)}`
          : "/destinations";
      router.push(destinationUrl);
    }
  }, [accountId, flowId, isFlowValidForRedirection, router]);

  // Handle bottom CTA button click
  const handleBottomCTA = useCallback(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
      {/* Interactive Dots Background - covers entire page */}
      <InteractiveDots />

      {/* Simplified background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-blue-400/2 to-blue-600/3"></div>

        {/* Clean grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.8) 1px, transparent 1px)
            `,
              backgroundSize: "120px 120px",
            }}
          />
        </div>

        {/* Minimal accent elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-blue-400/8 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-radial from-blue-500/6 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4">
          <div className="space-y-32">
            {/* Hero section */}
            <section>
              <Hero
                flowId={flowId}
                flowExists={flowExists}
                isValidatingFlow={isValidatingFlow}
                isFlowActive={isFlowActive}
                flowValidationStatus={flowValidationStatus}
                flowData={flowData}
              />
            </section>

            {/* How it works section */}
            <section>
              <IntroSection />
            </section>

            {/* Features section */}
            <section>
              <FeaturesGrid />
            </section>

            {/* Final CTA section */}
            <section className="py-24">
              <div className="text-center max-w-5xl mx-auto">
                <div className="relative">
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-blue-100/30 to-blue-50/50 rounded-3xl blur-3xl"></div>

                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-16 border border-gray-200/50 shadow-xl">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200/50 rounded-full mb-8">
                      <span className="text-blue-800 font-semibold text-sm">
                        Ready to Get Started?
                      </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                      Experience the Future of
                      <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
                        Identity Verification
                      </span>
                    </h2>

                    <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
                      Join the privacy revolution. Verify your identity without
                      compromising your personal data.
                    </p>

                    <div className="flex justify-center mb-12">
                      <button
                        onClick={handleBottomCTA}
                        className="group px-16 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-blue-600"
                      >
                        <span className="flex items-center gap-3">
                          Start Free Verification
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Always Free</span>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="font-medium">
                          Instant Verification
                        </span>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-700 rounded-full"></div>
                        <span className="font-medium">100% Private</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <HomeFooter />
      </div>
    </div>
  );
}
