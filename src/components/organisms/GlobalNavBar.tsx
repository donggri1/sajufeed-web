"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "next-auth";
import { 
    Search, 
    Bell, 
    Menu, 
    LogOut, 
    User as UserIcon, 
    Settings,
    Star,
    Sparkles,
    Moon,
    Sun,
    Calendar,
    Heart,
    Compass,
    BookOpen
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MobileSideBar } from "./MobileSideBar";

interface GlobalNavBarProps {
    user?: User | any;
}

export function GlobalNavBar({ user }: GlobalNavBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuItems = [
        { name: "오늘의 운세", href: "/daily", icon: <Sun className="w-4 h-4" /> },
        { name: "사주", href: "/saju", icon: <Sparkles className="w-4 h-4" /> },
        { name: "토정비결", href: "/tojeong", icon: <BookOpen className="w-4 h-4" /> },
        { name: "신년운세", href: "/new-year", icon: <Calendar className="w-4 h-4" /> },
        { name: "궁합", href: "/compatibility", icon: <Heart className="w-4 h-4" /> },
        { name: "택일", href: "/pick-date", icon: <Compass className="w-4 h-4" /> },
        { name: "이름사주", href: "/name-saju", icon: <Star className="w-4 h-4" /> },
        { name: "꿈해몽", href: "/dream", icon: <Moon className="w-4 h-4" /> },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8 mx-auto max-w-7xl">
                {/* 로고 영역 */}
                <div className="flex items-center gap-8">
                    <Link href="/home" className="flex items-center space-x-2 shrink-0 group">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                            <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                            SAJUFEED
                        </span>
                    </Link>

                    {/* 데스크톱 메뉴 */}
                    <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
                        {menuItems.map((item) => (
                            <Link 
                                key={item.href} 
                                href={item.href} 
                                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600 hover:text-indigo-600 whitespace-nowrap"
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* 우측 액션 영역 */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* 알림 버튼 */}
                    <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-indigo-600">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>

                    <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end mr-1">
                                <span className="text-sm font-semibold text-slate-900 leading-none">{user.nickname}님</span>
                            </div>
                            
                            {/* 사용자 프로필 (shadcn Avatar 대용) */}
                            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer hover:ring-2 ring-indigo-100 transition-all">
                                {user.name?.[0] || "U"}
                            </div>

                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-600" onClick={() => signOut({callbackUrl: "/"})}>
                                <LogOut className="w-5 h-5"  /> 
                            </Button>
                        </div>
                    ) : (
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
                            로그인
                        </Button>
                    )}

                    <MobileSideBar menuItems={menuItems} user={user} />
                </div>
            </div>
        </header>
    );
}
