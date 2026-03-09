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
        <Sidebar className="border-r border-border/40 bg-background text-slate-800">
            <SidebarHeader className="p-6">
                <Link href="/" className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-xl">V</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-extrabold tracking-tight text-slate-800">VẾT LÀNH</span>
                        <span className="text-[10px] text-slate-400 font-medium">Healing & Peace</span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        className="py-5 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <a href={item.url} className="flex items-center gap-3 font-semibold">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-6">
                <Button className="w-full bg-secondary/80 hover:bg-secondary text-slate-800 rounded-xl py-6 font-bold shadow-sm flex items-center gap-2">
                    <span className="text-xl">🧘‍♀️</span>
                    Start Meditation
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
