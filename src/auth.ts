import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "@auth/core/providers/credentials";

export const {handlers,auth,signIn,signOut} = NextAuth({
    pages: {
        signIn: '/login', //로그인 필요시 이동할 페이지
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                // [Next.js 서버에서 실행됨] 백엔드 NestJS 서버로 로그인 요청
                const res = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                        nickname : credentials.nickname,
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                const user = await res.json();

                // 백엔드 응답이 성공이고 유저 정보가 있다면 세션 생성
                if (res.ok && user) {
                    return user;
                }
                return null; // 실패 시 로그인 거부
            },
        }),
    ],
    callbacks: {
        async jwt ({token, user}){
            if(user){
                token.email = user.email;
                token.nickname = user.nickname;
            }
            return token; // 토큰 반환
        },
        async session ({session,token}){
            // 세션에서 유저 정보를 꺼내 쓸 수 있게 함.
            if(session.user){
                session.user.email = token.email as string;
                session.user.nickname = token.nickname as string;
            }
            
            return session;
        }
    }
})