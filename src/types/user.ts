export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    birthDate: string | null;
    birthTime: string | null;
    birthTimeUnknown: boolean;
    gender: 'male' | 'female' | null;
    calendarType: 'solar' | 'lunar';
    birthPlace: string | null;
}

export interface UpdateProfileDto {
    birthDate?: string | null;
    birthTime?: string | null;
    birthTimeUnknown?: boolean;
    gender?: 'male' | 'female' | null;
    calendarType?: 'solar' | 'lunar';
    birthPlace?: string | null;
}
