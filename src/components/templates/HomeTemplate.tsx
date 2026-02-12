"use client";

import { SajuSummaryGrid } from "../organisms/SajuSummaryGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DailyFortuneButton } from "../molecules/DailyFortuneButton";
import { useTranslations } from 'next-intl';

interface HomeTemplateProps {
    nickname: string;
    children?: React.ReactNode;
}

export function HomeTemplate({ nickname }: HomeTemplateProps) {
    const t = useTranslations('dashboard');
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
                                {t('yearLabel')}
                            </Badge>
                        </div>
                        <SajuSummaryGrid />
                    </div>

                    {/* 오른쪽: 오늘의 운세 보기 버튼 카드 */}
                    <div className="lg:col-span-1 ">
                        <DailyFortuneButton />
                    </div>
                </div>

                <Tabs defaultValue="total" className="space-y-6 mt-10">
                    <TabsList className="bg-white border p-1 h-12">
                        <TabsTrigger value="total" className="px-8 py-2">{t('tabTotal')}</TabsTrigger>
                        <TabsTrigger value="period" className="px-8 py-2">{t('tabPeriod')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="total" className="border rounded-2xl bg-white p-8 shadow-sm min-h-[400px]">
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">{t('analysisTitle')}</h3>
                            <p className="text-slate-500 mt-2 max-w-md">
                                {t('analysisDescription', { nickname })}
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
