import { countries } from "@selfxyz/qrcode";
import { AddressType } from "./address";

export interface SelfAppDisclosureConfig {
  issuing_state?: boolean;
  name?: boolean;
  passport_number?: boolean;
  nationality?: boolean;
  date_of_birth?: boolean;
  gender?: boolean;
  expiry_date?: boolean;
  ofac?: boolean;
  excludedCountries?: Country3LetterCode[];
  minimumAge?: number;
  addressType?: "evm" | "iron";
}

/**
 * KYC verification options type
 */
export interface KycVerificationOptions {
  discloseIssuingState: boolean;
  discloseName: boolean;
  discloseNationality: boolean;
  discloseDateOfBirth: boolean;
  disclosePassportNumber: boolean;
  discloseGender: boolean;
  discloseExpiryDate: boolean;
}

/**
 * KYC flow type
 */
export interface KycFlow {
  id: string;
  userId: string;
  projectName: string;
  startDate: number; // timestamp
  endDate: number | null; // timestamp, null means no end date
  verificationOptions: KycVerificationOptions;
  ageRequirement: number;
  countryRestrictions: string[]; // ISO country codes
  enableOfacSanctionsCheck: boolean;
  isDeleted: boolean;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  addressType: AddressType;
}

/**
 * Create KYC flow request type
 */
export interface CreateKycFlowRequest {
  projectName: string;
  startDate: number;
  endDate: number | null;
  options: SelfAppDisclosureConfig;
  addressType: "evm" | "iron";
}

export type KycFlowInDB = CreateKycFlowRequest & {
  userId: string;
  id: string;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
};

/**
 * Update KYC flow request type
 */
export type UpdateKycFlowRequest = Partial<
  Omit<KycFlow, "id" | "userId" | "createdAt" | "updatedAt" | "isDeleted">
>;

/**
 * User KYC verification type
 */
export interface UserKycVerification {
  id: string;
  userId: string;
  kycFlowId: string;
  blockchainAddress: string;
  status: "pending" | "approved" | "rejected";
  isDeleted: boolean;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  qrcodeData: string;
}

/**
 * Create user KYC verification request type
 */
export type CreateUserKycVerificationRequest = {
  userId: string;
  kycFlowId: string;
  blockchainAddress: string;
  qrcodeData: string;
};

/**
 * User KYC verification with flow details
 */
export interface UserKycVerificationWithFlow extends UserKycVerification {
  flow: KycFlowInDB;
}

export type Country3LetterCode = (typeof countries)[keyof typeof countries];

export interface KycObject {
  userId: string;
  projectName: string;
  startDate: number;
  endDate: number;
  options: {
    issuing_state: boolean;
    name: boolean;
    nationality: boolean;
    date_of_birth: boolean;
    passport_number: boolean;
    gender: boolean;
    expiry_date: boolean;
    minimumAge: number;
    excludedCountries: Country3LetterCode[];
    ofac: boolean;
  };
  id: string;
  isDeleted: boolean;
  createdAt: number;
  updatedAt: number;
  addressType: AddressType;
}

export interface KycFlowInDBWithStats extends KycFlowInDB {
  participantCount: number;
  completedCount: number;
}

export interface KycFlowWithStats extends KycFlow {
  participantCount: number;
  completedCount: number;
}
