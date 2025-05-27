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
      className={`inline-flex items-center px-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children}
    </Link>
  );
}
