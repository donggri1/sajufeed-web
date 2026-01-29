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

export default function SajuForm() {
    const { birthDate, setBirthDate, gender, setGender, isSolar, setIsSolar } = useSajuStore();

    return (
        <div className="space-y-6 py-4">
            {/* 1. 성별 및 양/음력 선택 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>성별</Label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                            <SelectValue placeholder="성별 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">남성</SelectItem>
                            <SelectItem value="female">여성</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>양력/음력</Label>
                    <Select value={isSolar} onValueChange={setIsSolar}>
                        <SelectTrigger>
                            <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="solar">양력</SelectItem>
                            <SelectItem value="lunar">음력</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* 2. 생년월일 선택 (Calendar 사용) */}
            <div className="space-y-2 flex flex-col">
                <Label>생년월일</Label>
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
                            {birthDate ? format(birthDate, "PPP") : <span>날짜를 선택하세요</span>}
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
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12">
                내 운세 분석하기
            </Button>
        </div>
    );
}