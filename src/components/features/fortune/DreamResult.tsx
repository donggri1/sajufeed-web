'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import apiClient from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Loader2, Download } from 'lucide-react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

interface DreamResultProps {
    className?: string;
    userId?: string;
}

interface DreamData {
    id: number;
    content: string;
    summary: string;
    interpretation: string;
    luckyScore: number;
    actionableAdvice: string;
    luckyColor: string;
    luckyItem: string;
    imageUrl?: string;
    createdAt: string;
}

export function DreamResult({ className, userId }: DreamResultProps) {
    const t = useTranslations('dream');
    const [dreamInput, setDreamInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<DreamData | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!resultRef.current) return;
        try {
            const canvas = await html2canvas(resultRef.current, { backgroundColor: '#0f172a', scale: 2 });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'my-dream-card.png';
            link.click();
        } catch (err) {
            console.error('이미지 저장 실패:', err);
            alert('이미지를 저장하는 데 실패했습니다.');
        }
    };

    const handleSubmit = async () => {
        if (!dreamInput.trim()) return;

        setIsLoading(true);
        try {
            const response = await apiClient.post('/dreams', {
                content: dreamInput,
            });
            setResult(response.data);

            // 사운드스케이프 (Phase 3 엣지 반영 - 백그라운드 효과음)
            try {
                const audio = new Audio('/sounds/magical-chime.mp3');
                // 실제 에셋이 없다면 에러 콘솔에만 찍히므로 try-catch
                audio.volume = 0.5;
                audio.play();
            } catch (e) {
                console.log('Audio play failed', e);
            }
        } catch (error) {
            console.error('꿈 해몽 요청 실패:', error);
            alert('꿈 해몽 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn('w-full max-w-4xl mx-auto', className)}>
            <AnimatePresence mode="wait">
                {/* 1단계: 입력 폼 또는 로딩 중 */}
                {!result && (
                    <motion.div
                        key="input-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl min-h-[500px] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-white/10 shadow-2xl"
                    >
                        {/* 은은한 배경 오로라/별빛 이펙트 (CSS 블러) */}
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

                        {isLoading ? (
                            <div className="z-10 flex flex-col items-center text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    className="mb-8"
                                >
                                    <Moon className="w-16 h-16 text-purple-300 opacity-80" />
                                </motion.div>
                                <p className="text-xl md:text-2xl text-purple-200 font-light tracking-wide animate-pulse">
                                    {t('loading')}
                                </p>
                            </div>
                        ) : (
                            <div className="z-10 w-full max-w-2xl flex flex-col items-center">
                                <div className="mb-6 flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    <h2 className="text-2xl font-semibold text-white tracking-wide">{t('description')}</h2>
                                </div>
                                <textarea
                                    value={dreamInput}
                                    onChange={(e) => setDreamInput(e.target.value)}
                                    placeholder={t('placeholder')}
                                    className="w-full h-48 p-6 rounded-2xl bg-white/5 border border-white/20 text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none backdrop-blur-md transition-all"
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={!dreamInput.trim()}
                                    className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                                >
                                    {t('submit')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* 2단계: 결과 화면 */}
                {result && (
                    <motion.div
                        ref={resultRef}
                        key="result-view"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-4 bg-slate-900/50 rounded-3xl"
                    >
                        {/* 왼쪽: AI 생성 아트워크 (초현실적 3D 캔버스) */}
                        <div className="relative group w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 backdrop-blur-sm">
                            {result.imageUrl ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_API_URL}${result.imageUrl}`}
                                    alt="Dream Artwork"
                                    fill
                                    className="object-cover transition-transform duration-[10s] group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                    <Moon className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-24 text-white">
                                <h3 className="text-2xl font-bold mb-2">{result.summary}</h3>
                                <div className="flex items-center gap-2 text-sm text-purple-200">
                                    <Sparkles className="w-4 h-4" /> Surreal 3D Dream Canvas
                                </div>
                            </div>
                        </div>

                        {/* 오른쪽: 상세 해몽 정보 */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h4 className="text-sm font-semibold text-purple-600 mb-4">{t('lucky_score')}</h4>
                                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${result.luckyScore}%` }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                                        className={cn(
                                            "h-full rounded-full bg-gradient-to-r",
                                            result.luckyScore > 75 ? "from-purple-500 to-indigo-500" :
                                                result.luckyScore > 40 ? "from-emerald-400 to-teal-500" : "from-rose-400 to-orange-400"
                                        )}
                                    />
                                </div>
                                <div className="mt-2 text-right text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                    {result.luckyScore} <span className="text-sm text-slate-400 font-normal">/ 100</span>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                                    <Moon className="w-5 h-5 text-indigo-500" /> {t('result_title')}
                                </h4>
                                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                                    {result.interpretation}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                                    <span className="block text-sm font-semibold text-purple-600 mb-1">{t('lucky_color')}</span>
                                    <span className="text-lg font-bold text-slate-800">{result.luckyColor}</span>
                                </div>
                                <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
                                    <span className="block text-sm font-semibold text-indigo-600 mb-1">{t('lucky_item')}</span>
                                    <span className="text-lg font-bold text-slate-800">{result.luckyItem}</span>
                                </div>
                            </div>

                            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                                <h4 className="text-sm font-semibold text-rose-600 mb-2">{t('actionable_advice')}</h4>
                                <p className="text-slate-700 font-medium">
                                    {result.actionableAdvice}
                                </p>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                            >
                                <Download className="w-5 h-5" /> {t('buy_dream')} (이미지 저장)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
