import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function BackButton({
  href,
  children,
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children}
    </Link>
  );
}
