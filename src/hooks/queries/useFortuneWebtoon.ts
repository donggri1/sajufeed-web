import { useQuery } from '@tanstack/react-query';
import { getWebtoon } from '@/lib/api/fortune';

export function useFortuneWebtoon(fortuneId: number | undefined) {
    return useQuery({
        queryKey: ['fortune', fortuneId, 'webtoon'],
        queryFn: () => getWebtoon(fortuneId!),
        enabled: !!fortuneId,
        // 생성 중이면 3초마다 폴링, 완료/실패 시 중단
        refetchInterval: (query) => { // 폴링
            const status = query.state.data?.status;
            if (status === 'generating' || status === 'pending') {
                return 3000;
            }
            return false;
        },
    });
}
