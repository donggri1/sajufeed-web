import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SajuForm from "@/app/_component/SajuForm";
import LoginForm from "@/app/(beforeLogin)/signup/_component/LoginForm";

export default function BeforeLoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">사주피드 🔮</CardTitle>
                    <CardDescription>생년월일시를 입력하고 오늘의 운세를 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SajuForm />
                    <LoginForm/>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">처음이신가요?</span>
                        </div>
                    </div>



                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/signup">회원가입 하러가기</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}