import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
                    <Button className="w-full h-12 text-lg font-semibold" variant="default">
                        무료 사주 분석 시작
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-12" shadow-sm>
                        카카오톡으로 로그인
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}