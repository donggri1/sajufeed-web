import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";


interface MenuItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

interface MobileSideBarProps {
    menuItems: MenuItem[];
    user?: User | any;
}
export function MobileSideBar({ menuItems, user }: MobileSideBarProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden text-slate-600">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        사주피드
                    </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col gap-2 mt-8 flex-1">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href} 
                            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-slate-100 text-slate-600 hover:text-indigo-600 font-medium"
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto border-t pt-4">
                    {user ? (
                        <div className="space-y-4">
                            <div className="px-4">
                                <p className="text-sm font-semibold text-slate-900">{user.nickname}님</p>
                                <p className="text-xs text-slate-500">반가워요!</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                className="w-full justify-start gap-4 text-red-500 hover:text-red-600 hover:bg-red-50" 
                                onClick={() => signOut()}
                            >
                                <LogOut className="w-5 h-5" />
                                로그아웃
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full bg-indigo-600">로그인</Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}