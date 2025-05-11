import { NextApiRequest, NextApiResponse } from 'next';
import {
  SelfBackendVerifier,
  countryCodes,
  getUserIdentifier
} from '@selfxyz/core';
import { kv } from '@vercel/kv';
import { SelfApp } from '@selfxyz/qrcode';
import { companyProofKey, companyUserKey, enableMockPassport, getApiUrl } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { proof, publicSignals } = req.body;

      const userId = await getUserIdentifier(publicSignals);

      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const companyKId = await kv.hget(userId, "companyId");

      if (!companyKId) {
        return res.status(400).json({ message: 'Company not found' });
      }

      if (!proof || !publicSignals) {
        return res.status(400).json({ message: 'Proof and publicSignals are required' });
      }

      const companyId = companyKId as string;

      // Default options
      let minimumAge;
      let excludedCountryList: string[] = [];
      let enableOfac = false;
      let enabledDisclosures = {
        issuing_state: false,
        name: false,
        nationality: false,
        date_of_birth: false,
        passport_number: false,
        gender: false,
        expiry_date: false
      };

      // Try to retrieve options from store using companyId and check if the company KYC is active
      let companyOptions = await kv.hget(companyId, "options");
      const companyStart = await kv.hget(companyId, "start");
      const companyEnd = await kv.hget(companyId, "end");

      if (companyStart && companyEnd) {
        const now = (new Date()).getTime();
        if (now < Number(companyStart) || now > Number(companyEnd)) {
          return res.status(400).json({ message: 'Company KYC is not active' });
        }
      }

      // If the company KYC is active, update default options
      if (companyOptions) {
        const savedOptions = companyOptions as SelfApp["disclosures"];
        if (savedOptions) {
          console.log("Saved options:", savedOptions);

          // Apply saved options
          minimumAge = savedOptions.minimumAge || minimumAge;

          if (savedOptions.excludedCountries && savedOptions.excludedCountries.length > 0) {
            excludedCountryList = savedOptions.excludedCountries;
          }

          enableOfac = savedOptions.ofac !== undefined ? savedOptions.ofac : enableOfac;

          // Apply all disclosure settings
          enabledDisclosures = {
            issuing_state: savedOptions.issuing_state !== undefined ? savedOptions.issuing_state : enabledDisclosures.issuing_state,
            name: savedOptions.name !== undefined ? savedOptions.name : enabledDisclosures.name,
            nationality: savedOptions.nationality !== undefined ? savedOptions.nationality : enabledDisclosures.nationality,
            date_of_birth: savedOptions.date_of_birth !== undefined ? savedOptions.date_of_birth : enabledDisclosures.date_of_birth,
            passport_number: savedOptions.passport_number !== undefined ? savedOptions.passport_number : enabledDisclosures.passport_number,
            gender: savedOptions.gender !== undefined ? savedOptions.gender : enabledDisclosures.gender,
            expiry_date: savedOptions.expiry_date !== undefined ? savedOptions.expiry_date : enabledDisclosures.expiry_date
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
        enableMockPassport()
      );

      if (minimumAge !== undefined) {
        configuredVerifier.setMinimumAge(minimumAge);
      }

      if (excludedCountryList.length > 0) {
        configuredVerifier.excludeCountries(
          ...excludedCountryList as (keyof typeof countryCodes)[]
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

        const isProofExists = await kv.hget(companyProofKey(companyId), proof);
        if (isProofExists) {
          return res.status(400).json({ message: 'User has already verified for another address' });
        }

        await kv.hset(companyProofKey(companyId), { [proof]: true });
        await kv.hset(companyUserKey(companyId), { [userId]: true });

        res.status(200).json({
          status: 'success',
          result: result.isValid,
          credentialSubject: filteredSubject,
          verificationOptions: {
            minimumAge,
            ofac: enableOfac,
            excludedCountries: excludedCountryList.map(countryName => {
              const entry = Object.entries(countryCodes).find(([_, name]) => name === countryName);
              return entry ? entry[0] : countryName;
            })
          }
        });
      } else {
        res.status(400).json({
          status: 'error',
          result: result.isValid,
          message: 'Verification failed',
          details: result
        });
      }
    } catch (error) {
      console.error('Error verifying proof:', error);
      return res.status(500).json({
        message: 'Error verifying proof',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}