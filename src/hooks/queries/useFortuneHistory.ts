import { useQuery } from '@tanstack/react-query';
import { getFortuneHistory } from '@/lib/api/fortune';

export function useFortuneHistory(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ['fortune', 'history', page, limit],
        queryFn: () => getFortuneHistory(page, limit),
    });
}
