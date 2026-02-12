"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useSajuStore } from "@/store/modal";
import { useTranslations } from 'next-intl';

export default function SajuForm() {
    const { birthDate, setBirthDate, gender, setGender, isSolar, setIsSolar } = useSajuStore();
    const t = useTranslations('saju');

    return (
        <div className="space-y-6 py-4">
            {/* 1. 성별 및 양/음력 선택 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>{t('gender')}</Label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('genderPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">{t('male')}</SelectItem>
                            <SelectItem value="female">{t('female')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{t('calendar')}</Label>
                    <Select value={isSolar} onValueChange={setIsSolar}>
                        <SelectTrigger>
                            <SelectValue placeholder={t('calendarPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="solar">{t('solar')}</SelectItem>
                            <SelectItem value="lunar">{t('lunar')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 2. 생년월일 선택 (Calendar 사용) */}
            <div className="space-y-2 flex flex-col">
                <Label>{t('birthDate')}</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !birthDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? format(birthDate, "PPP") : <span>{t('selectDate')}</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={(date)=>setBirthDate(date)}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1950}
                            toYear={2026}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* 3. 분석 버튼 */}
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white ">
                {t('analyze')}
            </Button>
        </div>
    );
}