import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiUrl() {
  return process.env.API_URL || "https://c622-118-169-75-84.ngrok-free.app";
}

export function getVerifierUrl() {
  return process.env.VERIFIER_URL || "https://c622-118-169-75-84.ngrok-free.app/api/verify";
}

export function companyUserKey(companyId: string) {
  return `${companyId}:users`;
}

export function companyProofKey(companyId: string) {
  return `${companyId}:proofs`;
}

export function enableMockPassport() {
  return process.env.ENABLE_MOCK_PASSPORT === "true";
}
