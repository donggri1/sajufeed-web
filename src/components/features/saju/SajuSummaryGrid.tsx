"use client";

import { SajuStatCard } from "./SajuStatCard";
import { useTranslations } from 'next-intl';
import { DailyFortuneResponse } from "@/types/fortune";

interface SajuSummaryGridProps {
    data?: DailyFortuneResponse;
}

export function SajuSummaryGrid({ data }: SajuSummaryGridProps) {
    const t = useTranslations('fortune');

    if (!data) {
        return null;
    }

    const stats = [
        {
            title: t('totalFortune'),
            value: `${data.totalScore}점`,
            description: data.summary,
            icon: "✨",
            color: "border-t-purple-500"
        },
        {
            title: t('wealthFortune'),
            value: `${data.wealthScore}점`,
            description: t('wealthDesc'),
            icon: "💰",
            color: "border-t-yellow-500"
        },
        {
            title: t('loveFortune'),
            value: `${data.loveScore}점`,
            description: t('loveDesc'),
            icon: "❤️",
            color: "border-t-pink-500"
        },
        {
            title: t('wishFortune'),
            value: `${data.wishScore}점`,
            description: t('wishDesc'),
            icon: "🙏",
            color: "border-t-blue-500"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <SajuStatCard key={stat.title} {...stat} borderColor={stat.color} />
            ))}
        </div>
    );
}