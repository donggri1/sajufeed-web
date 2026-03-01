import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewYearFortune, createNewYearFortune } from '@/lib/api/fortune';
import { useTranslations } from 'next-intl';

/**
 * 신년운세 조회 훅
 */
export function useNewYearFortune(year: string) {
    return useQuery({
        queryKey: ['fortune', 'new-year', year],
        queryFn: () => getNewYearFortune(year),
        staleTime: 5 * 60 * 1000, // 5분
        retry: 0, // 운세가 없으면 404가 날 수 있으므로 재시도 안함
    });
}

/**
 * 신년운세 생성 훅
 */
export function useCreateNewYearFortune() {
    const queryClient = useQueryClient();
    const t = useTranslations('newYear');

    return useMutation({
        mutationFn: (year: string) => createNewYearFortune(year),
        onSuccess: (data, year) => {
            // 1. 캐시 즉시 업데이트
            queryClient.setQueryData(['fortune', 'new-year', year], data);

            // 2. 쿼리 무효화로 동일 키의 옵저버 갱신
            queryClient.invalidateQueries({ queryKey: ['fortune', 'new-year', year] });

            // (선택) 알림
            alert(t('generateSuccess', { fallback: '새해 운세가 성공적으로 생성되었습니다!' }));
        },
        onError: (error) => {
            console.error("신년운세 생성 실패:", error);
            alert(t('generateError', { fallback: '신년운세 생성에 실패했습니다. 다시 시도해주세요.' }));
        }
    });
}
