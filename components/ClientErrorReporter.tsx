"use client";

import { useEffect } from "react";
import { env } from "@/lib/env";

const BASE = env.apiUrl.replace(/\/$/, "");
const REPORT_URL = `${BASE}/api/v1/errors/report`;

function report(payload: { error_type: string; route: string; severity: "HIGH" | "MEDIUM" | "LOW"; description: string }) {
  fetch(REPORT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, description: payload.description.slice(0, 2000) }),
  }).catch(() => {});
}

export default function ClientErrorReporter() {
  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      report({
        error_type: "Runtime Error",
        route: window.location.pathname,
        severity: "HIGH",
        description: `${e.message} (${e.filename}:${e.lineno})`,
      });
    };

    const onUnhandled = (e: PromiseRejectionEvent) => {
      report({
        error_type: "Unhandled Rejection",
        route: window.location.pathname,
        severity: "MEDIUM",
        description: String(e.reason ?? "Unknown rejection"),
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  return null;
}
