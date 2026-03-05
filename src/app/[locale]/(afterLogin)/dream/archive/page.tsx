'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Moon, Sparkles, Calendar } from 'lucide-react';

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

export default function DreamArchivePage() {
    const [dreams, setDreams] = useState<DreamData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDreams = async () => {
            try {
                const response = await apiClient.get('/dreams');
                setDreams(response.data);
            } catch (error) {
                console.error('꿈 기록 불러오기 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDreams();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl min-h-screen">
            <div className="flex flex-col items-center mb-12 text-center">
                <Moon className="w-12 h-12 text-indigo-500 mb-4" />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
                    Dream Archive
                </h1>
                <p className="text-slate-500 text-lg max-w-xl">
                    당신의 무의식이 남긴 신비로운 기록들. 타로카드처럼 모인 꿈의 캔버스들을 돌아보고 내면의 메시지를 확인하세요.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                        <Loader2 className="w-8 h-8 text-purple-500" />
                    </motion.div>
                </div>
            ) : dreams.length === 0 ? (
                <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-400 text-lg">아직 기록된 꿈이 없습니다. 새로운 꿈을 해석해보세요!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {dreams.map((dream, index) => (
                        <motion.div
                            key={dream.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            <div className="relative w-full aspect-[4/5] bg-slate-100">
                                {dream.imageUrl ? (
                                    <Image
                                        src={\`\${process.env.NEXT_PUBLIC_API_URL}\${dream.imageUrl}\`}
                                alt={dream.summary || 'Dream Card'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Moon className="w-8 h-8 text-slate-300" />
                                </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 right-0 p-5 text-left transition-transform duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-medium tracking-wider uppercase flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Score {dream.luckyScore}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 line-clamp-2">
                                        {dream.summary}
                                    </h3>
                                    <div className="flex items-center gap-1 text-white/60 text-xs mt-2 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(dream.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

// 임시 로더 아이콘용
function Loader2({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
