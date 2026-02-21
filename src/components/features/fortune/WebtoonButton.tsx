'use client';

import { useCreateWebtoon } from '@/hooks/mutations/useCreateWebtoon';
import { useFortuneWebtoon } from '@/hooks/queries/useFortuneWebtoon';
import { WebtoonViewer } from './WebtoonViewer';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WebtoonButtonProps {
    fortuneId: number | undefined;
    hasDetails: boolean;
}

export function WebtoonButton({ fortuneId, hasDetails }: WebtoonButtonProps) {
    const t = useTranslations('fortune');
    const createWebtoon = useCreateWebtoon();
    const { data: webtoon, isLoading: isLoadingWebtoon } = useFortuneWebtoon(fortuneId);

    const handleCreate = () => {
        if (!fortuneId) return;
        createWebtoon.mutate(fortuneId);
    };

    // 로딩 중
    if (isLoadingWebtoon) {
        return (
            <div className="space-y-4 py-8">
                <Skeleton className="h-12 w-3/4 mx-auto" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    // 웹툰이 이미 있으면 뷰어 표시
    if (webtoon && webtoon.status === 'completed') {
        return <WebtoonViewer webtoon={webtoon} />;
    }

    // 생성 중 (폴링으로 상태 감지)
    if ((webtoon && (webtoon.status === 'generating' || webtoon.status === 'pending')) || createWebtoon.isPending) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">{t('webtoonGenerating')}</h3>
                <p className="text-slate-500 mt-2 text-sm">{t('webtoonGeneratingDesc')}</p>
                <p className="text-xs text-slate-400 mt-4">자동으로 확인 중...</p>
            </div>
        );
    }

    // 실패
    if (webtoon && webtoon.status === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-4">😢</span>
                <h3 className="text-lg font-semibold text-slate-900">{t('webtoonFailed')}</h3>
                <Button
                    onClick={handleCreate}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                    {t('webtoonRetry')}
                </Button>
            </div>
        );
    }

    // 아직 웹툰이 없으면 생성 버튼 표시
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t('webtoonTitle')}</h3>
            <p className="text-slate-500 mt-2 max-w-md text-sm">
                {t('webtoonDescription')}
            </p>
            <Button
                onClick={handleCreate}
                disabled={!hasDetails || createWebtoon.isPending}
                className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg"
            >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('webtoonCreate')}
            </Button>
            {!hasDetails && (
                <p className="text-xs text-orange-500 mt-3">{t('webtoonNeedDetails')}</p>
            )}
        </div>
    );
}
