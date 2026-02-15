import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "@auth/core/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const res = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                        nickname: credentials.nickname,
                    }),
                    headers: { "Content-Type": "application/json" }
                });

                const data = await res.json();

                if (res.ok && data) {
                    // Backend 응답: { access_token, user: { id, email, nickname } }
                    return {
                        id: String(data.user.id),
                        email: data.user.email,
                        nickname: data.user.nickname,
                        access_token: data.access_token, // JWT 토큰 포함
                    };
                }
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.nickname = user.nickname;
                token.accessToken = user.access_token; // JWT 토큰 저장
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email as string;
                session.user.nickname = token.nickname as string;
            }
            session.accessToken = token.accessToken as string; // 세션에 JWT 토큰 전달
            return session;
        }
    }
})