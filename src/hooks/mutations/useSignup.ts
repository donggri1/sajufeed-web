import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '@/lib/api/auth';
import { UserJoinRequest } from '@/types/user';

/**
 * 회원가입 Mutation 훅
 */
export function useSignup() {
    return useMutation({
        mutationFn: (data: UserJoinRequest) => signup(data),
    });
}
