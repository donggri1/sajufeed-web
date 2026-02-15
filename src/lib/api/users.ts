import axiosInstance from '@/_lib/axios';
import { UserProfile, UpdateProfileDto } from '@/types/user';

/**
 * 내 프로필 조회
 */
export const getMyProfile = async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get('/users/profile');
    return data;
};

/**
 * 프로필 업데이트
 */
export const updateMyProfile = async (dto: UpdateProfileDto): Promise<UserProfile> => {
    const { data } = await axiosInstance.patch('/users/profile', dto);
    return data;
};
