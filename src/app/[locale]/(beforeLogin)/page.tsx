import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SajuForm from "@/app/[locale]/_component/SajuForm";
import LoginForm from "@/app/[locale]/(beforeLogin)/signup/_component/LoginForm";

export default async function BeforeLoginPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  console.log('========== (BEFORELOGIN) PAGE DEBUG ==========');
  console.log('[1] BeforeLoginPage 렌더링 시작');
  // IMPORTANT: Next.js 15+에서는 params를 await 전에 접근하면 안됨!
  
  const { locale } = await params;
  
  console.log('[2] locale (after await):', locale);
  console.log('[3] ✅ 로그인 페이지 렌더링');
  console.log('============================================\n');

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
            <Link href={`/${locale}/signup`}>회원가입 하러가기</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
