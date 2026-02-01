"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../_lib/signup"; // 아까 만든 axios 함수
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. 유효성 검사 스키마 정의
const formSchema = z.z.object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    nickname: z.string().min(2, "닉네임은 2글자 이상이어야 합니다."),
    password: z.string().min(8, "비밀번호는 8자리 이상이어야 합니다."),
});

export default function SignupForm() {
    // 2. 폼 초기화
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            nickname: "",
            password: "",
        },
    });

    // 3. React Query Mutation (백엔드 통신)
    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            if (data) {
                alert("회원가입이 완료되었습니다!");
                window.location.href = "/"; // 성공 시 이동
            }
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "회원가입 실패");
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>이메일</FormLabel>
                            <FormControl><Input placeholder="example@test.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>닉네임</FormLabel>
                            <FormControl><Input placeholder="사주마스터" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>비밀번호</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? "처리 중..." : "가입하기"}
                </Button>
            </form>
        </Form>
    );
}