import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white py-8">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <span>Powered by</span>
          <Link
            href="https://self.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Self
          </Link>
        </div>
      </div>
    </footer>
  );
}
