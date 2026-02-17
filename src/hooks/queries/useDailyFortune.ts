import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDailyFortune, createDailyFortune } from '@/lib/api/fortune';
import { useTranslations } from 'next-intl';

// 개발 중에는 Mock 데이터를 사용하도록 설정
const USE_MOCK_DATA = false;

/**
 * 오늘의 운세 조회 훅
 */
export function useDailyFortune() {
    return useQuery({
        queryKey: ['fortune', 'daily'],
        queryFn: () => getDailyFortune(USE_MOCK_DATA),
        staleTime: 5 * 60 * 1000, // 5분
    });
}

/**
 * 오늘의 운세 생성 훅
 */
export function useCreateDailyFortune() {
    const queryClient = useQueryClient();
    const t = useTranslations('fortune');

    return useMutation({
        mutationFn: () => createDailyFortune(),
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
}
