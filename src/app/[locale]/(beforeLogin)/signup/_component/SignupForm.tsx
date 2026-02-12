"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../_lib/signup";
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
import { useTranslations } from 'next-intl';

export default function SignupForm() {
    const t = useTranslations('signup');
    
    // 유효성 검사 스키마 정의
    const formSchema = z.object({
        email: z.string().email(t('emailError')),
        nickname: z.string().min(2, t('nicknameError')),
        password: z.string().min(8, t('passwordError')),
    });
    // 2. 폼 초기화
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            nickname: "",
            password: "",
        },
    });

    // React Query Mutation (백엔드 통신)
    const mutation = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            if (data) {
                alert(t('successMessage'));
                window.location.href = "/";
            }
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || t('errorMessage'));
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
                            <FormLabel>{t('emailLabel')}</FormLabel>
                            <FormControl><Input placeholder={t('emailPlaceholder')} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('nicknameLabel')}</FormLabel>
                            <FormControl><Input placeholder={t('nicknamePlaceholder')} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('passwordLabel')}</FormLabel>
                            <FormControl><Input type="password" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? t('submitButtonLoading') : t('submitButton')}
                </Button>
            </form>
        </Form>
    );
}