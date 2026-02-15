import { useQuery } from '@tanstack/react-query';
import { getDailyFortune } from '@/lib/api/fortune';

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
