import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function AfterLoginLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const session = await auth();

    if (!session) {
        redirect(`/${locale}`);
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar user={session.user} />
                <SidebarInset className="flex flex-col min-h-screen">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                    </header>
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                    <Footer />
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
