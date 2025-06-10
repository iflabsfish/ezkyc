import Link from "next/link";
import Image from "next/image";

export function HomeFooter() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Brand section */}
          <div className="col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Zero-Knowledge KYC
              </h3>
              <p className="text-blue-100 mt-2 text-xl">
                The Future of Identity Verification
              </p>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              Revolutionary privacy-preserving identity verification using
              cutting-edge zero-knowledge proof technology. Completely free,
              instantly secure, globally accessible.
            </p>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-cyan-400 font-bold text-lg">ZK</span>
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-blue-400 font-bold text-lg">⚡</span>
              </div>
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-blue-400 font-bold text-lg">🔒</span>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="col-span-1 flex justify-end">
            <div className="w-40">
              {/* Open Source */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-blue-400 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Open Source
                </h4>
                <div className="space-y-2">
                  <Link
                    href="https://github.com/iflabsfish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={12}
                        height={12}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-300 group-hover:text-blue-400 transition-colors font-medium text-xs">
                        GitHub
                      </div>
                      <div className="text-gray-400 text-xs">@iflabsfish</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-400 flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  Community
                </h4>
                <div className="space-y-2">
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-gray-800 to-black rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src="/x.svg"
                        alt="X (Twitter)"
                        width={12}
                        height={12}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <span className="text-gray-300 group-hover:text-cyan-400 transition-colors text-xs font-medium flex-1 min-w-0">
                      X
                    </span>
                  </Link>

                  <Link
                    href="https://discord.gg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src="/discord.svg"
                        alt="Discord"
                        width={12}
                        height={12}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-xs font-medium flex-1 min-w-0">
                      Discord
                    </span>
                  </Link>

                  <Link
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src="/telegram.svg"
                        alt="Telegram"
                        width={12}
                        height={12}
                        className="filter brightness-0 invert"
                      />
                    </div>
                    <span className="text-gray-300 group-hover:text-cyan-400 transition-colors text-xs font-medium flex-1 min-w-0">
                      Telegram
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2 text-gray-300">
                <span>Powered by</span>
                <Link
                  href="https://self.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Self
                </Link>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="text-gray-400 text-sm">
                © 2024 Zero-Knowledge KYC. All rights reserved.
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Privacy First • Always Free</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
