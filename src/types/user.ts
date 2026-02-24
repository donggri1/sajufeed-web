// === Auth 관련 타입 (기존 model/User.ts에서 이동) ===
export interface UserJoinRequest {
    email: string;
    nickname: string;
    password: string;
}

export type UserJoinResponse = boolean;

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    email: string;
    nickname: string;
    image?: string;
}

// === Profile 관련 타입 ===
export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    birthDate: string | null;
    birthTime: string | null;
    birthTimeUnknown: boolean;
    gender: 'male' | 'female' | null;
    calendarType: 'solar' | 'lunar';
    name: string | null;
    countryCode: string | null;
    stateCode: string | null;
    cityName: string | null;
}

export interface UpdateProfileDto {
    birthDate?: string | null;
    birthTime?: string | null;
    birthTimeUnknown?: boolean;
    gender?: 'male' | 'female' | null;
    calendarType?: 'solar' | 'lunar';
    name?: string | null;
    countryCode?: string | null;
    stateCode?: string | null;
    cityName?: string | null;
}
