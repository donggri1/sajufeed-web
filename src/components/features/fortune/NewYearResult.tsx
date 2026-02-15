'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface NewYearResultProps {
    className?: string;
    userId?: string;
}

export function NewYearResult({ className, userId }: NewYearResultProps) {
    const t = useTranslations('newYear');

    return (
        <div className={cn('p-6', className)}>
            <div className="bg-white rounded-xl border min-h-[500px] flex items-center justify-center">
                <p className="text-slate-400">{t('placeholder')}</p>
            </div>
        </div>
    );
}
