import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ChevronRight, Building, User, Shield, Lock, Eye, FileCheck } from "lucide-react"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="rounded-full bg-indigo-100 p-4 mb-4">
            <Shield className="h-12 w-12 text-indigo-600" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Privacy <span className="text-indigo-600">Matters</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            We're committed to protecting your data and privacy during KYC with zero-knowledge proofs.
          </p>

          {/* Circular privacy features */}
          <div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: <Shield className="h-6 w-6" />, text: "Data Protection" },
              { icon: <Lock className="h-6 w-6" />, text: "Secure Encryption" },
              { icon: <Eye className="h-6 w-6" />, text: "Privacy Controls" },
              { icon: <FileCheck className="h-6 w-6" />, text: "Compliance" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 p-5 text-indigo-600 shadow-md transition-transform hover:scale-105">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-800">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Cards section */}
          <div className="w-full max-w-4xl">
            <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
              <DestinationCard
                title="For Companies"
                description="Configure your verification requirements and protect your business."
                icon={<Building className="h-8 w-8 text-indigo-600" />}
                href="/company"
              />

              <DestinationCard
                title="For Users"
                description="Complete your verification securely without compromising your privacy."
                icon={<User className="h-8 w-8 text-indigo-600" />}
                href="/user"
              />
            </div>
          </div>

          {/* Privacy commitment circles */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-10">
            <div className="flex flex-col items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-indigo-200 bg-white p-4 shadow-md">
                <span className="text-2xl font-bold text-indigo-600">100%</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">Data Protection</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-indigo-200 bg-white p-4 shadow-md">
                <span className="text-2xl font-bold text-indigo-600">100%</span>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">Free</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function DestinationCard({ title, description, icon, href }) {
  return (
    <Link href={href}>
      <Card className="bg-white p-6 text-center transition-all duration-300 hover:shadow-lg hover:shadow-indigo-100 border border-transparent hover:border-indigo-100">
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-full bg-indigo-50 p-4">{icon}</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="mt-2 flex items-center text-indigo-600">
            <span className="font-medium">Get Started</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
