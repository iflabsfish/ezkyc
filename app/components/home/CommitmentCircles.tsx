"use client";
import { useState, useEffect } from "react";
import {
  Shield,
  DollarSign,
  Clock,
  Users,
  Globe,
  Zap,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  Lock,
  Heart,
} from "lucide-react";

interface FloatingElementStyle {
  left: string;
  top: string;
  animationDelay: string;
}

export function CommitmentCircles() {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingStyles, setFloatingStyles] = useState<FloatingElementStyle[]>(
    []
  );

  useEffect(() => {
    setIsVisible(true);
    const styles = Array.from({ length: 8 }, () => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setFloatingStyles(styles);
  }, []);

  const principles = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Privacy Protection",
      description:
        "Your personal information is never exposed to third parties",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <DollarSign className="h-12 w-12" />,
      title: "Zero Cost Service",
      description: "Completely free service with no hidden fees or charges",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: "Instant Verification",
      description:
        "Real-time identity verification using advanced cryptography",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: <Globe className="h-12 w-12" />,
      title: "Global Access",
      description:
        "Available worldwide with support for international documents",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: <CheckCircle className="h-12 w-8" />,
      title: "Mathematical Security",
      description:
        "Cryptographically proven security with zero-knowledge proofs",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Developer Friendly",
      description: "Simple API integration for seamless implementation",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
    },
  ];

  const commitments = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy First",
      description:
        "We commit to never collecting, storing, or sharing your personal sensitive information",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Forever Free",
      description:
        "We commit to keeping our service permanently free for all users worldwide",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Open Source",
      description:
        "We commit to transparency with fully open-source core technology",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Performance Excellence",
      description:
        "We commit to maintaining industry-leading speed and reliability",
    },
  ];

  return (
    <div
      className={`w-full max-w-7xl mx-auto space-y-24 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Service principles */}
      <div>
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-100 rounded-full mb-8">
            <span className="text-blue-800 font-semibold text-sm">
              OUR PRINCIPLES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Commitment
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Core principles that guide our zero-knowledge proof KYC service
            development and operation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((item, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div
                className={`${item.bgColor} rounded-3xl p-8 border-2 border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Floating elements */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {floatingStyles.map((style, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
                      style={style}
                    />
                  ))}
                </div>

                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div
                    className={`bg-gradient-to-r ${item.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology advantages */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-blue-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Technology Advantages</h3>
            <p className="text-blue-100 text-lg">
              Why zero-knowledge proofs are revolutionary for identity
              verification
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">🔒</div>
                <div className="text-xl font-bold mb-2">Privacy</div>
                <div className="text-blue-100 text-sm">
                  Mathematically Proven
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">⚡</div>
                <div className="text-xl font-bold mb-2">Speed</div>
                <div className="text-blue-100 text-sm">
                  Real-time Processing
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">💰</div>
                <div className="text-xl font-bold mb-2">Cost</div>
                <div className="text-blue-100 text-sm">Completely Free</div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                <div className="text-4xl mb-4">🌍</div>
                <div className="text-xl font-bold mb-2">Access</div>
                <div className="text-blue-100 text-sm">Global Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commitments */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-3xl p-12 border border-blue-100">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Our Guarantees
          </h3>
          <p className="text-lg text-gray-600">
            These aren&apos;t just promises - they&apos;re our solemn
            commitments to every user
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {commitments.map((commitment, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {commitment.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {commitment.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {commitment.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust indicators */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          Built on Trust
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 bg-white rounded-2xl px-12 py-8 shadow-xl border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Privacy by Design</span>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Always Available</span>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Open Source</span>
          </div>
          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Future-Proof</span>
          </div>
        </div>
      </div>
    </div>
  );
}
