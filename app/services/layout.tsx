import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { UserAvatarButton } from "./components/UserAvatarButton";
import { ServiceTour } from "./components/ServiceTour";

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="services-area relative flex min-h-screen overflow-x-clip bg-[#fff9ef] dark:bg-[#0b0f0d]">
      {/* Warm ambient world shared with the landing page. */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#fff9ef] via-[#fff2dc] to-[#ffe0b8] dark:from-[#0b0f0d] dark:via-[#101713] dark:to-[#0b0f0d]" />
        <div className="absolute -right-28 -top-32 h-[30rem] w-[30rem] rounded-full bg-illustration-sun-yellow/24 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute -bottom-40 left-[18%] h-[34rem] w-[34rem] rounded-full bg-illustration-mint/18 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute right-[12%] top-[42%] h-52 w-52 rounded-full bg-illustration-coral/10 blur-3xl dark:bg-transparent" />
      </div>

      <SidebarProvider>
        <ServiceTour />
        <AppSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="absolute right-5 top-5 z-10 flex items-center gap-4 md:right-8 md:top-7">
            <UserAvatarButton />
          </div>
          <main
            className="mx-auto mt-2 w-full max-w-[90rem] flex-1 overflow-x-hidden px-5 pb-10 pt-20 sm:px-7 md:px-10 md:pb-14 md:pt-10 lg:mt-0"
            data-tour="dashboard"
          >
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
