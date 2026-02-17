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
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm border-dashed border-2">
                <div className="mb-6 relative">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 animate-pulse">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    {/* 장식용 작은 별들 */}
                    <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce delay-100">✦</div>
                    <div className="absolute top-10 -left-4 text-pink-400 animate-bounce delay-300">✦</div>
                    <div className="absolute -bottom-1 -right-4 text-blue-400 animate-bounce delay-700">✦</div>
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
