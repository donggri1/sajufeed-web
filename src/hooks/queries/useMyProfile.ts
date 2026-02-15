import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/lib/api/users';

/**
 * 내 프로필 조회 Query 훅
 */
export function useMyProfile() {
    return useQuery({
        queryKey: ['profile', 'me'],
        queryFn: getMyProfile,
    });
}
