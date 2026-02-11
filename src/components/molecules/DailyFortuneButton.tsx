'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DailyFortuneButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [isUsed, setIsUsed] = useState(false);
    const [lastUsedDate, setLastUsedDate] = useState<string | null>(null);

    useEffect(() => {
        // 로컬 스토리지에서 마지막 사용 날짜 확인
        const savedDate = localStorage.getItem("lastFortuneDate");
        const today = new Date().toISOString().split('T')[0];
        
        if (savedDate === today) {
            setIsUsed(true);
            setLastUsedDate(savedDate);
        }
    }, []);

    const handleGetFortune = async () => {
        if (isUsed) return;

        setIsLoading(true);
        
        // 실제로는 여기서 API 호출을 통해 데이터를 업데이트합니다.
        // 지금은 시뮬레이션을 위해 2초 대기합니다.
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem("lastFortuneDate", today);
            setIsUsed(true);
            setLastUsedDate(today);
            
            // TODO: React Query나 전역 상태를 통해 메인 데이터 refetch/update 로직 추가
            alert("오늘의 운세가 업데이트되었습니다! 🔮");
            window.location.reload(); // 임시로 새로고침하여 데이터 반영 시뮬레이션
        } catch (error) {
            console.error("운세 가져오기 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">오늘의 기운 확인하기</h3>
            </div>
            
            <p className="text-sm text-slate-600 text-center mb-6">
                매일 한 번, 당신의 사주를 분석하여<br/>
                오늘의 맞춤형 운세를 생성합니다.
            </p>

            <Button 
                onClick={handleGetFortune}
                disabled={isLoading || isUsed}
                className={`w-full py-6 text-lg font-bold transition-all duration-300 ${
                    isUsed 
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:scale-[1.02]"
                }`}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        분석 중...
                    </>
                ) : isUsed ? (
                    <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        오늘 확인 완료
                    </>
                ) : (
                    "오늘의 운세 보기"
                )}
            </Button>

            {isUsed && (
                <p className="text-[11px] text-slate-400 mt-3 italic">
                    내일 다시 확인하실 수 있습니다.
                </p>
            )}
        </div>
    );
}
