import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useDailyFortune, useCreateDailyFortune } from "@/hooks/queries/useDailyFortune";

export function DailyFortuneButton() {
    const { data: fortune } = useDailyFortune();
    const mutation = useCreateDailyFortune();
    const t = useTranslations('fortune');

    const isUsed = !!fortune;

    const handleGetFortune = async () => {
        if (isUsed) return;

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

            // 3. 뮤테이션 실행
            mutation.mutate();
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
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md " + (!isUsed ? "animate-pulse ring-4 ring-indigo-200 ring-offset-2" : "")
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
