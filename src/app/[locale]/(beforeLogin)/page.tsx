import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SajuForm from "@/app/[locale]/_component/SajuForm";
import LoginForm from "@/app/[locale]/(beforeLogin)/signup/_component/LoginForm";
import { getTranslations } from 'next-intl/server';

export default async function BeforeLoginPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Server Component에서 번역 사용
  // IMPORTANT: getTranslations에도 locale을 명시적으로 전달해야 함!
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SajuForm />
          <LoginForm/>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">{t('newUser')}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href={`/${locale}/signup`}>{t('goToSignup')}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
