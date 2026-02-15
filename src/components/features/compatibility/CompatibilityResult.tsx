'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface CompatibilityResultProps {
    className?: string;
    userId?: string;
}

export function CompatibilityResult({ className, userId }: CompatibilityResultProps) {
    const t = useTranslations('compatibility');

    return (
        <div className={cn('p-6', className)}>
            <div className="bg-white rounded-xl border min-h-[500px] flex items-center justify-center">
                <p className="text-slate-400">{t('placeholder')}</p>
            </div>
        </div>
    );
}
