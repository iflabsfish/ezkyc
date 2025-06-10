"use client";
import { Sparkles, Database, Key, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export function IntroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const workflowSteps = [
    {
      step: "01",
      title: "Upload Identity Document",
      description:
        "Securely scan or upload your identity documents on your device",
      icon: <Sparkles className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      step: "02",
      title: "Local Data Processing",
      description:
        "All information processing happens locally on your device - data never leaves",
      icon: <Database className="h-8 w-8" />,
      color: "from-blue-600 to-blue-700",
    },
    {
      step: "03",
      title: "Generate Zero-Knowledge Proof",
      description:
        "Advanced ZK-SNARKs technology creates mathematical proof of identity authenticity",
      icon: <Key className="h-8 w-8" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      step: "04",
      title: "Submit Verification Result",
      description:
        "Only the proof result is submitted - no personal sensitive information included",
      icon: <CheckCircle className="h-8 w-8" />,
      color: "from-blue-500 to-blue-700",
    },
  ];

  return (
    <div
      className={`w-full max-w-7xl mx-auto space-y-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Comparison section */}
      <div className="text-center">
        <div className="mb-6">
          <div className="w-12 h-0.5 bg-blue-500 mx-auto mb-4"></div>
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
            Technology Comparison
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Traditional KYC vs{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Zero-Knowledge KYC
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-16">
          See how our zero-knowledge proof technology revolutionizes identity
          verification
        </p>

        {/* Modern Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto relative">
          {/* Traditional KYC Card */}
          <div className="relative group">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                      linear-gradient(-45deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Traditional KYC
                    </h3>
                  </div>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    Legacy System
                  </span>
                </div>

                {/* Issues */}
                <div className="space-y-4">
                  {[
                    {
                      metric: "Privacy Protection",
                      value: "❌ Poor",
                      desc: "Personal data exposed to third parties",
                    },
                    {
                      metric: "Processing Time",
                      value: "⏱️ 7-14 Days",
                      desc: "Manual verification process",
                    },
                    {
                      metric: "Cost per Check",
                      value: "💰 $50-100",
                      desc: "Expensive verification fees",
                    },
                    {
                      metric: "Data Security",
                      value: "⚠️ Vulnerable",
                      desc: "Centralized data storage risks",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-4 bg-red-50/50 rounded-xl border border-red-100/50"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {item.metric}
                        </div>
                        <div className="text-gray-600 text-sm">{item.desc}</div>
                      </div>
                      <div className="text-red-600 font-semibold ml-4 text-right">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="w-20 h-20 bg-white rounded-full shadow-2xl border-4 border-gray-100 flex items-center justify-center group hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
            </div>
          </div>

          {/* Zero-Knowledge KYC Card */}
          <div className="relative group">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                      linear-gradient(-45deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Zero-Knowledge KYC
                    </h3>
                  </div>
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Next-Gen Tech
                  </span>
                </div>

                {/* Advantages */}
                <div className="space-y-4">
                  {[
                    {
                      metric: "Privacy Protection",
                      value: "✅ Perfect",
                      desc: "Zero personal data exposure",
                    },
                    {
                      metric: "Processing Time",
                      value: "⚡ Seconds",
                      desc: "Real-time verification",
                    },
                    {
                      metric: "Cost per Check",
                      value: "🎉 FREE",
                      desc: "Always zero cost",
                    },
                    {
                      metric: "Data Security",
                      value: "🛡️ Quantum-Safe",
                      desc: "Cryptographic proof protection",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 group-hover:bg-blue-100/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          {item.metric}
                        </div>
                        <div className="text-gray-600 text-sm">{item.desc}</div>
                      </div>
                      <div className="text-blue-600 font-semibold ml-4 text-right">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="text-center">
        <div className="mb-6">
          <div className="w-12 h-0.5 bg-blue-500 mx-auto mb-4"></div>
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
            Simple Process
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          How It Works
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-16">
          Our zero-knowledge proof KYC verification process is simple, secure,
          and efficient
        </p>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {workflowSteps.map((step, index) => (
              <div key={index} className="group text-center">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                  {/* Subtle background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    {/* Step number */}
                    <div className="text-5xl font-bold text-gray-100 mb-4 group-hover:text-gray-200 transition-colors select-none">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div
                      className={`bg-gradient-to-r ${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
