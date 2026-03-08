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
        <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden h-full flex flex-col group transition-all duration-500 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)] hover:-translate-y-1">
            {/* 배경ตก장식 (Blob) */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl group-hover:bg-indigo-400/20 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl group-hover:bg-purple-400/20 transition-colors duration-700"></div>

            <div className="p-8 flex-1 flex flex-col justify-center items-center text-center space-y-5 relative z-10">
                <div className="relative">
                    {/* 반짝임 오라 */}
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl rotate-3 flex items-center justify-center text-indigo-600 shadow-sm border border-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                        <Sparkles className="w-8 h-8 drop-shadow-sm" />
                    </div>
                </div>
                <div>
                    <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">{t('dailyTitle')}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                        {t('dailyDescription')}
                    </p>
                </div>
            </div>

            <div className="p-8 pt-0 relative z-10">
                <div className="relative group/btn cursor-pointer" onClick={handleGetFortune}>
                    {!isUsed && !mutation.isPending && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover/btn:opacity-60 transition duration-500 animate-pulse"></div>
                    )}
                    <Button
                        disabled={mutation.isPending || isUsed}
                        className={`relative w-full h-14 font-bold text-lg rounded-xl transition-all duration-500 overflow-hidden ${mutation.isPending
                            ? "bg-slate-100 text-slate-400"
                            : isUsed
                                ? "bg-slate-50 text-slate-400 border border-slate-200 shadow-inner"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] border-t border-white/20"
                            }`}
                    >
                        {/* Shimmer Effect */}
                        {!isUsed && !mutation.isPending && (
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                        )}

                        <div className="relative flex items-center justify-center">
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('analyzing')}
                                </>
                            ) : isUsed ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-500" />
                                    {t('completed')}
                                </>
                            ) : (
                                t('viewButton')
                            )}
                        </div>
                    </Button>
                </div>
                {/* TODO: 내일 운세 보기 로직 추가 */}
                {isUsed && (
                    <p className="text-xs font-medium text-slate-400 mt-4 text-center">
                        {t('nextDay')}
                    </p>
                )}
            </div>
        </div>
    );
}
