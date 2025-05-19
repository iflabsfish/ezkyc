"use client";
import Link from "next/link";
import { Card } from "@/components";
import { ChevronRight } from "lucide-react";

interface DestinationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function DestinationCard({
  title,
  description,
  icon,
  href,
}: DestinationCardProps) {
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
  );
}
