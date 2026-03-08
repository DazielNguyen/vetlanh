"use client";

import { ReactNode } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import { useSignalRNotifications } from "@/hooks/useSignalRNotifications";

/**
 * Auto-connects SignalR WebSocket khi app load.
 * Đặt cao trong cây component để giữ 1 connection duy nhất.
 */
export function SignalRProvider({ children }: { children: ReactNode }) {
  useSignalR();
  useSignalRNotifications();
  return <>{children}</>;
}
