'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import apiClient from '@/lib/api/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sparkles, Calendar, X, ChevronLeft, ChevronRight, Download, ZoomIn } from 'lucide-react';
import Matter from 'matter-js';

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

// 성단(Constellation) 타입: 특정 월의 꿈들을 하나로 묶은 구슬
interface ConstellationData {
    type: 'constellation';
    key: string;            // "2025-12" 형태
    label: string;          // "2025년 12월의 무의식"
    dreams: DreamData[];
    avgScore: number;
    count: number;
}

// 개별 구슬 또는 성단 구슬
type BubbleItem = (DreamData & { type: 'dream' }) | ConstellationData;

const MAX_INDIVIDUAL_BUBBLES = 20; // 개별 구슬로 표시할 최대 개수 (최신 N개)

export default function DreamArchivePage() {
    const [allDreams, setAllDreams] = useState<DreamData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);
    const [constellationModal, setConstellationModal] = useState<ConstellationData | null>(null);
    const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

    // 타임라인 필터 상태
    const [activeFilter, setActiveFilter] = useState<string>('latest'); // 'latest' | '2025-12' 등
    const [isTransitioning, setIsTransitioning] = useState(false);

    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const bodiesRef = useRef<Matter.Body[]>([]);
    const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
    const animFrameRef = useRef<number>(0);
    const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

    useEffect(() => {
        const fetchDreams = async () => {
            try {
                const response = await apiClient.get('/dreams');
                setAllDreams(response.data);
            } catch (error) {
                console.error('꿈 기록 불러오기 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDreams();
    }, []);

    // 사용 가능한 월별 키 목록 생성 (타임라인 네비게이터용)
    const availableMonths = useMemo(() => {
        const monthSet = new Set<string>();
        allDreams.forEach(d => {
            const date = new Date(d.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthSet.add(key);
        });
        return Array.from(monthSet).sort().reverse(); // 최신순
    }, [allDreams]);

    // 현재 필터에 따라 화면에 표시할 버블 아이템 목록 계산
    const bubbleItems: BubbleItem[] = useMemo(() => {
        if (allDreams.length === 0) return [];

        if (activeFilter === 'latest') {
            // "최신" 모드: 최근 MAX_INDIVIDUAL_BUBBLES개는 개별 구슬, 나머지는 월별 성단으로 묶기
            const recentDreams = allDreams.slice(0, MAX_INDIVIDUAL_BUBBLES);
            const olderDreams = allDreams.slice(MAX_INDIVIDUAL_BUBBLES);

            const items: BubbleItem[] = recentDreams.map(d => ({ ...d, type: 'dream' as const }));

            // 오래된 꿈들을 월별로 그룹핑하여 성단 생성
            const monthGroups: Record<string, DreamData[]> = {};
            olderDreams.forEach(d => {
                const date = new Date(d.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthGroups[key]) monthGroups[key] = [];
                monthGroups[key].push(d);
            });

            Object.entries(monthGroups).forEach(([key, dreams]) => {
                const [y, m] = key.split('-');
                items.push({
                    type: 'constellation',
                    key,
                    label: `${y}년 ${parseInt(m)}월의 기억`,
                    dreams,
                    avgScore: Math.round(dreams.reduce((sum, d) => sum + d.luckyScore, 0) / dreams.length),
                    count: dreams.length,
                });
            });

            return items;
        } else {
            // 특정 월 필터 모드: 해당 월의 꿈들만 개별 구슬로 표시
            const filtered = allDreams.filter(d => {
                const date = new Date(d.createdAt);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                return key === activeFilter;
            });
            return filtered.map(d => ({ ...d, type: 'dream' as const }));
        }
    }, [allDreams, activeFilter]);

    // 현재 필터의 라벨
    const filterLabel = useMemo(() => {
        if (activeFilter === 'latest') return '최신';
        const [y, m] = activeFilter.split('-');
        return `${y}년 ${parseInt(m)}월`;
    }, [activeFilter]);

    // 구슬 반지름 계산 헬퍼
    const getRadius = useCallback((item: BubbleItem) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (item.type === 'constellation') {
            // 성단 구슬은 더 크고, 둥글함
            const base = isMobile ? 55 : 80;
            return base + Math.min(item.count * 3, 30);
        }
        const minR = isMobile ? 35 : 50;
        const maxR = isMobile ? 70 : 100;
        return minR + (item.luckyScore / 100) * (maxR - minR);
    }, []);

    // ========== Matter.js 물리 엔진 ==========
    const initPhysics = useCallback((items: BubbleItem[]) => {
        if (!sceneRef.current || items.length === 0) return;

        const container = sceneRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 기존 엔진 정리
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
        if (engineRef.current) {
            Matter.World.clear(engineRef.current.world, false);
            Matter.Engine.clear(engineRef.current);
        }

        const engine = Matter.Engine.create();
        engineRef.current = engine;
        engine.world.gravity.y = 0;
        engine.world.gravity.x = 0;

        // 벽
        const wallOpts = { isStatic: true, render: { visible: false }, restitution: 0.8 };
        Matter.World.add(engine.world, [
            Matter.Bodies.rectangle(width / 2, height + 50, width + 100, 100, wallOpts),
            Matter.Bodies.rectangle(width / 2, -50, width + 100, 100, wallOpts),
            Matter.Bodies.rectangle(-50, height / 2, 100, height + 100, wallOpts),
            Matter.Bodies.rectangle(width + 50, height / 2, 100, height + 100, wallOpts),
        ]);

        // 구슬 Body 생성
        const bodies = items.map((item) => {
            const radius = getRadius(item);
            const x = Math.random() * (width - radius * 2) + radius;
            const y = Math.random() * (height - radius * 2) + radius;

            const body = Matter.Bodies.circle(x, y, radius, {
                restitution: 0.5,
                friction: 0.005,
                frictionAir: 0.03,
                density: 0.005,
                render: { visible: false },
                plugin: {
                    itemType: item.type,
                    itemKey: item.type === 'constellation' ? item.key : item.id,
                },
            });
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 1,
                y: (Math.random() - 0.5) * 1,
            });
            return body;
        });

        bodiesRef.current = bodies;
        Matter.World.add(engine.world, bodies);

        // 마우스
        const mouse = Matter.Mouse.create(container);
        const mc = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.01, damping: 0.1, render: { visible: false } },
        });
        mouseConstraintRef.current = mc;
        Matter.World.add(engine.world, mc);

        // 미세 부유력
        Matter.Events.on(engine, 'beforeUpdate', () => {
            bodies.forEach(body => {
                if (body.speed < 0.1) {
                    const f = 0.0003 * body.mass;
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * f,
                        y: (Math.random() - 0.5) * f,
                    });
                }
            });
        });

        // 클릭 감지
        let mInfo: { x: number; y: number; t: number } | null = null;
        Matter.Events.on(mc, 'mousedown', (e: any) => {
            mInfo = { x: e.mouse.position.x, y: e.mouse.position.y, t: Date.now() };
        });
        Matter.Events.on(mc, 'mouseup', (e: any) => {
            if (!mInfo) return;
            const dx = e.mouse.position.x - mInfo.x;
            const dy = e.mouse.position.y - mInfo.y;
            const dt = Date.now() - mInfo.t;
            if (dt < 300 && Math.sqrt(dx * dx + dy * dy) < 10) {
                const clicked = Matter.Query.point(bodies, e.mouse.position)[0];
                if (clicked) {
                    const { itemType, itemKey } = clicked.plugin;
                    if (itemType === 'dream') {
                        const found = allDreams.find(d => d.id === itemKey);
                        if (found) setSelectedDream(found);
                    } else if (itemType === 'constellation') {
                        const cItem = items.find(
                            i => i.type === 'constellation' && i.key === itemKey
                        ) as ConstellationData | undefined;
                        if (cItem) setConstellationModal(cItem);
                    }
                }
            }
        });

        // 러너
        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

        // DOM 동기화
        const sync = () => {
            bodies.forEach((body, i) => {
                const el = bubblesRef.current[i];
                if (el) {
                    el.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
                }
            });
            animFrameRef.current = requestAnimationFrame(sync);
        };
        sync();
    }, [getRadius, allDreams]);

    // bubbleItems 가 바뀌면 물리 엔진 재초기화
    useEffect(() => {
        if (isLoading || bubbleItems.length === 0) return;
        // 트랜지션 중이 아닐 때만 즉시 init
        if (!isTransitioning) {
            // 약간의 딜레이로 DOM이 먼저 렌더링되게 함
            const timer = setTimeout(() => initPhysics(bubbleItems), 50);
            return () => clearTimeout(timer);
        }
    }, [bubbleItems, isLoading, isTransitioning, initPhysics]);

    // ========== 블랙홀 트랜지션 ==========
    const handleFilterChange = useCallback((newFilter: string) => {
        if (newFilter === activeFilter || isTransitioning) return;

        setIsTransitioning(true);

        // 1단계: 모든 구슬을 중앙 하단(블랙홀)으로 빨아들이기
        const container = sceneRef.current;
        if (container && engineRef.current && bodiesRef.current.length > 0) {
            const cx = container.clientWidth / 2;
            const cy = container.clientHeight - 40; // 하단 블랙홀 위치

            bodiesRef.current.forEach(body => {
                // 중앙 하단 방향으로 강한 인력
                const dx = cx - body.position.x;
                const dy = cy - body.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = 0.015 * body.mass;
                Matter.Body.applyForce(body, body.position, {
                    x: (dx / dist) * force,
                    y: (dy / dist) * force,
                });
            });

            // 구슬들이 빨려 들어가는 시간 (1초) 후 필터 변경+ 새 구슬 솟구침
            setTimeout(() => {
                setActiveFilter(newFilter);

                // 2단계: 약간의 딜레이 후 새 구슬을 블랙홀에서 위로 폭발시킴
                setTimeout(() => {
                    setIsTransitioning(false);

                    // 물리 엔진이 재초기화된 후 body들에게 위로 솟구치는 velocity 부여
                    setTimeout(() => {
                        if (bodiesRef.current.length > 0 && sceneRef.current) {
                            const cxNew = sceneRef.current.clientWidth / 2;
                            const cyNew = sceneRef.current.clientHeight - 40;
                            bodiesRef.current.forEach(body => {
                                Matter.Body.setPosition(body, {
                                    x: cxNew + (Math.random() - 0.5) * 60,
                                    y: cyNew,
                                });
                                Matter.Body.setVelocity(body, {
                                    x: (Math.random() - 0.5) * 6,
                                    y: -(Math.random() * 8 + 4), // 위로 솟구침
                                });
                            });
                        }
                    }, 100);
                }, 200);
            }, 800);
        } else {
            // 물리 엔진 없는 경우 즉시 전환
            setActiveFilter(newFilter);
            setIsTransitioning(false);
        }
    }, [activeFilter, isTransitioning]);

    // 타임라인 필터 옵션
    const filterOptions = useMemo(() => {
        const options = [{ key: 'latest', label: '최신' }];
        availableMonths.forEach(key => {
            const [y, m] = key.split('-');
            options.push({ key, label: `${y}.${m}` });
        });
        return options;
    }, [availableMonths]);

    // 클린업
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
            if (engineRef.current) {
                Matter.World.clear(engineRef.current.world, false);
                Matter.Engine.clear(engineRef.current);
            }
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] max-w-6xl">
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-950 via-[#0f1123] to-[#0a0c1a] rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* 배경 데코레이션 */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* 헤더 */}
                <div className="absolute top-8 w-full text-center z-10 pointer-events-none">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center gap-2">
                        <Moon className="w-6 h-6 text-indigo-400" />
                        무의식의 바다
                    </h1>
                    <p className="text-slate-400 mt-1.5 text-xs sm:text-sm tracking-wide">
                        꿈의 방울들을 튕겨보거나, 클릭하여 깊은 기억을 확인해보세요.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                            <Moon className="w-12 h-12 text-purple-400/50" />
                        </motion.div>
                    </div>
                ) : allDreams.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-slate-500 z-10">
                        아직 부유하는 꿈이 없습니다.
                    </div>
                ) : (
                    <div ref={sceneRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
                        {/* 물리 엔진이 조종할 HTML DOM 구슬들 */}
                        {bubbleItems.map((item, index) => {
                            const radius = getRadius(item);
                            const diameter = radius * 2;
                            const isConstellation = item.type === 'constellation';

                            return (
                                <div
                                    key={isConstellation ? `c-${item.key}` : `d-${item.id}`}
                                    ref={(el: HTMLDivElement | null) => { bubblesRef.current[index] = el; }}
                                    className={`absolute top-0 left-0 rounded-full overflow-hidden border pointer-events-none will-change-transform flex items-center justify-center group backdrop-blur-sm ${isConstellation
                                            ? 'shadow-[inset_0_0_30px_rgba(168,85,247,0.5),0_0_40px_rgba(168,85,247,0.3)] border-purple-400/40 bg-purple-950/60'
                                            : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.5)] border-white/30 bg-slate-900'
                                        }`}
                                    style={{
                                        width: diameter,
                                        height: diameter,
                                        transform: `translate(-1000px, -1000px)`,
                                        marginLeft: -radius,
                                        marginTop: -radius,
                                    }}
                                >
                                    {/* 물방울 하이라이트 */}
                                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-white/40 rounded-full blur-[2px] rotate-[-45deg] z-10 pointer-events-none" />
                                    <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[15%] bg-indigo-400/20 rounded-full blur-[4px] rotate-[-45deg] z-10 pointer-events-none" />

                                    {isConstellation ? (
                                        <>
                                            {/* 성단 구슬 내부 : 반짝이는 별 이펙트 */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-purple-300/80 animate-pulse" />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-purple-800/30" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                                                <span className="text-purple-200 font-bold text-[10px] sm:text-xs leading-tight drop-shadow-lg">
                                                    {item.label}
                                                </span>
                                                <span className="text-purple-300/80 text-[9px] mt-0.5">
                                                    {item.count}개의 기억
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {item.imageUrl ? (
                                                <Image
                                                    src={(process.env.NEXT_PUBLIC_API_URL || '') + item.imageUrl}
                                                    alt={item.summary}
                                                    fill
                                                    unoptimized
                                                    className="object-cover transition-opacity duration-300 scale-110"
                                                />
                                            ) : (
                                                <Moon className="w-1/3 h-1/3 text-slate-500" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/40 transition-colors duration-300">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                                                    <span className="text-white font-bold text-xs sm:text-sm line-clamp-2 leading-tight drop-shadow-lg">
                                                        {item.summary}
                                                    </span>
                                                    <div className="mt-1 px-2 py-0.5 rounded-full bg-purple-500/80 backdrop-blur text-[10px] text-white">
                                                        기운 {item.luckyScore}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ===== 블랙홀 포털 + 타임라인 네비게이터 ===== */}
                {!isLoading && allDreams.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pointer-events-none pb-4">
                        {/* 블랙홀 이펙트 (소용돌이) */}
                        <div className="relative w-20 h-20 mb-2">
                            <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-900/80 via-indigo-900/60 to-purple-900/80 blur-md"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                            />
                            <motion.div
                                className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-700/50 via-black to-indigo-700/50 blur-sm"
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
                            />
                            <div className="absolute inset-4 rounded-full bg-black/90 shadow-[inset_0_0_15px_rgba(139,92,246,0.4)]" />

                            {/* 트랜지션 중 밝기 효과 */}
                            <AnimatePresence>
                                {isTransitioning && (
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0 }}
                                        animate={{ scale: 1.8, opacity: 1 }}
                                        exit={{ scale: 1, opacity: 0 }}
                                        className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 타임라인 네비게이터 */}
                        <div className="flex items-center gap-1 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
                            <button
                                onClick={() => {
                                    const idx = filterOptions.findIndex(o => o.key === activeFilter);
                                    if (idx < filterOptions.length - 1) {
                                        handleFilterChange(filterOptions[idx + 1].key);
                                    }
                                }}
                                disabled={isTransitioning}
                                className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-1 overflow-x-auto max-w-[240px] sm:max-w-[400px] scrollbar-hide">
                                {filterOptions.map(opt => (
                                    <button
                                        key={opt.key}
                                        onClick={() => handleFilterChange(opt.key)}
                                        disabled={isTransitioning}
                                        className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 disabled:opacity-50 ${activeFilter === opt.key
                                                ? 'bg-purple-500/60 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                                : 'text-slate-400 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    const idx = filterOptions.findIndex(o => o.key === activeFilter);
                                    if (idx > 0) {
                                        handleFilterChange(filterOptions[idx - 1].key);
                                    }
                                }}
                                disabled={isTransitioning}
                                className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* ===== 상세 뷰 모달 (개별 꿈) ===== */}
                <AnimatePresence>
                    {selectedDream && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedDream(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-2xl bg-slate-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setSelectedDream(null)}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 backdrop-blur transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto">
                                    <div className="relative w-full md:w-2/5 aspect-[4/5] md:aspect-auto group/img">
                                        {selectedDream.imageUrl ? (
                                            <>
                                                <Image
                                                    src={(process.env.NEXT_PUBLIC_API_URL || '') + selectedDream.imageUrl}
                                                    alt={selectedDream.summary}
                                                    fill
                                                    unoptimized
                                                    className="object-cover cursor-pointer"
                                                    onClick={() => setLightboxImage({
                                                        url: (process.env.NEXT_PUBLIC_API_URL || '') + selectedDream.imageUrl!,
                                                        title: selectedDream.summary,
                                                    })}
                                                />
                                                {/* 이미지 위 확대 아이콘 */}
                                                <button
                                                    onClick={() => setLightboxImage({
                                                        url: (process.env.NEXT_PUBLIC_API_URL || '') + selectedDream.imageUrl!,
                                                        title: selectedDream.summary,
                                                    })}
                                                    className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover/img:opacity-100 hover:bg-white/20 backdrop-blur transition-all duration-200"
                                                >
                                                    <ZoomIn className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                <Moon className="w-16 h-16 text-slate-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                                            <div className="flex items-center gap-1 text-purple-300 text-sm font-medium mb-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(selectedDream.createdAt).toLocaleDateString()}
                                            </div>
                                            <h3 className="text-xl font-bold leading-tight">{selectedDream.summary}</h3>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col gap-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-400" /> 꿈 해석
                                                </h4>
                                                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold flex items-center gap-1">
                                                    지수 <span className="text-white">{selectedDream.luckyScore}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap h-32 md:h-48 overflow-y-auto custom-scrollbar">
                                                {selectedDream.interpretation}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                <span className="block text-xs text-purple-400 mb-1">행운 컬러</span>
                                                <span className="text-sm text-slate-200 font-semibold">{selectedDream.luckyColor}</span>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                                <span className="block text-xs text-indigo-400 mb-1">럭키 아이템</span>
                                                <span className="text-sm text-slate-200 font-semibold">{selectedDream.luckyItem}</span>
                                            </div>
                                        </div>
                                        <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                                            <h4 className="text-xs text-rose-400 font-bold mb-1">오늘의 처방전</h4>
                                            <p className="text-sm text-slate-200">{selectedDream.actionableAdvice}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== 이미지 라이트박스 (전체화면 확대 보기 + 저장) ===== */}
                <AnimatePresence>
                    {lightboxImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-lg"
                            onClick={() => setLightboxImage(null)}
                        >
                            {/* 닫기 버튼 */}
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="absolute top-5 right-5 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* 다운로드 버튼 */}
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        const response = await fetch(lightboxImage.url);
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `dream-${lightboxImage.title.slice(0, 20)}.jpg`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                        console.error('이미지 다운로드 실패:', err);
                                    }
                                }}
                                className="absolute top-5 right-20 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur transition-colors flex items-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                <span className="text-sm hidden sm:inline">저장</span>
                            </button>

                            {/* 이미지 */}
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={lightboxImage.url}
                                    alt={lightboxImage.title}
                                    className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                                />
                            </motion.div>

                            {/* 하단 타이틀 */}
                            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                                <p className="text-white/70 text-sm font-medium">{lightboxImage.title}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ===== 성단 모달 (월별 꿈 리스트) ===== */}
                <AnimatePresence>
                    {constellationModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                            onClick={() => setConstellationModal(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="relative w-full max-w-lg bg-slate-900/95 border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* new */}
                                <button
                                    onClick={() => setConstellationModal(null)}
                                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 backdrop-blur transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-purple-200 flex items-center gap-2 mb-1">
                                        <Sparkles className="w-5 h-5 text-purple-400" />
                                        {constellationModal.label}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-5">
                                        {constellationModal.count}개의 꿈 · 평균 기운 {constellationModal.avgScore}
                                    </p>

                                    <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                                        {constellationModal.dreams.map(dream => (
                                            <button
                                                key={dream.id}
                                                onClick={() => {
                                                    setConstellationModal(null);
                                                    setSelectedDream(dream);
                                                }}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-left"
                                            >
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-white/20">
                                                    {dream.imageUrl ? (
                                                        <Image
                                                            src={(process.env.NEXT_PUBLIC_API_URL || '') + dream.imageUrl}
                                                            alt={dream.summary}
                                                            fill
                                                            unoptimized
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                            <Moon className="w-5 h-5 text-slate-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-200 truncate">{dream.summary}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">
                                                        {new Date(dream.createdAt).toLocaleDateString()} · 기운 {dream.luckyScore}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
