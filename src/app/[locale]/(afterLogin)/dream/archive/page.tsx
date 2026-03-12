'use client';

import { useEffect, useState, useRef } from 'react';
import apiClient from '@/lib/api/client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sparkles, Calendar, X } from 'lucide-react';
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

export default function DreamArchivePage() {
    const [dreams, setDreams] = useState<DreamData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDream, setSelectedDream] = useState<DreamData | null>(null);

    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);

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

    // Matter.js 엔진 초기화 (dreams 데이터를 다 불러온 후에 실행)
    useEffect(() => {
        if (isLoading || dreams.length === 0 || !sceneRef.current) return;

        const container = sceneRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 엔진 생성
        const engine = Matter.Engine.create();
        engineRef.current = engine;

        // 완전 무중력 (둥둥 떠다니게)
        engine.world.gravity.y = 0;
        engine.world.gravity.x = 0;

        // 화면 밖으로 나가지 못하게 바운더리 (벽) 설정
        const wallOptions = { isStatic: true, render: { visible: false }, restitution: 0.8 };
        // 약간의 두께(100)를 주어 튕겨나가게 함
        const ground = Matter.Bodies.rectangle(width / 2, height + 50, width + 100, 100, wallOptions);
        const ceiling = Matter.Bodies.rectangle(width / 2, -50, width + 100, 100, wallOptions);
        const leftWall = Matter.Bodies.rectangle(-50, height / 2, 100, height + 100, wallOptions);
        const rightWall = Matter.Bodies.rectangle(width + 50, height / 2, 100, height + 100, wallOptions);

        Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

        // 구슬(Body) 생성
        const bodies = dreams.map((dream, index) => {
            // 최소 반지름 40, 최대 100 (luckyScore 비례)
            const minRadius = window.innerWidth < 768 ? 35 : 50;
            const maxRadius = window.innerWidth < 768 ? 70 : 110;
            const radius = minRadius + (dream.luckyScore / 100) * (maxRadius - minRadius);

            // 화면 안쪽 공간의 랜덤한 초기 위치
            const x = Math.random() * (width - radius * 2) + radius;
            const y = Math.random() * (height - radius * 2) + radius;

            const body = Matter.Bodies.circle(x, y, radius, {
                restitution: 0.5, // 튕기는 탄성 강도 낮춤 (부드럽게 닿도록)
                friction: 0.005,
                frictionAir: 0.03, // 공기 저항을 크게 높여 물속에서 움직이듯 끈적하고 천천히 이동하게 함
                density: 0.005,
                render: { visible: false },
                plugin: { dreamId: dream.id }
            });
            // 초기 랜덤 속도 아주 약하게
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 1,
                y: (Math.random() - 0.5) * 1
            });
            return body;
        });

        Matter.World.add(engine.world, bodies);

        // 마우스 상호작용
        const mouse = Matter.Mouse.create(container);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.01, // 마우스로 잡고 당길 때 고무줄처럼 끈적/느슨하게 딸려오도록 대폭 낮춤
                damping: 0.1,    // 움직임 감쇠 추가
                render: { visible: false }
            }
        });
        Matter.World.add(engine.world, mouseConstraint);

        // 자연스러운 둥둥 떠다님 유지를 위한 미세 조류(물결) 효과
        Matter.Events.on(engine, 'beforeUpdate', () => {
            bodies.forEach((body) => {
                // 속도가 거의 멈추면 아주 미세하게 밀어줌
                if (body.speed < 0.1) {
                    const forceMagnitude = 0.0003 * body.mass; // 멈추지 않게 살짝만
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * forceMagnitude,
                        y: (Math.random() - 0.5) * forceMagnitude
                    });
                }
            });
        });

        // 클릭 이벤트 판별 로직
        let mousedownInfo: { x: number, y: number, time: number } | null = null;
        Matter.Events.on(mouseConstraint, 'mousedown', (e) => {
            mousedownInfo = { x: e.mouse.position.x, y: e.mouse.position.y, time: Date.now() };
        });

        Matter.Events.on(mouseConstraint, 'mouseup', (e) => {
            if (!mousedownInfo) return;
            const dx = e.mouse.position.x - mousedownInfo.x;
            const dy = e.mouse.position.y - mousedownInfo.y;
            const dt = Date.now() - mousedownInfo.time;

            // 드래그가 아닌 단순 클릭(거리/시간 짧음)으로 판단되면
            if (dt < 300 && Math.sqrt(dx * dx + dy * dy) < 10) {
                const clickedBody = Matter.Query.point(bodies, e.mouse.position)[0];
                if (clickedBody) {
                    const dId = clickedBody.plugin.dreamId;
                    const found = dreams.find((d) => d.id === dId);
                    if (found) setSelectedDream(found);
                }
            }
        });

        // 러너 생성
        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

        // HTML DOM 요소 위치 동기화 애니메이션 프레임
        let animationFrameId: number;
        const updateDOM = () => {
            bodies.forEach((body, i) => {
                const element = bubblesRef.current[i];
                if (element) {
                    const { x, y } = body.position;
                    // top, left 중심으로 이동 (transform: translate(-50%, -50%))
                    element.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
                }
            });
            animationFrameId = requestAnimationFrame(updateDOM);
        };
        updateDOM();

        // 클린업
        return () => {
            cancelAnimationFrame(animationFrameId);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world, false);
            Matter.Engine.clear(engine);
        };
    }, [dreams, isLoading]);

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] max-w-6xl">
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-950 via-[#0f1123] to-[#0a0c1a] rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* 배경 데코레이션 */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center gap-2">
                        <Moon className="w-6 h-6 text-indigo-400" />
                        무의식의 바다
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm tracking-wide">
                        꿈의 방울들을 튕겨보거나, 클릭하여 깊은 기억을 확인해보세요.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                            <Moon className="w-12 h-12 text-purple-400/50" />
                        </motion.div>
                    </div>
                ) : dreams.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-slate-500 z-10">
                        아직 부유하는 꿈이 없습니다.
                    </div>
                ) : (
                    <div ref={sceneRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
                        {/* 물리 엔진이 조종할 HTML DOM 구슬들 */}
                        {dreams.map((dream, index) => {
                            const minRadius = typeof window !== 'undefined' && window.innerWidth < 768 ? 35 : 50;
                            const maxRadius = typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 110;
                            const radius = minRadius + (dream.luckyScore / 100) * (maxRadius - minRadius);
                            const diameter = radius * 2;

                            return (
                                <div
                                    key={dream.id}
                                    ref={(el: HTMLDivElement | null) => { bubblesRef.current[index] = el; }}
                                    className="absolute top-0 left-0 rounded-full overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.5)] border border-white/30 bg-slate-900 pointer-events-none will-change-transform flex items-center justify-center group backdrop-blur-sm"
                                    style={{
                                        width: diameter,
                                        height: diameter,
                                        transform: `translate(-1000px, -1000px)`, // 초기 위치 (숨김)
                                        marginLeft: -radius, // 기준점(앵커)을 중앙으로
                                        marginTop: -radius
                                    }}
                                >
                                    {/* 입체적인 물방울/유리 하이라이트 효과 */}
                                    <div className="absolute top-[10%] left-[20%] w-[40%] h-[30%] bg-white/40 rounded-full blur-[2px] rotate-[-45deg] z-10 pointer-events-none" />
                                    <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[15%] bg-indigo-400/20 rounded-full blur-[4px] rotate-[-45deg] z-10 pointer-events-none" />

                                    {dream.imageUrl ? (
                                        <Image
                                            src={(process.env.NEXT_PUBLIC_API_URL || '') + dream.imageUrl}
                                            alt={dream.summary}
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
                                                {dream.summary}
                                            </span>
                                            <div className="mt-1 px-2 py-0.5 rounded-full bg-purple-500/80 backdrop-blur text-[10px] text-white">
                                                기운 {dream.luckyScore}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 상세 뷰 모달 */}
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
                                    <div className="relative w-full md:w-2/5 aspect-[4/5] md:aspect-auto">
                                        {selectedDream.imageUrl ? (
                                            <Image
                                                src={(process.env.NEXT_PUBLIC_API_URL || '') + selectedDream.imageUrl}
                                                alt={selectedDream.summary}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                <Moon className="w-16 h-16 text-slate-600" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
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
            </div>
        </div>
    );
}
