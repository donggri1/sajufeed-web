'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, BookOpen } from "lucide-react";
import { useDailyFortune } from "@/hooks/queries/useDailyFortune";
import { Skeleton } from "@/components/ui/skeleton";
import { WebtoonButton } from './WebtoonButton';

interface DailyFortuneProps {
    className?: string;
    userId?: string;
}

export function DailyFortune({ className, userId }: DailyFortuneProps) {
    const t = useTranslations('daily');
    const tDashboard = useTranslations('dashboard');
    const tFortune = useTranslations('fortune');

    // TODO: Replace with actual payment status from user profile/purchase history
    const [isPaid, setIsPaid] = useState(false);

    const { data: fortune, isLoading } = useDailyFortune();

    // Paywall placeholder overlay rendering helper
    const renderPaywall = (title: string, description: string) => (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl border border-white">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 flex flex-col items-center max-w-sm text-center transform transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    {title}
                </h3>
                <p className="text-slate-600 mb-8 whitespace-pre-wrap leading-relaxed">
                    {description}
                </p>
                <Button
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                        // TODO: Implement actual PG or point deduction logic here
                        alert("결제 연동이 준비 중입니다. 임시로 잠금을 해제합니다.");
                        setIsPaid(true);
                    }}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    프리미엄 해제하기
                </Button>
            </div>
        </div>
    );

    return (
        <div className={cn('space-y-6', className)}>
            {/* 상단: 오늘의 전체 운세 요약 (항상 보임) */}
            <div className="bg-white rounded-2xl shadow-sm border p-8">
                {isLoading ? (
                    <div className="space-y-4 py-6">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ) : fortune ? (
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 px-3 py-1">
                                {fortune.date || tDashboard('yearLabel')}
                            </Badge>
                            <h2 className="text-2xl font-bold text-slate-900">오늘의 전체 운세</h2>
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-indigo-900">{fortune.summary}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {fortune.description}
                        </p>
                    </div>
                ) : (
                    <div className="py-12 text-center text-slate-500">
                        운세 정보를 불러오지 못했습니다.
                    </div>
                )}
            </div>

            {/* 하단: 탭 영역 (상세 운세 & 웹툰) */}
            <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="bg-white border p-1 h-14 w-full justify-start overflow-x-auto rounded-xl">
                    <TabsTrigger value="details" className="px-8 py-2.5 rounded-lg text-base data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 data-[state=active]:font-semibold transition-all">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {tDashboard('tabDetails')}
                    </TabsTrigger>
                    <TabsTrigger value="webtoon" className="px-8 py-2.5 rounded-lg text-base data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:font-semibold transition-all">
                        <span className="text-base mr-2">🎨</span>
                        {tDashboard('tabWebtoon')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="relative">
                    {!isPaid && renderPaywall("프리미엄 상세 운세", "오늘의 모든 영역(재물, 애정, 직업 등)에 대한 깊이 있는 분석을 확인해보세요.\n결제 후에는 평생 소장할 수 있습니다.")}

                    <div className={cn("border rounded-2xl bg-white p-8 shadow-sm min-h-[400px] transition-all", !isPaid && "filter blur-sm select-none")}>
                        {isLoading ? (
                            <div className="space-y-4 py-12">
                                <Skeleton className="h-12 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ) : fortune?.details ? (
                            <div className="py-4 px-2 max-w-3xl mx-auto">
                                <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap space-y-1">
                                    {fortune.details}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <p className="text-slate-500">상세 분석 내용이 없습니다.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="webtoon" className="relative">
                    {!isPaid && renderPaywall("나만의 운세 웹툰", "오늘의 운세를 바탕으로 AI가 나만을 위한 특별한 4컷 웹툰을 그려드립니다.\n결제 후에는 평생 소장할 수 있습니다.")}

                    <div className={cn("border rounded-2xl bg-white p-8 shadow-sm min-h-[400px] transition-all", !isPaid && "filter blur-sm select-none pointer-events-none")}>
                        <WebtoonButton fortuneId={fortune?.id} hasDetails={!!fortune?.details} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
