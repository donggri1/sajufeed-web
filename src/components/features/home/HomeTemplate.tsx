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
        <div className="bg-slate-50 min-h-[calc(100vh-64px)]">
            <div className="container mx-auto max-w-7xl px-4 md:px-8 py-8">
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

                {/* 운세 탭 */}
                <Tabs defaultValue="total" className="space-y-6 mt-10">
                    <TabsList className="bg-white border p-1 h-12">
                        <TabsTrigger value="total" className="px-8 py-2">{t('tabTotal')}</TabsTrigger>
                        <TabsTrigger value="details" className="px-8 py-2">{t('tabDetails')}</TabsTrigger>
                        <TabsTrigger value="webtoon" className="px-8 py-2">{t('tabWebtoon')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="total" className="border rounded-2xl bg-white p-8 shadow-sm min-h-[400px]">
                        {isLoading ? (
                            <div className="space-y-4 py-12">
                                <Skeleton className="h-12 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mx-auto" />
                            </div>
                        ) : fortune ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-800">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-3xl">✨</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{fortune.summary}</h3>
                                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed whitespace-pre-wrap">
                                    {fortune.description}
                                </p>

                                <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-lg">
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">{tFortune('luckyColor')}</div>
                                        <div className="font-bold text-indigo-600">{fortune.luckyColor}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">{tFortune('luckyItem')}</div>
                                        <div className="font-bold text-purple-600">{fortune.luckyItem}</div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl">
                                        <div className="text-sm text-slate-500 mb-1">{tFortune('luckyDirection')}</div>
                                        <div className="font-bold text-blue-600">{fortune.luckyDirection}</div>
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
                    </TabsContent>
                    <TabsContent value="details" className="border rounded-2xl bg-white p-8 shadow-sm min-h-[400px]">
                        {isLoading ? (
                            <div className="space-y-4 py-12">
                                <Skeleton className="h-12 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mx-auto" />
                            </div>
                        ) : fortune?.details ? (
                            <div className="py-8 px-4 max-w-3xl mx-auto">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                                        <span className="text-2xl">🔮</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{t('tabDetails')}</h3>
                                        <p className="text-sm text-slate-500">{fortune.date}</p>
                                    </div>
                                </div>
                                <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap space-y-1">
                                    {fortune.details}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔮</span>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900">{t('analysisTitle')}</h3>
                                <p className="text-slate-500 mt-2 max-w-md">
                                    {t('analysisDescription', { nickname })}
                                </p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="webtoon" className="border rounded-2xl bg-white p-8 shadow-sm min-h-[400px]">
                        <WebtoonButton fortuneId={fortune?.id} hasDetails={!!fortune?.details} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
