// NEXT_PUBLIC_* vars must be accessed with a static literal (process.env.NEXT_PUBLIC_FOO),
// not dynamically (process.env[name]). Next.js replaces static references at build time;
// dynamic access resolves to undefined in the browser bundle.
export const env = {
  apiUrl:     process.env.NEXT_PUBLIC_API_URL      || "http://localhost:8000/",
  appUrl:     process.env.NEXT_PUBLIC_APP_URL      || "http://localhost:5173",
  bankAccount:process.env.NEXT_PUBLIC_BANK_ACCOUNT || "1234567890",
  bankId:     process.env.NEXT_PUBLIC_BANK_ID      || "MB",
  bankName:   process.env.NEXT_PUBLIC_BANK_NAME    || "CONG TY TNHH VET LANH",
  adminUsers: (process.env.ADMIN_USERS || "").split(",").filter(Boolean),
  // Kill switch for the companion mascot (dashboard + chat mounts). Defaults
  // to enabled; set NEXT_PUBLIC_ENABLE_COMPANION=false to disable app-wide.
  enableCompanion: process.env.NEXT_PUBLIC_ENABLE_COMPANION !== "false",
  isDev:  process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
