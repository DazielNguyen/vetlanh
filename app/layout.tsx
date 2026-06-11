import type { Metadata } from "next";
import { Manrope, Geist, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ClientErrorReporter from "@/components/ClientErrorReporter";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
});

const dancingScript = Dancing_Script({
  subsets: ["vietnamese"],
  variable: "--font-dancing",
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
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", geist.variable, dancingScript.variable)}>
      <body className={`${manrope.variable} font-sans`}>
        <Providers>
          <ClientErrorReporter />
          <TooltipProvider>
            {children}
            <Toaster position="top-right" closeButton offset={16} />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
