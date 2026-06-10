"use client";

import { Home, Dumbbell, MessageSquare, PanelLeftClose, PanelLeftOpen, Settings, LogOut, Brain, Wind } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
    { title: "Trang chủ", url: "/services", icon: Home, exact: true },
    { title: "Bài tập", url: "/services/exercises", icon: Dumbbell, exact: false },
    { title: "Tin nhắn", url: "/services/chat", icon: MessageSquare, exact: false },
    { title: "Suy nghĩ", url: "/services/thought-records", icon: Brain, exact: false },
    { title: "Cài đặt", url: "/services/profile", icon: Settings, exact: false },
];

function SidebarToggleButton() {
    const { toggleSidebar, open } = useSidebar();
    return (
        <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:bg-white/10 hover:text-white/60 transition-colors shrink-0"
            aria-label="Toggle Sidebar"
        >
            {open ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <Sidebar collapsible="icon" className="border-r border-white/8 text-white">


            {/* ── Header ──────────────────────────────────────── */}
            <SidebarHeader className="p-4 flex flex-row items-center justify-between group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                <Link href="/" className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-primary/25 ring-1 ring-primary/30">
                        <Image
                            src="/images/logo.svg"
                            alt="Vết Lành"
                            width={22}
                            height={22}
                            className="brightness-0 invert"
                        />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[1.3rem] font-dancing font-bold tracking-tight text-white leading-none">Vết Lành</span>
                        <span className="text-[10px] text-white/35 font-medium mt-0.5">Healing & Peace</span>
                    </div>
                </Link>
                <SidebarToggleButton />
            </SidebarHeader>

            {/* ── Nav + CTA compacted at top ───────────────────── */}
            <SidebarContent className="px-3 pt-1 group-data-[collapsible=icon]:px-0">
                <SidebarGroup className="p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-0.5">
                            {navItems.map((item) => {
                                const isActive = item.exact
                                    ? pathname === item.url
                                    : pathname.startsWith(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={[
                                                "h-10 px-3 rounded-xl font-semibold transition-all duration-200 shadow-none",
                                                "group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:w-10! group-data-[collapsible=icon]:h-10!",
                                                "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center",
                                                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full",
                                                isActive
                                                    ? "bg-primary/18 border border-primary/35 shadow-[0_2px_12px_rgba(120,157,188,0.18)]"
                                                    : "hover:bg-white/7 border border-transparent hover:border-white/10",
                                            ].join(" ")}
                                        >
                                            <a href={item.url} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                                                <div className={[
                                                    "shrink-0 w-7 h-7 rounded-xl flex items-center justify-center transition-colors",
                                                    "group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:rounded-lg",
                                                    isActive ? "bg-primary/25" : "",
                                                ].join(" ")}>
                                                    <item.icon className={`w-[16px] h-[16px] ${isActive ? "text-primary" : "text-white/40"}`} />
                                                </div>
                                                <span className={`group-data-[collapsible=icon]:hidden text-[13.5px] ${isActive ? "text-primary font-bold" : "text-white/50 font-semibold"}`}>
                                                    {item.title}
                                                </span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Meditation CTA — grouped with nav, not buried in footer */}
                <div className="pt-4 group-data-[collapsible=icon]:pt-3 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <button className={[
                        "w-full h-10 bg-linear-to-r from-primary to-[#5A8AB0] text-white rounded-xl px-4",
                        "flex items-center gap-2.5 justify-center text-[13px] font-bold",
                        "shadow-[0_4px_14px_rgba(120,157,188,0.22)] hover:shadow-[0_6px_18px_rgba(120,157,188,0.35)]",
                        "transition-all duration-200 active:scale-[0.98]",
                        "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:rounded-full",
                        "group-data-[collapsible=icon]:p-0 overflow-hidden",
                    ].join(" ")}>
                        <Wind className="w-[15px] h-[15px] shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden truncate">Bắt đầu thiền</span>
                    </button>
                </div>
            </SidebarContent>

            {/* ── Footer — logout only ─────────────────────────── */}
            <SidebarFooter className="px-4 pb-5 pt-3 border-t border-white/8 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-4">
                <button
                    onClick={logout}
                    className={[
                        "w-full h-10 rounded-xl px-3 flex items-center gap-2.5 text-[13px] font-medium",
                        "text-white/25 hover:text-red-400 hover:bg-red-500/10",
                        "transition-all duration-200",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10",
                        "group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:px-0",
                    ].join(" ")}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">Đăng xuất</span>
                </button>
            </SidebarFooter>
        </Sidebar>
    );
}
