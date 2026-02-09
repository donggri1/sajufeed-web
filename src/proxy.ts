import {getSession} from "next-auth/react";
import {auth} from "@/auth";
import {NextResponse} from "next/server";

export default auth((req) => {
    const isLoggedin = !!req.auth; // 세션 존재 여부 확인
    const { nextUrl } = req;
    console.log(`[Middleware] Path: ${nextUrl.pathname}`);
    console.log(`[Middleware] Is Logged In: ${isLoggedin}`);
    console.log(`[Middleware] Session Data:`, req.auth); // 세션 객체 전체 확인
    // 1. 로그인하지 않은 상태로 /home 등 보호된 경로에 접근할 때
    if (!isLoggedin && nextUrl.pathname.startsWith('/home')) {
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    // 2. 이미 로그인했는데 /login이나 /signup에 접근하려고 할 때
    if (isLoggedin && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL("/home", nextUrl));
    }

    return NextResponse.next();
});
export const config = {
    matcher: ['/home']
}