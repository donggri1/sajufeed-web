import apiClient from './client';
import { UserLoginRequest, UserJoinRequest } from '@/types/user';

/**
 * 로그인
 */
export async function login(data: UserLoginRequest) {
    const response = await apiClient.post("/users/login", data);
    return response.data;
}

/**
 * 회원가입
 */
export async function signup(data: UserJoinRequest) {
    const response = await apiClient.post<boolean>("/users/join", data);
    return response.data;
}
