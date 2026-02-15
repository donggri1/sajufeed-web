'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DreamResultProps {
    className?: string;
    userId?: string;
}

export function DreamResult({ className, userId }: DreamResultProps) {
    const t = useTranslations('dream');

    return (
        <div className={cn('p-6', className)}>
            <div className="bg-white rounded-xl border min-h-[500px] flex items-center justify-center">
                <p className="text-slate-400">{t('placeholder')}</p>
            </div>
        </div>
    );
}
