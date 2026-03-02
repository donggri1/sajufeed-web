"use client";

import { SajuSummaryGrid } from "@/components/features/saju/SajuSummaryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DailyFortuneButton } from "@/components/features/fortune/DailyFortuneButton";
import { WebtoonButton } from "@/components/features/fortune/WebtoonButton";
import { useTranslations } from 'next-intl';
import { useDailyFortune } from "@/hooks/queries/useDailyFortune";
import { Skeleton } from "@/components/ui/skeleton";
import { WelcomeState } from "./WelcomeState";

interface HomeTemplateProps {
    nickname: string;
    children?: React.ReactNode;
}

export function HomeTemplate({ nickname }: HomeTemplateProps) {
    const t = useTranslations('dashboard');
    const tFortune = useTranslations('fortune');
    const { data: fortune, isLoading } = useDailyFortune();

    return (
        <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
            {/* 전역 배경 오로라 이펙트 (Glow Blobs) */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-300/20 rounded-full blur-[100px] mix-blend-multiply opacity-50 animate-blob animation-delay-4000"></div>

            <div className="container relative z-0 mx-auto max-w-7xl px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* 왼쪽: 인사말 및 요약 그리드 */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                                    {t('yearFortune', { nickname })}
                                </h2>
                                <p className="text-slate-500 mt-1">{t('todayEnergy')}</p>
                            </div>
                            <Badge variant="secondary" className="w-fit text-sm px-4 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-100">
                                {fortune?.date || t('yearLabel')}
                            </Badge>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-32 rounded-xl" />
                                ))}
                            </div>
                        ) : fortune ? (
                            <SajuSummaryGrid data={fortune} />
                        ) : (
                            <WelcomeState nickname={nickname} />
                        )}
                    </div>

                    {/* 오른쪽: 오늘의 운세 보기 버튼 카드 */}
                    <div className="lg:col-span-1 ">
                        <DailyFortuneButton />
                    </div>
                </div>

                {/* 오늘의 운세 요약부 */}
                <div className="border border-white/60 rounded-3xl bg-white/40 backdrop-blur-xl p-8 md:p-12 shadow-[0_8px_32px_rgba(99,102,241,0.05)] min-h-[400px] relative overflow-hidden group/detail">
                    {/* 카드 내부 우측 하단 장식용 글로우 */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover/detail:bg-indigo-500/10 transition-colors duration-1000"></div>

                    {isLoading ? (
                        <div className="space-y-4 py-12">
                            <Skeleton className="h-12 w-3/4 mx-auto bg-white/50" />
                            <Skeleton className="h-4 w-full bg-white/50" />
                            <Skeleton className="h-4 w-full bg-white/50" />
                            <Skeleton className="h-4 w-2/3 mx-auto bg-white/50" />
                        </div>
                    ) : fortune ? (
                        <div className="relative z-10 flex flex-col items-center justify-center py-8 text-center text-slate-800">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-100 border border-white rounded-3xl rotate-3 shadow-sm flex items-center justify-center group-hover/detail:rotate-6 transition-transform duration-500">
                                    <span className="text-4xl drop-shadow-sm">✨</span>
                                </div>
                            </div>

                            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-800">
                                "{fortune.summary}"
                            </h3>
                            <p className="text-lg text-slate-600 max-w-3xl leading-loose whitespace-pre-wrap font-medium bg-white/40 p-6 rounded-2xl border border-white/50">
                                {fortune.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-3xl">
                                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm hover:-translate-y-1 transition-transform duration-300">
                                    <div className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{tFortune('luckyColor')}</div>
                                    <Badge variant="outline" className="text-base font-bold text-indigo-600 bg-indigo-50/50 border-indigo-200 px-4 py-1.5 h-auto whitespace-normal text-center leading-relaxed">{fortune.luckyColor}</Badge>
                                </div>
                                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm hover:-translate-y-1 transition-transform duration-300 delay-75">
                                    <div className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{tFortune('luckyItem')}</div>
                                    <Badge variant="outline" className="text-base font-bold text-purple-600 bg-purple-50/50 border-purple-200 px-4 py-1.5 h-auto whitespace-normal text-center leading-relaxed">{fortune.luckyItem}</Badge>
                                </div>
                                <div className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm hover:-translate-y-1 transition-transform duration-300 delay-150">
                                    <div className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">{tFortune('luckyDirection')}</div>
                                    <Badge variant="outline" className="text-base font-bold text-blue-600 bg-blue-50/50 border-blue-200 px-4 py-1.5 h-auto whitespace-normal text-center leading-relaxed">{fortune.luckyDirection}</Badge>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">{t('analysisTitle')}</h3>
                            <p className="text-slate-500 mt-2 max-w-md">
                                {t('analysisDescription', { nickname })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
