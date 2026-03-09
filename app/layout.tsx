import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5173"),
  title: {
    template: "%s | Vết Lành",
    default: "Vết Lành - Nền tảng chăm sóc sức khoẻ tinh thần",
  },
  description: "Nền tảng hỗ trợ sức khỏe tinh thần, kết nối bạn với chuyên gia và cộng đồng.",
  keywords: ["vết lành", "sức khỏe tinh thần", "tâm lý", "chữa lành"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Vết Lành - Nền tảng chăm sóc sức khoẻ tinh thần",
    description: "Nền tảng mạng xã hội kết nối và trị liệu tâm lý trực tuyến.",
    siteName: "Vết Lành",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster position="bottom-center" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
