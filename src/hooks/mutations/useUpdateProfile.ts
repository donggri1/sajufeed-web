import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMyProfile } from '@/lib/api/users';
import { UpdateProfileDto } from '@/types/user';

/**
 * 프로필 업데이트 Mutation 훅
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileDto) => updateMyProfile(data),
        onSuccess: () => {
            // 프로필 캐시 무효화 → 자동 재조회
            queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
        },
    });
}
