"use client";
import { config, queryClient } from "@/config";
import { AlchemyClientState } from "@account-kit/core";
import { AlchemyAccountProvider } from "@account-kit/react";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { cookieToInitialState } from "@account-kit/core";

export const Providers = (
  props: PropsWithChildren<{ initialState?: AlchemyClientState }>
) => {
  return (
    <AlchemyAccountProvider
      config={config}
      queryClient={queryClient}
      initialState={props.initialState}
    >
      {props.children}
    </AlchemyAccountProvider>
  );
};
