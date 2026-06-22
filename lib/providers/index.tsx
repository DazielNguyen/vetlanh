"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ReduxProvider } from "./reduxProvider";
import { QueryProvider } from "./queryProvider";
import { SignalRProvider } from "./signalRProvider";
import { useAuthSyncAcrossTabs } from "@/hooks/useAuthSyncAcrossTabs";

// Sync logout giữa các tabs
function AuthSyncProvider({ children }: { children: ReactNode }) {
  useAuthSyncAcrossTabs();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ReduxProvider>
        <QueryProvider>
          <SignalRProvider>
            <AuthSyncProvider>{children}</AuthSyncProvider>
          </SignalRProvider>
        </QueryProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
}
