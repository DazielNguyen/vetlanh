import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1 mx-auto max-w-screen-2xl min-h-screen bg-[#FEF9F2] w-full relative">
                {/* Global Top-Right Controls */}
                <div className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-4 z-10">
                    <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                    </div>
                    <img src="/images/placeholder-user.jpg" className="w-10 h-10 rounded-full border border-slate-200" alt="Avatar User" />
                </div>
                <main className="flex-1 overflow-x-hidden p-6 md:p-8 pt-6 md:pt-8 w-full mt-2 lg:mt-0">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
