'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DailyFortuneProps {
    className?: string;
    userId?: string;
}

export function DailyFortune({ className, userId }: DailyFortuneProps) {
    const t = useTranslations('daily');

    return (
        <div className={cn('p-6 space-y-4', className)}>
            <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-[400px] flex items-center justify-center">
                <p className="text-slate-500">{t('placeholder')}</p>
            </div>
        </div>
    );
}
