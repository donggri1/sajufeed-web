import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SajuForm from "@/app/_component/SajuForm";

export default function BeforeLoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className={"w-full max-w-md shadow-lg"}>
                <CardHeader className={"text-center"}>
                    <CardTitle className={"text-3xl font-bold text-primary"}>사주피드 🔮</CardTitle>
                    <CardDescription>
                        생년월일시를 입력하고 오늘의 운세를 확인하세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className={"space-y-4"}>
                    <SajuForm/>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-50 px-2 text-muted-foreground">또는 간단하게</span>
                        </div>
                    </div>

                    <Button variant={"outline"}
                            className={"w-full h-12 bg-[#FEE500] text-[#191919] border-none hover:bg-[#FEE500]/90 font-bold"}>
                        카카오톡으로 시작하기
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        로그인 시 과거 분석 기록 저장과 사주를 영상으로 확인할 수 있습니다.
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}