import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

// Get required API keys
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!ALCHEMY_API_KEY) {
  throw new Error("NEXT_PUBLIC_ALCHEMY_API_KEY not set");
}

if (!WALLET_CONNECT_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID not set");
}

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" }],
      [{ type: "social", authProviderId: "google", mode: "popup" }],
      [
        {
          type: "external_wallets",
          walletConnect: { projectId: WALLET_CONNECT_PROJECT_ID },
        },
      ],
    ],
    addPasskeyOnSignup: false,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: ALCHEMY_API_KEY }),
    chain: sepolia,
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // Enable cookieStorage to persist login state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
    sessionConfig: {
      // Configure session timeout (optional)
      expirationTimeMs: 60 * 60 * 1000, // 1 hour, default is 15 minutes
    },
  },
  uiConfig
);

export const queryClient = new QueryClient();
