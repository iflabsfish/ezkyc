import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1 mb-4">
          <span>Powered by</span>
          <Link
            href="https://self.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Self
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-500 hover:text-indigo-600">
            Home
          </Link>
          <Link href="/company" className="text-gray-500 hover:text-indigo-600">
            For Companies
          </Link>
          <Link href="/user" className="text-gray-500 hover:text-indigo-600">
            For Users
          </Link>
        </div>
      </div>
    </footer>
  )
}
