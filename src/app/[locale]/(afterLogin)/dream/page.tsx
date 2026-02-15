import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DreamResult } from '@/components/features/fortune/DreamResult';

export default async function DreamPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const t = await getTranslations('dream');

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">{t('title')}</h1>
            <DreamResult userId={session.user.id} />
        </div>
    );
}
