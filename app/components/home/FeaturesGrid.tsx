"use client";
import { Shield, Lock, Eye, FileCheck } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    { icon: <Shield className="h-6 w-6" />, text: "Data Protection" },
    { icon: <Lock className="h-6 w-6" />, text: "Secure Encryption" },
    { icon: <Eye className="h-6 w-6" />, text: "Privacy Controls" },
    { icon: <FileCheck className="h-6 w-6" />, text: "Compliance" },
  ];

  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
      {features.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 p-5 text-indigo-600 shadow-md transition-transform hover:scale-105">
            {item.icon}
          </div>
          <span className="font-medium text-gray-800">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
