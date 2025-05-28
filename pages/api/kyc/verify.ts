import { NextApiRequest, NextApiResponse } from "next";
import {
  SelfBackendVerifier,
  countryCodes,
  getUserIdentifier,
} from "@selfxyz/core";
import { kv } from "@vercel/kv";
import { SelfApp } from "@selfxyz/qrcode";
import {
  companyProofKey,
  companyUserKey,
  enableMockPassport,
  getApiUrl,
} from "@/lib/api";
import {
  KycFlowInDB,
  UserKycVerification,
  UserKycVerificationWithFlow,
} from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res
        .status(400)
        .json({ message: "Proof and publicSignals are required" });
    }

    const userId = await getUserIdentifier(publicSignals);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const verificationIds = await kv.smembers(`user:kyc:${userId}`);

    if (!verificationIds || verificationIds.length === 0) {
      return res.status(200).json({
        success: true,
        verifications: [],
      });
    }

    const verificationPromises = verificationIds.map((id: string) =>
      kv.get<UserKycVerification>(`kyc:verification:${id}`)
    );
    const verifications = await Promise.all(verificationPromises);

    const validVerifications = verifications
      .filter((v): v is UserKycVerification => v !== null)
      .filter((v) => !v.isDeleted);

    const verificationsWithFlowPromises = validVerifications.map(async (v) => {
      const flow = await kv.get<KycFlowInDB>(`kyc:flow:${v.kycFlowId}`);

      if (!flow || flow.isDeleted) {
        return null;
      }

      return {
        ...v,
        flow,
      } as UserKycVerificationWithFlow;
    });

    const verificationsWithFlow = (
      await Promise.all(verificationsWithFlowPromises)
    ).filter(
      (v): v is UserKycVerificationWithFlow =>
        v !== null && v.status === "pending"
    );

    if (verificationsWithFlow.length === 0) {
      return res.status(400).json({
        message: "No pending verifications found for the user",
      });
    }

    if (verificationsWithFlow.length > 1) {
      return res.status(400).json({
        message: "Multiple verifications found for the same user",
      });
    }

    const verification = verificationsWithFlow[0];

    const flow = verification.flow;
    const flowId = flow.id;
    const options = flow.options;
    const flowStart = flow.startDate;
    const flowEnd = flow.endDate;
    const now = new Date().getTime();
    if (flowStart && now < Number(flowStart)) {
      return;
    }
    if (flowEnd && now > Number(flowEnd)) {
      return;
    }

    let minimumAge = undefined;
    let excludedCountryList: string[] = [];
    let enableOfac = false;
    let enabledDisclosures = {
      issuing_state: false,
      name: false,
      nationality: false,
      date_of_birth: false,
      passport_number: false,
      gender: false,
      expiry_date: false,
    };

    if (options) {
      const savedOptions = options as SelfApp["disclosures"];
      if (savedOptions) {
        console.log("Saved options:", savedOptions);

        minimumAge = savedOptions.minimumAge;
        if (
          savedOptions.excludedCountries &&
          savedOptions.excludedCountries.length > 0
        ) {
          excludedCountryList = savedOptions.excludedCountries;
        }

        enableOfac =
          savedOptions.ofac !== undefined ? savedOptions.ofac : enableOfac;

        enabledDisclosures = {
          issuing_state:
            savedOptions.issuing_state !== undefined
              ? savedOptions.issuing_state
              : enabledDisclosures.issuing_state,
          name:
            savedOptions.name !== undefined
              ? savedOptions.name
              : enabledDisclosures.name,
          nationality:
            savedOptions.nationality !== undefined
              ? savedOptions.nationality
              : enabledDisclosures.nationality,
          date_of_birth:
            savedOptions.date_of_birth !== undefined
              ? savedOptions.date_of_birth
              : enabledDisclosures.date_of_birth,
          passport_number:
            savedOptions.passport_number !== undefined
              ? savedOptions.passport_number
              : enabledDisclosures.passport_number,
          gender:
            savedOptions.gender !== undefined
              ? savedOptions.gender
              : enabledDisclosures.gender,
          expiry_date:
            savedOptions.expiry_date !== undefined
              ? savedOptions.expiry_date
              : enabledDisclosures.expiry_date,
        };
      } else {
        console.log("Failed to retrieve options from store");
      }
    } else {
      console.log("No companyId found in store, using default options");
    }
    const configuredVerifier = new SelfBackendVerifier(
      "ezkyc",
      getApiUrl(),
      "uuid",
      true
    );

    if (minimumAge !== undefined) {
      configuredVerifier.setMinimumAge(minimumAge);
    }

    if (excludedCountryList.length > 0) {
      configuredVerifier.excludeCountries(
        ...(excludedCountryList as (keyof typeof countryCodes)[])
      );
    }

    if (enableOfac) {
      configuredVerifier.enableNameAndDobOfacCheck();
    }

    const result = await configuredVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      const filteredSubject = { ...result.credentialSubject };

      if (!enabledDisclosures.issuing_state && filteredSubject) {
        filteredSubject.issuing_state = "Not disclosed";
      }
      if (!enabledDisclosures.name && filteredSubject) {
        filteredSubject.name = "Not disclosed";
      }
      if (!enabledDisclosures.nationality && filteredSubject) {
        filteredSubject.nationality = "Not disclosed";
      }
      if (!enabledDisclosures.date_of_birth && filteredSubject) {
        filteredSubject.date_of_birth = "Not disclosed";
      }
      if (!enabledDisclosures.passport_number && filteredSubject) {
        filteredSubject.passport_number = "Not disclosed";
      }
      if (!enabledDisclosures.gender && filteredSubject) {
        filteredSubject.gender = "Not disclosed";
      }
      if (!enabledDisclosures.expiry_date && filteredSubject) {
        filteredSubject.expiry_date = "Not disclosed";
      }

      const flowProofs = await kv.smembers(companyProofKey(flowId));
      if (flowProofs.length > 0 && flowProofs.includes(proof)) {
        return res.status(400).json({
          message: "User has already verified for another address",
        });
      }
      await kv.sadd(companyProofKey(flowId), proof);

      const updatedVerification = {
        ...verification,
        status: "approved",
        updatedAt: Date.now(),
      };
      await kv.set(`kyc:verification:${verification.id}`, updatedVerification);
      await kv.set(
        `kyc:flow:${
          verification.kycFlowId
        }:address:${verification.blockchainAddress.toLowerCase()}`,
        updatedVerification
      );

      res.status(200).json({
        status: "success",
        result: result.isValid,
        credentialSubject: filteredSubject,
        verificationOptions: {
          minimumAge,
          ofac: enableOfac,
          excludedCountries: excludedCountryList.map((countryName) => {
            const entry = Object.entries(countryCodes).find(
              ([_, name]) => name === countryName
            );
            return entry ? entry[0] : countryName;
          }),
        },
      });
    } else {
      const updatedVerification = {
        ...verification,
        status: "rejected",
        updatedAt: Date.now(),
      };
      await kv.set(`kyc:verification:${verification.id}`, updatedVerification);
      await kv.set(
        `kyc:flow:${
          verification.kycFlowId
        }:address:${verification.blockchainAddress.toLowerCase()}`,
        updatedVerification
      );
      res.status(400).json({
        status: "error",
        result: result.isValid,
        message: "Verification failed",
        details: result,
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
