'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useMyProfile } from '@/hooks/queries/useMyProfile';
import { useUpdateProfile } from '@/hooks/mutations/useUpdateProfile';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { ChevronsUpDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Country, State, City } from 'country-state-city';

const genderValues = ['male', 'female'] as const;
const calendarValues = ['solar', 'lunar'] as const;

// Zod 스키마
const profileSchema = z.object({
    birthDate: z.string().min(1, '생년월일은 필수입니다'),
    birthTime: z.string().optional().nullable(),
    birthTimeUnknown: z.boolean().optional(),
    gender: z.enum(genderValues, { message: '성별은 필수입니다' }),
    calendarType: z.enum(calendarValues).optional(),
    name: z.string().optional().nullable(),
    countryCode: z.string().optional().nullable(),
    stateCode: z.string().optional().nullable(),
    cityName: z.string().optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
    const t = useTranslations('profile');
    const { data: profile, isLoading } = useMyProfile();
    const updateMutation = useUpdateProfile();

    const {
        register,
        handleSubmit,
        formState: { errors },
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
    const selectedCountry = watch('countryCode');
    const selectedState = watch('stateCode');

    const [countryOpen, setCountryOpen] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);

    const countries = Country.getAllCountries();
    const states = selectedCountry
        ? State.getStatesOfCountry(selectedCountry)
        : [];
    const cities = selectedCountry && selectedState
        ? City.getCitiesOfState(selectedCountry, selectedState)
        : [];

    // 프로필 데이터가 로드되면 폼에 반영
    useEffect(() => {
        if (profile) {
            reset({
                birthDate: profile.birthDate || '',
                birthTime: profile.birthTime || '',
                birthTimeUnknown: profile.birthTimeUnknown,
                gender: profile.gender || undefined,
                calendarType: profile.calendarType,
                name: profile.name || '',
                countryCode: profile.countryCode || '',
                stateCode: profile.stateCode || '',
                cityName: profile.cityName || '',
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate({
            birthDate: data.birthDate,
            birthTime: data.birthTimeUnknown ? null : data.birthTime,
            birthTimeUnknown: data.birthTimeUnknown,
            gender: data.gender,
            calendarType: data.calendarType,
            name: data.name || null,
            countryCode: data.countryCode || null,
            stateCode: data.stateCode || null,
            cityName: data.cityName || null,
        }, {
            onSuccess: () => alert(t('saveSuccess')),
            onError: () => alert(t('saveError')),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
            {/* 이름 */}
            <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder={t('namePlaceholder')}
                    {...register('name')}
                />
            </div>

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

            {/* 국가 */}
            <div className="space-y-2">
                <Label>{t('country')}</Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={countryOpen}
                            className="w-full justify-between font-normal"
                            type="button"
                        >
                            {selectedCountry
                                ? countries.find((c) => c.isoCode === selectedCountry)?.name ?? selectedCountry
                                : t('countryPlaceholder')}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Command>
                            <CommandInput placeholder={t('countryPlaceholder')} />
                            <CommandList>
                                <CommandEmpty>{t('noResult')}</CommandEmpty>
                                <CommandGroup>
                                    {countries.map((c) => (
                                        <CommandItem
                                            key={c.isoCode}
                                            value={`${c.name} ${c.isoCode}`}
                                            onSelect={() => {
                                                setValue('countryCode', c.isoCode);
                                                setValue('stateCode', null);
                                                setValue('cityName', null);
                                                setCountryOpen(false);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", selectedCountry === c.isoCode ? "opacity-100" : "opacity-0")} />
                                            {c.flag} {c.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {/* 지역/주 */}
            <div className="space-y-2">
                <Label>{t('state')}</Label>
                {states.length > 0 ? (
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={stateOpen}
                                className="w-full justify-between font-normal"
                                type="button"
                            >
                                {selectedState
                                    ? states.find((s) => s.isoCode === selectedState)?.name ?? selectedState
                                    : t('statePlaceholder')}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput placeholder={t('statePlaceholder')} />
                                <CommandList>
                                    <CommandEmpty>{t('noResult')}</CommandEmpty>
                                    <CommandGroup>
                                        {states.map((s) => (
                                            <CommandItem
                                                key={s.isoCode}
                                                value={s.name}
                                                onSelect={() => {
                                                    setValue('stateCode', s.isoCode);
                                                    setValue('cityName', null);
                                                    setStateOpen(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", selectedState === s.isoCode ? "opacity-100" : "opacity-0")} />
                                                {s.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Input
                        type="text"
                        placeholder={t('statePlaceholder')}
                        disabled={!selectedCountry}
                        className="disabled:opacity-50"
                    />
                )}
            </div>

            {/* 도시 */}
            <div className="space-y-2">
                <Label>{t('city')}</Label>
                {cities.length > 0 ? (
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={cityOpen}
                                className="w-full justify-between font-normal"
                                type="button"
                            >
                                {watch('cityName') || t('cityPlaceholder')}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Command>
                                <CommandInput placeholder={t('cityPlaceholder')} />
                                <CommandList>
                                    <CommandEmpty>{t('noResult')}</CommandEmpty>
                                    <CommandGroup>
                                        {cities.map((c) => (
                                            <CommandItem
                                                key={c.name}
                                                value={c.name}
                                                onSelect={() => {
                                                    setValue('cityName', c.name);
                                                    setCityOpen(false);
                                                }}
                                            >
                                                <Check className={cn("mr-2 h-4 w-4", watch('cityName') === c.name ? "opacity-100" : "opacity-0")} />
                                                {c.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <Input
                        type="text"
                        placeholder={t('cityPlaceholder')}
                        {...register('cityName')}
                        disabled={!selectedState && !selectedCountry}
                    />
                )}
            </div>

            {/* 저장 버튼 */}
            <Button type="submit" disabled={updateMutation.isPending} className="w-full">
                {updateMutation.isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('saving')}
                    </>
                ) : (
                    t('save')
                )}
            </Button>
        </form>
    );
}
