import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWebtoon } from '@/lib/api/fortune';

export function useCreateWebtoon() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fortuneId: number) => createWebtoon(fortuneId),
        onSuccess: (_data, fortuneId) => {
            queryClient.invalidateQueries({ queryKey: ['fortune', fortuneId, 'webtoon'] });
            queryClient.invalidateQueries({ queryKey: ['fortune', 'daily'] });
        },
    });
}
