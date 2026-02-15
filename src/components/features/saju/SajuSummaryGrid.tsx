"use client";

import { SajuStatCard } from "./SajuStatCard";
import { useTranslations } from 'next-intl';

export function SajuSummaryGrid() {
    const t = useTranslations('fortune');

    // 나중에 백엔드 데이터로 교체될 부분
    const stats = [
        { title: t('totalFortune'), value: "85점", description: t('totalDesc'), icon: "✨", color: "border-t-purple-500" },
        { title: t('wealthFortune'), value: t('wealthValue'), description: t('wealthDesc'), icon: "💰", color: "border-t-yellow-500" },
        { title: t('loveFortune'), value: t('loveValue'), description: t('loveDesc'), icon: "❤️", color: "border-t-pink-500" },
        { title: t('careerFortune'), value: t('careerValue'), description: t('careerDesc'), icon: "💼", color: "border-t-blue-500" },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <SajuStatCard key={stat.title} {...stat} borderColor={stat.color} />
            ))}
        </div>
    );
}