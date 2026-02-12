"use client";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {values} from "eslint-config-next";
import axiosInstance from "@/_lib/axios";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {login} from "@/app/[locale]/(beforeLogin)/_lib/login";
import {signIn} from "next-auth/react";


const loginSchema = z.object({
    email : z.string().email("올바른 이메일 형식이 아닙니다."),
    password : z.string().min(1,"비밀번호를 입력하세요")
})

export default function LoginForm() {
    const [isLoding, setIsLoding] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver : zodResolver(loginSchema), // 유효성 검사
        defaultValues : {email: "",password: ""},
    });


    const onSubmit = async (values : z.infer<typeof loginSchema>) =>{
        setIsLoding(true);
        try {
            debugger;
            const result = await signIn("credentials",{ // /api/auth/callback/credentials 라는 주소로 데이터를 쏨.
                email : values.email,
                password : values.password,
                redirect : false, // 페이지 이동을 직접 제어하기위해 false
            });

            if(result?.error){
                alert("로그인 정보가 올바르지 않습니다.")
            }else {
                router.refresh();
                router.push("/home");
                console.log("");
            }

        }catch (error){
            console.error("로그인 중 오류 발생:",error);
            alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
        }finally {
            setIsLoding(false);
        }

        // mutation.mutate(values)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-4 border-t">
                <div className="text-center text-sm font-semibold text-gray-500">기존 계정으로 로그인</div>
                <FormField
                    control={form.control}
                    name = "email"
                    render={({field})=>(
                        <FormItem>
                            <FormControl>
                                <Input placeholder={"이메일"} {...field}/>
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
                            <Input type="password" placeholder="비밀번호" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
                <Button type={"submit"} className={"w-full bg-primary hover:bg-primary/90 "} disabled={isLoding}>
                    {isLoding? "로그인중..." :"로그인"}
                </Button>
            </form>
        </Form>
    )
}