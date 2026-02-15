import apiClient from './client';
import { UserProfile, UpdateProfileDto } from '@/types/user';

/**
 * 내 프로필 조회
 */
export const getMyProfile = async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/users/profile');
    return data;
};

/**
 * 프로필 업데이트
 */
export const updateMyProfile = async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await apiClient.patch('/users/profile', dto);
    return data;
};
