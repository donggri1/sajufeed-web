import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "./_component/SignupForm";
import { getTranslations } from 'next-intl/server';

export default async function SignupPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'signup' });

    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </main>
    );
}