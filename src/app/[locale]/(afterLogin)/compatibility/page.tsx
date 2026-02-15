import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CompatibilityResult } from '@/components/features/compatibility/CompatibilityResult';

export default async function CompatibilityPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const t = await getTranslations('compatibility');

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">{t('title')}</h1>
            <CompatibilityResult userId={session.user.id} />
        </div>
    );
}
