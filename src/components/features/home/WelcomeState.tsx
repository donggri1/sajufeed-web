'use client';

import { useTranslations } from 'next-intl';
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface WelcomeStateProps {
    nickname: string;
}

export function WelcomeState({ nickname }: WelcomeStateProps) {
    const t = useTranslations('fortune');

    return (
        <div>
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(99,102,241,0.05)] overflow-hidden relative group">
                {/* 배경 글로우 장식 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="mb-8 relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full flex items-center justify-center text-indigo-500 shadow-sm border border-white/50 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles className="w-12 h-12" />
                        </div>
                    </div>
                    {/* 장식용 작은 별들 */}
                    <div className="absolute -top-4 -right-4 text-yellow-500/80 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '2s' }}>✦</div>
                    <div className="absolute top-12 -left-6 text-pink-500/80 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '2.5s' }}>✦</div>
                    <div className="absolute -bottom-2 -right-6 text-blue-500/80 animate-bounce" style={{ animationDelay: '700ms', animationDuration: '3s' }}>✦</div>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    {t('welcomeTitle', { nickname })}
                </h3>

                <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
                    {t('welcomeMessage')}
                </p>

                <div className="flex flex-col items-center gap-2 text-sm text-indigo-600 font-medium animate-bounce">
                    <span>👇 {t('clickButton')}</span>
                </div>
            </Card>
        </div>
    );
}
