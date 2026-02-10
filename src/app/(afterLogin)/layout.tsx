import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GlobalNavBar } from "@/components/organisms/GlobalNavBar";
import { Footer } from "@/components/organisms/Footer";

export default async function AfterLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();


    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col min-h-screen">
            <GlobalNavBar user={session.user} />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
