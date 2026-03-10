"use client";

import { Home, Dumbbell, MessageSquare, Users, User, PanelLeftClose, PanelLeftOpen, CalendarDays, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    { title: "Chuyên gia", url: "/services/experts", icon: Users, exact: false },
    { title: "Bài tập", url: "/services/exercises", icon: Dumbbell, exact: false },
    { title: "Lịch hẹn", url: "/services/appointments", icon: CalendarDays, exact: false },
    { title: "Tin nhắn", url: "/services/chat", icon: MessageSquare, exact: false },
    { title: "Cài đặt", url: "/services/profile", icon: Settings, exact: false },
];

function SidebarToggleButton() {
    const { toggleSidebar, open } = useSidebar();
    return (
        <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Toggle Sidebar"
        >
            {open ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
    );
}

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40 bg-[#FEF9F2] text-slate-800">
            <SidebarHeader className="p-4 flex flex-row items-center justify-between group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
                <Link href="/" className="flex items-center gap-3 overflow-hidden ml-1 group-data-[collapsible=icon]:hidden">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Image src="/images/logo.svg" alt="Vết Lành Logo" width={24} height={24} />
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="text-[1.35rem] font-dancing font-bold tracking-tight text-slate-800 truncate">Vết Lành</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">Healing & Peace</span>
                    </div>
                </Link>
                <SidebarToggleButton />
            </SidebarHeader>

            <SidebarContent className="px-3 md:px-4 mt-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:mt-4">
                <SidebarGroup className="group-data-[collapsible=icon]:p-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-4">
                            {navItems.map((item) => {
                                const isActive = item.exact ? pathname === item.url : pathname.startsWith(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={`h-12 px-4 rounded-xl text-base shadow-none hover:bg-slate-50 font-semibold transition-all group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!w-10 group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full ${isActive ? 'bg-slate-100' : ''}`}
                                        >
                                            <a href={item.url} className={`flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center ${isActive ? 'bg-slate-100' : ''}`}>
                                                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-800' : 'text-slate-500'} group-data-[collapsible=icon]:!mr-0`} />
                                                <span className={`${isActive ? 'text-slate-800' : 'text-slate-500'} group-data-[collapsible=icon]:hidden`}>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pb-4">
                <Button className="w-full bg-[#C9E9D2] hover:bg-[#C9E9D2]/90 text-slate-800 rounded-xl py-6 font-bold shadow-sm flex items-center gap-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:rounded-full overflow-hidden transition-all group-data-[collapsible=icon]:justify-center">
                    <span className="text-xl group-data-[collapsible=icon]:text-base group-data-[collapsible=icon]:!mr-0">🧘‍♀️</span>
                    <span className="group-data-[collapsible=icon]:hidden truncate">Bắt đầu thiền</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
