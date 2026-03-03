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
        { name: t('home'), href: "/home", icon: Home, color: "from-blue-500 to-cyan-400" },
        { name: t('daily'), href: "/daily", icon: Sun, color: "from-amber-500 to-yellow-400" },
        { name: t('saju'), href: "/saju", icon: Sparkles, color: "from-indigo-500 to-purple-400" },
        { name: t('tojeong'), href: "/tojeong", icon: BookOpen, color: "from-emerald-500 to-teal-400" },
        { name: t('newYear'), href: "/new-year", icon: Calendar, color: "from-rose-500 to-pink-400" },
        { name: t('compatibility'), href: "/compatibility", icon: Heart, color: "from-pink-500 to-rose-400" },
        { name: t('pickDate'), href: "/pick-date", icon: Compass, color: "from-sky-500 to-blue-400" },
        { name: t('nameSaju'), href: "/name-saju", icon: Star, color: "from-yellow-500 to-amber-400" },
        { name: t('dream'), href: "/dream", icon: Moon, color: "from-violet-500 to-indigo-400" },
    ];

    return (
        <Sidebar collapsible="icon" className="!bg-white/60 !backdrop-blur-2xl !border-white/40">
            {/* Header: Logo 영역 */}
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-white/30 relative overflow-hidden">
                {/* 헤더 배경 미세 글로우 */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 opacity-50"></div>

                <Link href="/home" className="relative flex items-center gap-2 group overflow-hidden z-10">
                    <div className="relative w-9 h-9 shrink-0">
                        {/* 로고 아이콘 뒤 글로우 */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                        <div className="relative w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <Sparkles className="text-white w-4.5 h-4.5" />
                        </div>
                    </div>
                    <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-700 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden whitespace-nowrap tracking-tight">
                        {t('appName')}
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="relative">
                {/* 사이드바 내부 은은한 글로우 장식 */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-24 h-24 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400/80 mb-1">
                        {t('menu')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {menuItems.map((item) => {
                                const isActive = pathname?.includes(item.href);
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.name}
                                            className={`
                                                group/item relative rounded-xl transition-all duration-300 overflow-hidden
                                                ${isActive
                                                    ? "!bg-gradient-to-r !from-indigo-500/10 !to-purple-500/10 !text-indigo-700 font-semibold shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)]"
                                                    : "hover:!bg-white/60 hover:shadow-sm"
                                                }
                                            `}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3">
                                                {/* 활성 메뉴 좌측 엣지 글로우 바 */}
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                                )}
                                                <div className={`
                                                    w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300
                                                    ${isActive
                                                        ? `bg-gradient-to-br ${item.color} text-white shadow-sm`
                                                        : "bg-slate-100/80 text-slate-500 group-hover/item:bg-gradient-to-br group-hover/item:" + item.color.split(" ")[0] + " group-hover/item:text-white"
                                                    }
                                                `}>
                                                    <item.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "" : "group-hover/item:scale-110"}`} />
                                                </div>
                                                <span className={`text-[13px] tracking-tight ${isActive ? "text-indigo-800 font-semibold" : "text-slate-600 group-hover/item:text-slate-900"}`}>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400/80 mb-1">
                        {t('settings')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={t('myAccount')}
                                    className="group/item rounded-xl transition-all duration-300 hover:!bg-white/60 hover:shadow-sm"
                                >
                                    <Link href="/profile" className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover/item:bg-gradient-to-br group-hover/item:from-blue-500 group-hover/item:to-cyan-400 group-hover/item:text-white transition-all duration-300">
                                            <UserIcon className="w-4 h-4 group-hover/item:scale-110 transition-transform duration-300" />
                                        </div>
                                        <span className="text-[13px] text-slate-600 group-hover/item:text-slate-900 tracking-tight">{t('myAccount')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={t('preferences')}
                                    className="group/item rounded-xl transition-all duration-300 hover:!bg-white/60 hover:shadow-sm"
                                >
                                    <Link href="/settings" className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-slate-100/80 flex items-center justify-center text-slate-500 group-hover/item:bg-gradient-to-br group-hover/item:from-slate-500 group-hover/item:to-slate-400 group-hover/item:text-white transition-all duration-300">
                                            <Settings className="w-4 h-4 group-hover/item:scale-110 group-hover/item:rotate-45 transition-all duration-500" />
                                        </div>
                                        <span className="text-[13px] text-slate-600 group-hover/item:text-slate-900 tracking-tight">{t('preferences')}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/30 p-3 relative overflow-hidden">
                {/* 하단 부드러운 글로우 */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/40 to-transparent pointer-events-none"></div>

                {user ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="relative z-10 w-full justify-start gap-3 rounded-xl hover:!bg-white/70 hover:shadow-sm transition-all duration-300 group/footer"
                                onClick={() => signOut()}
                                tooltip={t('logout')}
                            >
                                <div className="relative w-9 h-9 shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-sm opacity-0 group-hover/footer:opacity-50 transition-opacity duration-500"></div>
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-white/50 shadow-sm group-hover/footer:scale-105 transition-transform duration-300">
                                        {user.name?.[0] || "U"}
                                    </div>
                                </div>
                                <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                                    <span className="text-sm font-semibold text-slate-800 truncate w-full tracking-tight">{user.name}님</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{t('logout')}</span>
                                </div>
                                <LogOut className="w-4 h-4 ml-auto group-data-[collapsible=icon]:hidden text-slate-400 group-hover/footer:text-rose-400 group-hover/footer:translate-x-0.5 transition-all duration-300" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <SidebarMenuButton className="relative z-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-md hover:shadow-lg transition-all duration-300 border-t border-white/20">
                        {t('login')}
                    </SidebarMenuButton>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
