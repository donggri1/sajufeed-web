'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Zod 스키마
const profileSchema = z.object({
    birthDate: z.string().min(1, '생년월일은 필수입니다'),
    birthTime: z.string().optional().nullable(),
    birthTimeUnknown: z.boolean().default(false),
    gender: z.enum(['male', 'female'], { required_error: '성별은 필수입니다' }),
    calendarType: z.enum(['solar', 'lunar']).default('solar'),
    birthPlace: z.string().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const t = useTranslations('profile');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            birthTimeUnknown: false,
            calendarType: 'solar',
        },
    });

    const birthTimeUnknown = watch('birthTimeUnknown');

    // 프로필 데이터 로드
    useEffect(() => {
        debugger;
        const loadProfile = async () => {
            try {
                const profile = await getMyProfile();
                reset({
                    birthDate: profile.birthDate || '',
                    birthTime: profile.birthTime || '',
                    birthTimeUnknown: profile.birthTimeUnknown,
                    gender: profile.gender || undefined,
                    calendarType: profile.calendarType,
                    birthPlace: profile.birthPlace || '',
                });
            } catch (error) {
                console.error('프로필 로드 실패:', error);
            }
        };
        loadProfile();
    }, [reset]);

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateMyProfile({
                birthDate: data.birthDate,
                birthTime: data.birthTimeUnknown ? null : data.birthTime,
                birthTimeUnknown: data.birthTimeUnknown,
                gender: data.gender,
                calendarType: data.calendarType,
                birthPlace: data.birthPlace || null,
            });
            alert('프로필이 저장되었습니다!');
        } catch (error) {
            console.error('프로필 저장 실패:', error);
            alert('프로필 저장에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* 생년월일 */}
            <div className="space-y-2">
                <Label htmlFor="birthDate">
                    {t('birthDate')} <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="birthDate"
                    type="date"
                    {...register('birthDate')}
                    className={cn(errors.birthDate && 'border-red-500')}
                />
                {errors.birthDate && (
                    <p className="text-sm text-red-500">{errors.birthDate.message}</p>
                )}
            </div>

            {/* 출생시간 모름 체크박스 */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="birthTimeUnknown"
                    {...register('birthTimeUnknown')}
                    className="w-4 h-4"
                />
                <Label htmlFor="birthTimeUnknown" className="cursor-pointer">
                    {t('birthTimeUnknown')}
                </Label>
            </div>

            {/* 출생시간 */}
            {!birthTimeUnknown && (
                <div className="space-y-2">
                    <Label htmlFor="birthTime">{t('birthTime')}</Label>
                    <Input
                        id="birthTime"
                        type="time"
                        {...register('birthTime')}
                        className={cn(errors.birthTime && 'border-red-500')}
                    />
                    {errors.birthTime && (
                        <p className="text-sm text-red-500">{errors.birthTime.message}</p>
                    )}
                </div>
            )}

            {/* 성별 */}
            <div className="space-y-2">
                <Label htmlFor="gender">
                    {t('gender')} <span className="text-red-500">*</span>
                </Label>
                <Select value={watch('gender') || ''} onValueChange={(value) => setValue('gender', value as 'male' | 'female')}>
                    <SelectTrigger className={cn(errors.gender && 'border-red-500')}>
                        <SelectValue placeholder="성별 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">{t('male')}</SelectItem>
                        <SelectItem value="female">{t('female')}</SelectItem>
                    </SelectContent>
                </Select>
                {errors.gender && (
                    <p className="text-sm text-red-500">{errors.gender.message}</p>
                )}
            </div>

            {/* 양력/음력 */}
            <div className="space-y-2">
                <Label htmlFor="calendarType">{t('calendarType')}</Label>
                <Select
                    value={watch('calendarType') || 'solar'}
                    onValueChange={(value) => setValue('calendarType', value as 'solar' | 'lunar')}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="solar">{t('solar')}</SelectItem>
                        <SelectItem value="lunar">{t('lunar')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 출생지 */}
            <div className="space-y-2">
                <Label htmlFor="birthPlace">{t('birthPlace')}</Label>
                <Input
                    id="birthPlace"
                    type="text"
                    placeholder="예: 서울"
                    {...register('birthPlace')}
                />
            </div>

            {/* 저장 버튼 */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                    </>
                ) : (
                    t('save')
                )}
            </Button>
        </form>
    );
}
