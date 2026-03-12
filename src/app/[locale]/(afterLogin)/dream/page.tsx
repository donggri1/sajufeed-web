import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { DreamResult } from '@/components/features/fortune/DreamResult';
import Link from 'next/link';
import { Archive } from 'lucide-react';

export default async function DreamPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const t = await getTranslations('dream');

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{t('title')}</h1>
                <Link
                    href="/dream/archive"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors text-sm"
                >
                    <Archive className="w-4 h-4" />
                    내 꿈 보관함
                </Link>
            </div>
            <DreamResult userId={session.user.id} />
        </div>
    );
}
