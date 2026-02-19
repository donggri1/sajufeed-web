import { useQuery } from '@tanstack/react-query';
import { getWebtoon } from '@/lib/api/fortune';

export function useFortuneWebtoon(fortuneId: number | undefined) {
    return useQuery({
        queryKey: ['fortune', fortuneId, 'webtoon'],
        queryFn: () => getWebtoon(fortuneId!),
        enabled: !!fortuneId,
    });
}
