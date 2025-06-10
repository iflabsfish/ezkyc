"use client";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Zap,
  Users,
  Globe,
  CreditCard,
  Clock,
  CheckCircle,
  Cpu,
  Network,
  Database,
} from "lucide-react";
import { useState, useEffect } from "react";

export function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreFeatures = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Zero-Knowledge Proofs",
      description:
        "Advanced ZK-SNARKs technology enables identity verification without revealing any personal information",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Quantum-Resistant Security",
      description:
        "Military-grade encryption with quantum-resistant algorithms ensures future-proof security",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Complete Privacy",
      description:
        "Your sensitive information never leaves your device - true privacy by design",
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Performance",
      description:
        "Sub-second verification powered by optimized cryptographic protocols",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Decentralized Network",
      description:
        "Distributed verification infrastructure eliminates single points of failure",
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Compatibility",
      description:
        "Support for identity documents from 120+ countries with localized verification",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Edge Computing",
      description:
        "Local processing on user devices ensures maximum privacy and performance",
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Zero Cost",
      description:
        "Completely free service for all users, breaking down financial barriers to verification",
      color: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const serviceAdvantages = [
    {
      label: "Traditional KYC",
      value: "Expensive",
      trend: "High Cost",
      negative: true,
    },
    {
      label: "Our Solution",
      value: "Free",
      trend: "Zero Cost",
      negative: false,
    },
    {
      label: "Data Privacy",
      value: "Protected",
      trend: "Complete",
      negative: false,
    },
    {
      label: "Verification",
      value: "Instant",
      trend: "Real-time",
      negative: false,
    },
  ];

  return (
    <div
      className={`w-full max-w-7xl mx-auto space-y-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Header section */}
      <div className="text-center">
        <div className="mb-6">
          <div className="w-12 h-0.5 bg-blue-500 mx-auto mb-4"></div>
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
            Cutting-Edge Technology
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Advanced Features
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Built on the latest zero-knowledge proof technology, delivering
          secure, private, and efficient identity verification solutions for the
          modern world.
        </p>
      </div>

      {/* Core features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Large featured cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Zero-Knowledge Proofs
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Advanced ZK-SNARKs technology enables identity verification
                without revealing any personal information
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-600/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Lock className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quantum-Resistant Security
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Military-grade encryption with quantum-resistant algorithms
                ensures future-proof security
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-1/2 right-0 w-16 h-16 bg-blue-400/10 rounded-full blur-lg"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Privacy
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Your sensitive information never leaves your device - true
                privacy by design
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 left-1/2 w-18 h-18 bg-blue-500/10 rounded-full blur-lg"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Lightning Performance
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Sub-second verification powered by optimized cryptographic
                protocols
              </p>
            </div>
          </div>
        </div>

        {/* Featured tall card */}
        <div className="group relative bg-gradient-to-b from-blue-50 via-blue-100/50 to-blue-50 rounded-3xl p-10 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 border border-blue-200/20 rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border border-blue-200/20 rounded-full transform -translate-x-12 translate-y-12"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Globe className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Global Compatibility
              </h3>
            </div>

            <div className="flex-grow">
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Comprehensive support for identity documents from 120+ countries
                with advanced localization
              </p>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">
                    120+ Countries Supported
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">
                    Multi-Language Processing
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">
                    Regional Compliance
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-blue-700 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">
                    Universal Document Types
                  </span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50/50 border border-blue-200/30 rounded-xl">
                <div className="text-sm text-blue-800 font-semibold mb-2">
                  Supported Regions
                </div>
                <div className="text-xs text-blue-600 leading-relaxed">
                  North America • Europe • Asia-Pacific • Latin America • Middle
                  East • Africa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Edge Computing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Local processing on user devices ensures maximum privacy and
                performance
              </p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-50/50 to-blue-100/30 rounded-3xl p-8 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-1/2 right-0 w-20 h-20 bg-blue-700/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-all duration-300 shadow-lg">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Zero Cost
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Completely free service for all users, breaking down financial
                barriers to verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technology principles */}
      <div className="relative">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Zero-Knowledge Proofs?
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The core advantages of our cryptographic approach
          </p>
        </div>

        {/* Central hub design */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">ZK</span>
            </div>
          </div>

          {/* Connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 400 300"
          >
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <line
              x1="200"
              y1="150"
              x2="80"
              y2="80"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="200"
              y1="150"
              x2="320"
              y2="80"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="200"
              y1="150"
              x2="80"
              y2="220"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
            <line
              x1="200"
              y1="150"
              x2="320"
              y2="220"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;10"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          </svg>

          {/* Corner nodes */}
          <div className="grid grid-cols-2 gap-x-48 gap-y-32 relative">
            {/* Top left - Privacy */}
            <div className="group flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-pulse"></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Privacy
              </h4>
              <p className="text-gray-600 text-center text-sm max-w-32">
                Mathematical proof without data exposure
              </p>
            </div>

            {/* Top right - Speed */}
            <div className="group flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div
                  className="absolute -inset-2 bg-blue-600/20 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Speed
              </h4>
              <p className="text-gray-600 text-center text-sm max-w-32">
                Real-time verification in seconds
              </p>
            </div>

            {/* Bottom left - Cost */}
            <div className="group flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <div
                  className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Cost
              </h4>
              <p className="text-gray-600 text-center text-sm max-w-32">
                Always free for everyone
              </p>
            </div>

            {/* Bottom right - Access */}
            <div className="group flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <div
                  className="absolute -inset-2 bg-blue-500/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Access
              </h4>
              <p className="text-gray-600 text-center text-sm max-w-32">
                Universal global availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
