import { notFound } from "next/navigation";
import CompanionPreviewClient from "./CompanionPreviewClient";

export const metadata = { robots: { index: false, follow: false } };

/** Dev-only preview route — not linked from any nav, 404s in production.
 * Cycles the companion through all 5 states so it can be reviewed before
 * app-wide wiring (Phase 3). */
export default function CompanionPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <CompanionPreviewClient />;
}
