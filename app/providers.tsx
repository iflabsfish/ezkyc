"use client";
import { config, queryClient } from "@/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { PropsWithChildren } from "react";
import { AuthUserProvider } from "@/app/context/AuthUserContext";

export const Providers = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <AlchemyAccountProvider
      config={config}
      queryClient={queryClient}
      initialState={props.initialState}
    >
      <AuthUserProvider>{props.children}</AuthUserProvider>
    </AlchemyAccountProvider>
  );
};
