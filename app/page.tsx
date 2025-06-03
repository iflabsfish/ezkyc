"use client";
import { Footer, Header } from "@/components";
import { Hero } from "./components/home/Hero";
import { FeaturesGrid } from "./components/home/FeaturesGrid";
import { CommitmentCircles } from "./components/home/CommitmentCircles";
import { useSearchParams } from "next/navigation";
import { useFlowValidation } from "@/hooks/useFlowValidation";

export default function Home() {
  const searchParams = useSearchParams();
  const flowId = searchParams?.get('flowId') || null;
  
  const {
    flowData,
    isValidatingFlow,
    flowExists,
    isFlowActive,
    flowValidationStatus,
  } = useFlowValidation(flowId);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <Hero 
            flowId={flowId} 
            flowExists={flowExists} 
            isValidatingFlow={isValidatingFlow}
            isFlowActive={isFlowActive}
            flowValidationStatus={flowValidationStatus}
            flowData={flowData}
          />
          <FeaturesGrid />
          <CommitmentCircles />
        </div>
      </main>
      <Footer />
    </div>
  );
}
