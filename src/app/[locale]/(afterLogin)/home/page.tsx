import { auth } from "@/auth";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const session = await auth(); // 세션 가져오기

    if (!session) {
        redirect("/login");
    }

    return (
        <HomeTemplate nickname={session.user?.name || "사용자"} />
    );
}