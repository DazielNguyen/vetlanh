import Image from "next/image";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { UserAvatarButton } from "./components/UserAvatarButton";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="services-area flex min-h-screen">
            {/* Ambient nature background — renders behind all glassmorphism cards */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <Image src="/images/bg3.png" alt="" fill className="object-cover" priority />
                {/* Light warm overlay: enough to keep readability, thin enough to let nature show */}
                <div className="absolute inset-0 bg-[#FEF9F2]/78" />
            </div>

            <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-col flex-1 min-w-0 relative">
                    {/* Global Top-Right Controls */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4 z-10">
                        <UserAvatarButton />
                    </div>
                    <main className="flex-1 overflow-x-hidden p-6 md:p-8 pt-6 md:pt-8 w-full max-w-screen-2xl mx-auto mt-2 lg:mt-0">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}
