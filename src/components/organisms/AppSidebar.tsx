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
import { useTranslations } from 'next-intl';

export function AppSidebar({ user }: { user?: any }) {
    const pathname = usePathname();
    const t = useTranslations('nav');
    
    const menuItems = [
        { name: t('home'), href: "/home", icon: Home },
        { name: t('daily'), href: "/daily", icon: Sun },
        { name: t('saju'), href: "/saju", icon: Sparkles },
        { name: t('tojeong'), href: "/tojeong", icon: BookOpen },
        { name: t('newYear'), href: "/new-year", icon: Calendar },
        { name: t('compatibility'), href: "/compatibility", icon: Heart },
        { name: t('pickDate'), href: "/pick-date", icon: Compass },
        { name: t('nameSaju'), href: "/name-saju", icon: Star },
        { name: t('dream'), href: "/dream", icon: Moon },
    ];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="h-16 flex items-center justify-center border-b">
                <Link href="/home" className="flex items-center gap-2 group overflow-hidden">
                    <div className="w-8 h-8 shrink-0 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <Sparkles className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden whitespace-nowrap">
                        {t('appName')}
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t('menu')}</SidebarGroupLabel>
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
                    <SidebarGroupLabel>{t('settings')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip={t('myAccount')}>
                                    <Link href="/myAccount" className="flex items-center gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        <span>{t('myAccount')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip={t('preferences')}>
                                    <Link href="/settings" className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        <span>{t('preferences')}</span>
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
                                tooltip={t('logout')}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                                    {user.name?.[0] || "U"}
                                </div>
                                <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="text-sm font-semibold text-slate-900 truncate w-full">{user.name}님</span>
                                    <span className="text-[10px] text-slate-500">{t('logout')}</span>
                                </div>
                                <LogOut className="w-4 h-4 ml-auto group-data-[collapsible=icon]:hidden text-slate-400" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <SidebarMenuButton className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                        {t('login')}
                    </SidebarMenuButton>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
