"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { 
    Sun, 
    Sparkles, 
    BookOpen, 
    Calendar, 
    Heart, 
    Compass, 
    Star, 
    Moon,
    LogOut,
    User as UserIcon,
    Settings,
    Home
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AppSidebar({ user }: { user?: any }) {
    const pathname = usePathname();
    
    const menuItems = [
        { name: "홈", href: "/home", icon: Home },
        { name: "오늘의 운세", href: "/daily", icon: Sun },
        { name: "사주", href: "/saju", icon: Sparkles },
        { name: "토정비결", href: "/tojeong", icon: BookOpen },
        { name: "신년운세", href: "/new-year", icon: Calendar },
        { name: "궁합", href: "/compatibility", icon: Heart },
        { name: "택일", href: "/pick-date", icon: Compass },
        { name: "이름사주", href: "/name-saju", icon: Star },
        { name: "꿈해몽", href: "/dream", icon: Moon },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 flex items-center justify-center border-b">
                <Link href="/home" className="flex items-center gap-2 group overflow-hidden">
                    <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Sparkles className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden whitespace-nowrap">
                        사주피드
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>메뉴</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={pathname === item.href}
                                        tooltip={item.name}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>설정</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="내 정보">
                                    <Link href="/myAccount" className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        <span>내 정보</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="환경설정">
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        <span>환경설정</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                {user ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                size="lg" 
                                className="w-full justify-start gap-3 hover:bg-slate-100"
                                onClick={() => signOut()}
                                tooltip="로그아웃"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                    {user.name?.[0] || "U"}
                                </div>
                                <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="text-sm font-semibold text-slate-900 truncate w-full">{user.name}님</span>
                                    <span className="text-[10px] text-slate-500">로그아웃</span>
                                </div>
                                <LogOut className="w-4 h-4 ml-auto group-data-[collapsible=icon]:hidden text-slate-400" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <SidebarMenuButton className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                        로그인
                    </SidebarMenuButton>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
