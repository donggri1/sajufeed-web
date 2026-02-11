'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useFortuneStore } from "@/store/fortune";

export function DailyFortuneButton() {
    const [isLoading, setIsLoading] = useState(false);
    const { isUsed, checkIsUsed, setFortune } = useFortuneStore();

    useEffect(() => {
        checkIsUsed();
    }, [checkIsUsed]);

    const handleGetFortune = async () => {
        if (isUsed) return;
        setIsLoading(true);
        try {
            // API 호출 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 가상의 운세 데이터
            const mockData = {
                score: 95,
                summary: "오늘은 아주 운이 좋은 날입니다.",
                details: "새로운 도전을 하기에 완벽한 시기입니다."
            };
            
            // Zustand 스토어 업데이트
            setFortune(mockData);
            
            alert("오늘의 운세가 업데이트되었습니다! 🔮");
        } catch (error) {
            console.error("운세 가져오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">오늘의 기운 확인</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        매일 한 번, 당신의 사주를 분석하여<br/>
                        새로운 운세를 생성합니다.
                    </p>
                </div>
            </div>
            
            <div className="p-6 pt-0">
                <Button 
                    onClick={handleGetFortune}
                    disabled={isLoading || isUsed}
                    className={`w-full h-12 font-bold transition-all ${
                        isUsed 
                        ? "bg-slate-100 text-slate-400 hover:bg-slate-100" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                    }`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            분석 중...
                        </>
                    ) : isUsed ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            확인 완료
                        </>
                    ) : (
                        "운세 보기"
                    )}
                </Button>
                {isUsed && (
                    <p className="text-[11px] text-slate-400 mt-3 text-center">
                        내일 다시 확인하실 수 있습니다.
                    </p>
                )}
            </div>
        </div>
    );
}
