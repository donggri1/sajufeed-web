'use client';

import { WebtoonResponse } from '@/types/fortune';
import { useTranslations } from 'next-intl';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebtoonViewerProps {
    webtoon: WebtoonResponse;
}

export function WebtoonViewer({ webtoon }: WebtoonViewerProps) {
    const t = useTranslations('fortune');

    const sortedPanels = [...webtoon.panels].sort((a, b) => a.pageNumber - b.pageNumber);

    return (
        <div className="space-y-6">
            {/* 제목 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">🎨</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{webtoon.title}</h3>
                        <p className="text-sm text-slate-500">
                            {t('webtoonPages', { count: sortedPanels.length })}
                        </p>
                    </div>
                </div>
            </div>

            {/* 패널 목록 */}
            <div className="space-y-4">
                {sortedPanels.map((panel) => (
                    <div key={panel.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-indigo-700">
                                {t('page')} {panel.pageNumber}
                            </span>
                        </div>
                        {/* 이미지 */}
                        <div className="p-4 flex justify-center">
                            {panel.imagePath.startsWith('data:') || panel.imagePath.startsWith('http') ? (
                                <img
                                    src={panel.imagePath}
                                    alt={panel.description || `Page ${panel.pageNumber}`}
                                    className="max-w-full rounded-lg shadow"
                                />
                            ) : (
                                <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <span className="text-slate-400">{t('imageLoading')}</span>
                                </div>
                            )}
                        </div>
                        {/* 설명 */}
                        {panel.description && (
                            <div className="px-4 pb-4">
                                <p className="text-sm text-slate-600 leading-relaxed">{panel.description}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
