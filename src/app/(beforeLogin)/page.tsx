import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SajuForm from "@/app/_component/SajuForm";

export default function BeforeLoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-primary">사주피드 🔮</CardTitle>
                    <CardDescription>
                        생년월일시를 입력하고 오늘의 운세를 확인하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <SajuForm/>

                </CardContent>
            </Card>
        </main>
    );
}