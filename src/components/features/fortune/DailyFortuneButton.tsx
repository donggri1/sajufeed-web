'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useFortuneStore } from "@/store/fortune";
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDailyFortune } from '@/lib/api/fortune';

export function DailyFortuneButton() {
    const queryClient = useQueryClient();
    const { isUsed, checkIsUsed, setFortune } = useFortuneStore();
    const t = useTranslations('fortune');

    useEffect(() => {
        checkIsUsed();
    }, [checkIsUsed]);

    const mutation = useMutation({

        mutationFn: () => getDailyFortune(false), // mock=false 명시
        onSuccess: (data) => {
            // 1. 캐시 즉시 업데이트 (화면 리렌더링)
            queryClient.setQueryData(['fortune', 'daily'], data);

            // 2. 쿼리 무효화 (데이터 신선도 보장)
            queryClient.invalidateQueries({ queryKey: ['fortune', 'daily'] });

            alert(t('updateSuccess'));
        },
        onError: (error) => {
            console.error("운세 가져오기 실패:", error);
            alert('운세 조회에 실패했습니다. 다시 시도해주세요.');
        }
    });

    const handleGetFortune = async () => {
        // if (isUsed) return; // 테스트를 위해 일시적으로 주석 처리

        try {
            // 1. 프로필 필수 정보 체크
            const { getMyProfile } = await import('@/lib/api/users');
            const profile = await getMyProfile();

            // 2. 필수 정보 미입력 시 프로필 페이지로 이동
            if (!profile.birthDate || !profile.gender) {
                alert('운세를 보려면 먼저 내 정보를 입력해주세요.');
                window.location.href = '/profile';
                return;
            }
            debugger;
            // 3. 뮤테이션 실행
            mutation.mutate();
            debugger;
        } catch (error) {
            console.error("프로필 확인 중 오류:", error);
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-lg">{t('dailyTitle')}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {t('dailyDescription')}
                    </p>
                </div>
            </div>

            <div className="p-6 pt-0">
                <Button
                    onClick={handleGetFortune}
                    disabled={mutation.isPending}
                    className={`w-full h-12 font-bold transition-all ${mutation.isPending
                        ? "bg-slate-100 text-slate-400 hover:bg-slate-100"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                        }`}
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('analyzing')}
                        </>
                    ) : isUsed ? (
                        <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t('completed')}
                        </>
                    ) : (
                        t('viewButton')
                    )}
                </Button>
                {isUsed && (
                    <p className="text-[11px] text-slate-400 mt-3 text-center">
                        {t('nextDay')}
                    </p>
                )}
            </div>
        </div>
    );
}
