'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useNewYearFortune, useCreateNewYearFortune } from '@/hooks/queries/useNewYearFortune';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Coins, Heart, Activity, Briefcase, AlertCircle, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NewYearResultProps {
    className?: string;
    userId?: string;
}

export function NewYearResult({ className, userId }: NewYearResultProps) {
    const t = useTranslations('newYear');
    const targetYear = new Date().getFullYear().toString();

    const { data: fortune, isLoading } = useNewYearFortune(targetYear);
    const mutation = useCreateNewYearFortune();

    const handleCreate = () => {
        mutation.mutate(targetYear);
    };

    if (isLoading) {
        return (
            <div className={cn("bg-white rounded-xl border p-12 flex flex-col items-center justify-center space-y-4", className)}>
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                <p className="text-slate-500">{t('loading', { fallback: '신년운세를 불러오는 중입니다...' })}</p>
            </div>
        );
    }

    if (!fortune && !mutation.isPending) {
        return (
            <div className={cn("bg-white rounded-xl border p-12 flex flex-col items-center justify-center space-y-6 text-center", className)}>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-indigo-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{targetYear}년 신년운세</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        올 한 해의 흐름을 미리 살펴보고 대비하세요.
                        재물, 애정, 직업, 건강 운세를 포함한 종합적인 가이드를 제공합니다.
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="h-14 px-8 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('generateData', { fallback: '올해의 운세 분석하기' })}
                </Button>
            </div>
        );
    }

    if (mutation.isPending) {
        return (
            <div className={cn("bg-white rounded-xl border p-12 flex flex-col items-center justify-center space-y-6 text-center", className)}>
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping"></div>
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center z-10 animate-pulse">
                        <Sparkles className="w-10 h-10 text-indigo-600 animate-spin-slow" />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">사주 데이터를 분석 중입니다...</h3>
                    <p className="text-slate-500 px-8">
                        AI가 사주팔자와 명리학적 패턴을 조합하여<br /> {targetYear}년의 상세한 운의 흐름을 계산하고 있습니다.
                    </p>
                </div>
            </div>
        );
    }

    if (!fortune) return null;

    return (
        <div className={cn("space-y-8", className)}>
            {/* 1. 총운 헤더 */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <Badge variant="secondary" className="bg-white/20 text-white border-none backdrop-blur-sm">
                            {targetYear}년 총운
                        </Badge>
                        <div className="flex space-x-2">
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full"><span className="text-indigo-200">컬러:</span> {fortune.luckyColor}</span>
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full"><span className="text-indigo-200">아이템:</span> {fortune.luckyItem}</span>
                            <span className="text-sm bg-white/10 px-3 py-1 rounded-full"><span className="text-indigo-200">방향:</span> {fortune.luckyDirection}</span>
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                        "{fortune.summary}"
                    </h2>
                    <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
                        {fortune.description}
                    </p>
                </div>
            </div>

            {/* 2. 개별 운세 스코어 카드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard title="재물운" score={fortune.wealthScore} icon={<Coins className="w-6 h-6 text-yellow-500" />} colorClass="bg-yellow-50 border-yellow-100" />
                <ScoreCard title="애정운" score={fortune.loveScore} icon={<Heart className="w-6 h-6 text-pink-500" />} colorClass="bg-pink-50 border-pink-100" />
                <ScoreCard title="직업운" score={fortune.careerScore} icon={<Briefcase className="w-6 h-6 text-blue-500" />} colorClass="bg-blue-50 border-blue-100" />
                <ScoreCard title="건강운" score={fortune.healthScore} icon={<Activity className="w-6 h-6 text-emerald-500" />} colorClass="bg-emerald-50 border-emerald-100" />
            </div>

            {/* 3. 상세 마크다운 렌더링 영역 */}
            <div className="bg-white rounded-3xl border shadow-sm p-8 md:p-10">
                <div className="flex items-center space-x-3 mb-8 pb-4 border-b">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                    <h3 className="text-2xl font-bold text-slate-800">상세 흐름 분석</h3>
                </div>

                {fortune.details ? (
                    <div className="prose prose-indigo max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-h3:text-xl prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                        <ReactMarkdown>
                            {fortune.details}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl">
                        상세 분석 데이터가 제공되지 않았습니다.
                    </div>
                )}
            </div>
        </div>
    );
}

// 스코어 카드 컴포넌트
function ScoreCard({ title, score, icon, colorClass }: { title: string, score: number, icon: React.ReactNode, colorClass: string }) {
    return (
        <div className={cn("p-5 rounded-2xl border flex flex-col items-center justify-center text-center space-y-3", colorClass)}>
            <div className="bg-white p-3 rounded-full shadow-sm">
                {icon}
            </div>
            <div>
                <div className="text-sm font-medium text-slate-600">{title}</div>
                <div className="text-2xl font-bold text-slate-800">{score}점</div>
            </div>
        </div>
    )
}
