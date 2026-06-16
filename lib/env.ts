function get(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  apiUrl: get("NEXT_PUBLIC_API_URL", "http://localhost:8000/"),
  appUrl: get("NEXT_PUBLIC_APP_URL", "http://localhost:5173"),
  bankAccount: get("NEXT_PUBLIC_BANK_ACCOUNT", "1234567890"),
  bankId: get("NEXT_PUBLIC_BANK_ID", "MB"),
  bankName: get("NEXT_PUBLIC_BANK_NAME", "CONG TY TNHH VET LANH"),
  adminUsers: get("ADMIN_USERS", "").split(",").filter(Boolean),
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
