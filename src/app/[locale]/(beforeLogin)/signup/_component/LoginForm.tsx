"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { values } from "eslint-config-next";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/api/auth";
import { signIn } from "next-auth/react";
import { useTranslations } from 'next-intl';

export default function LoginForm() {
    const [isLoding, setIsLoding] = useState(false);
    const router = useRouter();
    const t = useTranslations('auth'); // auth 네임스페이스 사용 

    const loginSchema = z.object({
        email: z.string().email(t('emailError')),
        password: z.string().min(1, t('passwordError'))
    })
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema), // 유효성 검사
        defaultValues: { email: "", password: "" },
    });


    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoding(true);
        try {
            debugger;
            const result = await signIn("credentials", { // /api/auth/callback/credentials 라는 주소로 데이터를 쏨.
                email: values.email,
                password: values.password,
                redirect: false, // 페이지 이동을 직접 제어하기위해 false
            });

            if (result?.error) {
                alert(t('loginError'))
            } else {
                router.refresh();
                router.push("/home");
                console.log("");
            }

        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            alert(t('loginErrorGeneral'));
        } finally {
            setIsLoding(false);
        }

        // mutation.mutate(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-4 border-t">
                <div className="text-center text-sm font-semibold text-gray-500">{t('loginTitle')}</div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={t('emailPlaceholder')} {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" placeholder={t('passwordPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type={"submit"} className={"w-full bg-primary hover:bg-primary/90 "} disabled={isLoding}>
                    {isLoding ? t('loginButtonLoading') : t('loginButton')}
                </Button>
            </form>
        </Form>
    )
}