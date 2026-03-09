"use client";

import { Home, Dumbbell, MessageSquare, Users, User, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
} from "@/components/ui/sidebar";

const navItems = [
    { title: "Home", url: "/services", icon: Home },
    { title: "Exercises", url: "#", icon: Dumbbell },
    { title: "AI Chat", url: "#", icon: MessageSquare },
    { title: "Experts", url: "#", icon: Users },
    { title: "Profile", url: "#", icon: User },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-r border-border/40 bg-[#FEF9F2] text-slate-800">
            <SidebarHeader className="p-6 group-data-[collapsible=icon]:p-2">
                <Link href="/" className="flex items-center gap-3 mb-2 overflow-hidden">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-xl">V</span>
                    </div>
                    <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden">
                        <span className="text-lg font-extrabold tracking-tight text-slate-800 truncate">VẾT LÀNH</span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">Healing & Peace</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-4 group-data-[collapsible=icon]:px-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        className="py-5 px-4 rounded-xl hover:bg-slate-50 transition-colors group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
                                    >
                                        <a href={item.url} className="flex items-center gap-3 font-semibold w-full">
                                            <item.icon className="w-5 h-5 shrink-0" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
                <Button className="w-full bg-[#C9E9D2] hover:bg-[#C9E9D2]/90 text-slate-800 rounded-xl py-6 font-bold shadow-sm flex items-center gap-2 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 overflow-hidden">
                    <span className="text-xl">🧘‍♀️</span>
                    <span className="group-data-[collapsible=icon]:hidden truncate">Start Meditation</span>
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
