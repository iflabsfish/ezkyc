"use client";
import { Building, User } from "lucide-react";
import { DestinationCard } from "./DestinationCard";

export function DestinationCards() {
  return (
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
  );
}
